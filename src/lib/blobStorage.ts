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

export const BLOB_READ_WRITE_TOKEN = 
  import.meta.env.VITE_BLOB_READ_WRITE_TOKEN || 
  'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';

export const isBlobConfigured = Boolean(
  BLOB_READ_WRITE_TOKEN && 
  BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_')
);

const BLOB_STORE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/ifps_store.json';
const BLOB_PUT_API = 'https://blob.vercel-storage.com/ifps_store.json';
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
 * Loads the central cloud store from Vercel Blob.
 * Uses Stale-While-Revalidate: Returns cached data immediately if available,
 * while syncing newest data from Vercel Blob in the background.
 */
export async function getBlobStore(forceFresh = false): Promise<BlobStoreData> {
  const cached = getLocalCache();

  if (!isBlobConfigured) {
    return cached;
  }

  // If we already have memory cache and not forcing fresh, trigger background sync
  if (!forceFresh && inMemoryStore && inMemoryStore.posts && inMemoryStore.posts.length > 0) {
    // Background sync to ensure updates from other devices arrive
    syncFromCloudInBackground();
    return inMemoryStore;
  }

  if (activeFetchPromise) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    try {
      const res = await fetch(BLOB_STORE_URL, {
        headers: {
          'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
        },
      });

      if (res.ok) {
        const cloudData = await res.json();
        // Check if cloud data is valid and initialized
        if (cloudData && Array.isArray(cloudData.posts) && cloudData.settings) {
          setLocalCache(cloudData);
          return cloudData;
        }
      }

      // If store doesn't exist on blob or has no posts, seed it
      console.log('Vercel Blob store empty or uninitialized. Seeding initial data...');
      const seedData = getDefaultStoreData();
      await pushBlobStoreToCloud(seedData);
      setLocalCache(seedData);
      return seedData;
    } catch (err) {
      console.warn('Network error reading from Vercel Blob, using cached store:', err);
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
      const res = await fetch(BLOB_STORE_URL, {
        headers: {
          'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
        },
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && Array.isArray(cloudData.posts) && cloudData.settings) {
          // If cloud data is newer, update cache and broadcast
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
    } catch (e) {
      // Quiet background failure
    }
  }, 1000);
}

/**
 * Pushes full store payload to Vercel Blob cloud.
 */
async function pushBlobStoreToCloud(data: BlobStoreData): Promise<boolean> {
  if (!isBlobConfigured) return false;
  try {
    const res = await fetch(BLOB_PUT_API, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
        'x-api-version': '7',
        'x-vercel-blob-access': 'private',
        'x-add-random-suffix': '0',
        'x-allow-overwrite': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to write to Vercel Blob:', err);
    return false;
  }
}

/**
 * Saves modifications to both local cache and cloud Vercel Blob.
 */
export async function saveBlobStore(data: BlobStoreData): Promise<void> {
  data.last_updated = new Date().toISOString();
  setLocalCache(data);

  // Broadcast update immediately to open UI components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ifps_content_updated', {
        detail: { timestamp: Date.now() },
      })
    );
  }

  // Push to Vercel Blob in background
  await pushBlobStoreToCloud(data);
}

/**
 * Uploads a file (image or PDF) directly to Vercel Blob.
 */
export async function uploadFileToVercelBlob(file: File): Promise<string | null> {
  if (!isBlobConfigured) return null;
  try {
    const ext = file.name.split('.').pop() || 'bin';
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `uploads/${Date.now()}-${cleanName}.${ext}`;

    const res = await fetch(`https://blob.vercel-storage.com/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
        'x-api-version': '7',
        'x-vercel-blob-access': 'private',
        'x-add-random-suffix': '0',
        'x-allow-overwrite': '1',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (res.ok) {
      const result = await res.json();
      return result.url;
    }
  } catch (e) {
    console.error('Error uploading file to Vercel Blob:', e);
  }
  return null;
}
