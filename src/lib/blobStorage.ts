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
    last_updated: new Date().toISOString(),
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
 * Fetches from /api/store with cache-busting, falling back to local cache if offline.
 */
export async function getBlobStore(forceFresh = false): Promise<BlobStoreData> {
  const cached = getLocalCache();

  // If memory store exists and not forcing fresh, return instantly and sync in background
  if (!forceFresh && inMemoryStore && inMemoryStore.posts && inMemoryStore.posts.length > 0) {
    syncFromCloudInBackground();
    return inMemoryStore;
  }

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
          setLocalCache(cloudData);
          return cloudData;
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

let backgroundSyncTimeout: any = null;
function syncFromCloudInBackground() {
  if (backgroundSyncTimeout) return;
  backgroundSyncTimeout = setTimeout(async () => {
    backgroundSyncTimeout = null;
    try {
      const apiRes = await fetch(`/api/store?_t=${Date.now()}`, {
        cache: 'no-store',
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const cloudData = await apiRes.json();
        if (cloudData && Array.isArray(cloudData.posts) && cloudData.settings) {
          if (!inMemoryStore || cloudData.last_updated !== inMemoryStore.last_updated) {
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
  }, 300);
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
export async function saveBlobStore(data: BlobStoreData): Promise<void> {
  data.last_updated = new Date().toISOString();
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
  }
}
