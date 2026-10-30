import { 
  Post, 
  ContentType, 
  Category, 
  SiteSetting, 
  NavigationItem, 
  ContactMessage, 
  AuditLog, 
  PDFDocument,
  CustomForm,
  FormSubmission 
} from '../types';
import { 
  INITIAL_CONTENT_TYPES, 
  INITIAL_CATEGORIES, 
  INITIAL_POSTS, 
  INITIAL_SETTINGS, 
  INITIAL_NAVIGATION, 
  INITIAL_DOCUMENTS 
} from './mockData';
import { getAdminToken } from './auth';

// Cloud store is active via same-origin Serverless API (/api/store)
export const isBlobConfigured = true;

const CURRENT_STORE_VERSION = 2;
const LOCAL_STORAGE_BACKUP_KEY = 'ifps_blob_cache_store_v2';

// Clean legacy caches to prevent stale data from flashing
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ifps_blob_cache_store');
    localStorage.removeItem('ifps_settings_store');
  }
} catch {}

export interface BlobStoreData {
  version: number;
  last_updated: string;
  posts: Post[];
  settings: Record<string, SiteSetting>;
  content_types: ContentType[];
  categories: Category[];
  navigation: NavigationItem[];
  documents: PDFDocument[];
  messages: ContactMessage[];
  audit_logs: AuditLog[];
  forms?: CustomForm[];
  form_submissions?: FormSubmission[];
}

export function getDefaultStoreData(): BlobStoreData {
  return {
    version: CURRENT_STORE_VERSION,
    last_updated: new Date().toISOString(),
    posts: [...INITIAL_POSTS],
    settings: { ...INITIAL_SETTINGS },
    content_types: [...INITIAL_CONTENT_TYPES],
    categories: [...INITIAL_CATEGORIES],
    navigation: [...INITIAL_NAVIGATION],
    documents: [...INITIAL_DOCUMENTS],
    messages: [],
    audit_logs: [],
    forms: [],
    form_submissions: [],
  };
}

let inMemoryStore: BlobStoreData | null = null;
let activeFetchPromise: Promise<BlobStoreData> | null = null;
let initialCloudFetchDone = false;
let lastLocalSaveTime = 0;

// Read cached store from localStorage if available
function getLocalCache(): BlobStoreData {
  if (inMemoryStore) return inMemoryStore;
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.posts) && parsed.settings && parsed.version === CURRENT_STORE_VERSION) {
        inMemoryStore = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local blob cache:', e);
  }
  const defaultData = getDefaultStoreData();
  inMemoryStore = defaultData;
  return defaultData;
}

export function getInitialSettingsSnapshot(): Record<string, SiteSetting> {
  const store = getLocalCache();
  return store?.settings && Object.keys(store.settings).length > 0
    ? store.settings
    : INITIAL_SETTINGS;
}

function setLocalCache(data: BlobStoreData) {
  inMemoryStore = data;
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Storage quota exceeded or error caching blob store:', e);
  }
}

/**
 * Loads the central cloud store.
 * Fetches directly from /api/store to guarantee fresh content from Vercel Blob.
 * If forceFresh is true or initialCloudFetchDone is false, always fetches from network.
 */
export async function getBlobStore(forceFresh = false): Promise<BlobStoreData> {
  const cached = getLocalCache();

  // If memory store exists, initial cloud fetch is already done, and not forcing fresh, return memory store
  if (!forceFresh && inMemoryStore && initialCloudFetchDone) {
    scheduleBackgroundSync();
    return inMemoryStore;
  }

  // De-duplicate concurrent network requests
  if (activeFetchPromise) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    try {
      const apiRes = await fetch(`/api/store?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const cloudData = await apiRes.json();
        if (cloudData && Array.isArray(cloudData.posts) && cloudData.settings) {
          initialCloudFetchDone = true;
          // Protect recent local saves from being overwritten by older cloud responses
          if (Date.now() - lastLocalSaveTime > 10000) {
            setLocalCache(cloudData);
            return cloudData;
          } else if (inMemoryStore) {
            return inMemoryStore;
          }
        }
      }

      return cached;
    } catch (err) {
      console.warn('Network error reading store, using cached store:', err);
      return cached;
    } finally {
      activeFetchPromise = null;
    }
  })();

  return activeFetchPromise;
}

let backgroundSyncTimer: any = null;
function scheduleBackgroundSync() {
  if (backgroundSyncTimer) return;
  // Sync periodically without interrupting the user immediately on page load
  backgroundSyncTimer = setTimeout(async () => {
    backgroundSyncTimer = null;
    // Don't run background sync if admin recently saved
    if (Date.now() - lastLocalSaveTime < 10000) return;

    try {
      const apiRes = await fetch(`/api/store?_t=${Date.now()}`, {
        cache: 'no-store',
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const cloudData = await apiRes.json();
        if (cloudData && Array.isArray(cloudData.posts) && cloudData.settings) {
          const cloudTime = new Date(cloudData.last_updated || 0).getTime();
          const localTime = inMemoryStore ? new Date(inMemoryStore.last_updated || 0).getTime() : 0;
          
          // CRITICAL: Only overwrite local store and notify if cloud is strictly newer and different
          if (cloudTime > localTime) {
            const hasChanged = JSON.stringify(cloudData.settings) !== JSON.stringify(inMemoryStore?.settings);
            setLocalCache(cloudData);
            if (hasChanged && typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('ifps_content_updated', { detail: { source: 'cloud_sync' } })
              );
            }
          }
        }
      }
    } catch {
      // Quiet background failure
    }
  }, 30000);
}

/**
 * Pushes full store payload to cloud via /api/store.
 * Authenticates using cryptographically signed admin token.
 */
async function pushBlobStoreToCloud(data: BlobStoreData): Promise<{ success: boolean; error?: string }> {
  try {
    const adminToken = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
      headers['x-admin-token'] = adminToken;
    }

    const apiRes = await fetch('/api/store', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).catch((err) => ({ ok: false, status: 0, text: async () => err.message } as any));

    if (apiRes && apiRes.ok) {
      const resJson = await apiRes.json();
      if (resJson.last_updated) {
        data.last_updated = resJson.last_updated;
        setLocalCache(data);
      }
      return { success: true };
    }

    let errorDetail = '';
    try {
      const resText = await apiRes.text();
      try {
        const parsed = JSON.parse(resText);
        errorDetail = parsed.error || resText;
      } catch {
        errorDetail = resText;
      }
    } catch {}

    const fullErrMsg = errorDetail || `HTTP ${apiRes.status}`;
    console.error('Failed to write to store API:', fullErrMsg);
    return { success: false, error: fullErrMsg };
  } catch (err: any) {
    console.error('Failed to write to store API:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Saves modifications to both local cache and cloud Vercel Blob.
 * Awaits server sync to ensure changes are permanently stored on cloud before resolving.
 */
export async function saveBlobStore(data: BlobStoreData): Promise<boolean> {
  const now = new Date().toISOString();
  data.last_updated = now;
  lastLocalSaveTime = Date.now();
  initialCloudFetchDone = true;
  setLocalCache(data);

  // Broadcast update immediately to open UI components in the current tab
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ifps_content_updated', {
        detail: { timestamp: Date.now() },
      })
    );
  }

  // Push to Serverless API
  const res = await pushBlobStoreToCloud(data);
  if (!res.success) {
    throw new Error(res.error || 'فشل حفظ وتطبيق التعديلات على السحابة، يرجى التأكد من تسجيل الدخول والاتصال بالإنترنت.');
  }
  return true;
}
