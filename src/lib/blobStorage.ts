import { 
  Post, 
  ContentType, 
  Category, 
  SiteSetting, 
  NavigationItem, 
  ContactMessage, 
  AuditLog, 
  PDFDocument 
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

const LOCAL_STORAGE_BACKUP_KEY = 'ifps_blob_cache_store';

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
}

export function getDefaultStoreData(): BlobStoreData {
  return {
    version: 1,
    last_updated: '1970-01-01T00:00:00.000Z',
    posts: [...INITIAL_POSTS],
    settings: { ...INITIAL_SETTINGS },
    content_types: [...INITIAL_CONTENT_TYPES],
    categories: [...INITIAL_CATEGORIES],
    navigation: [...INITIAL_NAVIGATION],
    documents: [...INITIAL_DOCUMENTS],
    messages: [],
    audit_logs: [],
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
      if (parsed && Array.isArray(parsed.posts) && parsed.settings) {
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
          
          // CRITICAL: Only overwrite local store if cloud is STRICTLY NEWER
          if (cloudTime > localTime) {
            setLocalCache(cloudData);
            if (typeof window !== 'undefined') {
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
  }, 1000);
}

/**
 * Pushes full store payload to cloud via /api/store.
 * Authenticates using cryptographically signed admin token.
 */
async function pushBlobStoreToCloud(data: BlobStoreData): Promise<boolean> {
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
    }).catch(() => null);

    if (apiRes && apiRes.ok) {
      const resJson = await apiRes.json();
      if (resJson.last_updated) {
        data.last_updated = resJson.last_updated;
        setLocalCache(data);
      }
      return true;
    }

    if (apiRes && apiRes.status === 401) {
      console.error('Unauthorized: Admin session expired or missing token.');
    }

    return false;
  } catch (err) {
    console.error('Failed to write to store API:', err);
    return false;
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
  const saved = await pushBlobStoreToCloud(data);
  if (!saved) {
    console.warn('Notice: Cloud save did not complete or requires admin authentication.');
    return false;
  }
  return true;
}
