import { supabase, isSupabaseConfigured } from './supabase';
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

// Local storage keys for resilient fallback
const STORAGE_KEYS = {
  POSTS: 'ifps_posts_store',
  CONTENT_TYPES: 'ifps_content_types_store',
  CATEGORIES: 'ifps_categories_store',
  SETTINGS: 'ifps_settings_store',
  NAVIGATION: 'ifps_navigation_store',
  MESSAGES: 'ifps_messages_store',
  AUDIT_LOGS: 'ifps_audit_logs_store',
  DOCUMENTS: 'ifps_documents_store',
};

// Helper to broadcast changes across open pages and components
export function broadcastContentUpdate(entityType?: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ifps_content_updated', {
        detail: { entityType, timestamp: Date.now() },
      })
    );
  }
}

// Helper to initialize local storage if needed
function getStoredData<T>(key: string, initial: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch {
    return initial;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    broadcastContentUpdate(key);
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// ------------------------------------------------------------------------------
// 1. CONTENT TYPES
// ------------------------------------------------------------------------------
export async function getContentTypes(): Promise<ContentType[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('content_types')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!error && data && data.length > 0) return data;
  }
  return getStoredData<ContentType[]>(STORAGE_KEYS.CONTENT_TYPES, INITIAL_CONTENT_TYPES);
}

export async function createContentType(type: Omit<ContentType, 'id'>): Promise<ContentType> {
  const newType: ContentType = {
    ...type,
    id: `ct-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('content_types')
      .insert(type)
      .select()
      .single();
    if (!error && data) return data;
  }

  const types = await getContentTypes();
  types.push(newType);
  setStoredData(STORAGE_KEYS.CONTENT_TYPES, types);
  await logAdminAction('CREATE', 'section', newType.id, { name: newType.name_ar });
  return newType;
}

export async function updateContentType(id: string, updates: Partial<ContentType>): Promise<ContentType> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('content_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) return data;
  }

  const types = await getContentTypes();
  const index = types.findIndex(t => t.id === id);
  if (index !== -1) {
    types[index] = { ...types[index], ...updates };
    setStoredData(STORAGE_KEYS.CONTENT_TYPES, types);
    await logAdminAction('UPDATE', 'section', id, updates);
    return types[index];
  }
  throw new Error('Content type not found');
}

// ------------------------------------------------------------------------------
// 2. CATEGORIES
// ------------------------------------------------------------------------------
export async function getCategories(contentTypeId?: string): Promise<Category[]> {
  if (isSupabaseConfigured) {
    let query = supabase.from('categories').select('*');
    if (contentTypeId) {
      query = query.eq('content_type_id', contentTypeId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data;
  }

  const all = getStoredData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  if (contentTypeId) {
    return all.filter(c => c.content_type_id === contentTypeId);
  }
  return all;
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    if (!error && data) return data;
  }

  const cats = await getCategories();
  cats.push(newCat);
  setStoredData(STORAGE_KEYS.CATEGORIES, cats);
  await logAdminAction('CREATE', 'category', newCat.id, { name: newCat.name_ar });
  return newCat;
}

// ------------------------------------------------------------------------------
// 3. POSTS
// ------------------------------------------------------------------------------
export interface GetPostsOptions {
  contentTypeSlug?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
  isFeatured?: boolean;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<{ posts: Post[]; total: number }> {
  const { contentTypeSlug, status, search, limit = 50, offset = 0, isFeatured } = options;

  if (isSupabaseConfigured) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        content_types!inner (slug, name_ar)
      `, { count: 'exact' });

    if (contentTypeSlug) {
      query = query.eq('content_types.slug', contentTypeSlug);
    }
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'published').is('deleted_at', null);
    }
    if (isFeatured !== undefined) {
      query = query.eq('is_featured', isFeatured);
    }
    if (search) {
      query = query.or(`title_ar.ilike.%${search}%,summary_ar.ilike.%${search}%`);
    }

    query = query.order('is_pinned', { ascending: false })
                 .order('published_at', { ascending: false })
                 .range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (!error && data) {
      const formatted: Post[] = data.map(item => ({
        ...item,
        content_type_slug: item.content_types?.slug,
        content_type_name_ar: item.content_types?.name_ar,
      }));
      return { posts: formatted, total: count || formatted.length };
    }
  }

  // Resilient fallback store
  let all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);

  // Filter by soft delete
  all = all.filter(p => !p.deleted_at);

  if (contentTypeSlug) {
    all = all.filter(p => p.content_type_slug === contentTypeSlug);
  }
  if (status) {
    all = all.filter(p => p.status === status);
  } else {
    all = all.filter(p => p.status === 'published');
  }
  if (isFeatured !== undefined) {
    all = all.filter(p => p.is_featured === isFeatured);
  }
  if (search) {
    const q = search.toLowerCase();
    all = all.filter(p => 
      p.title_ar.toLowerCase().includes(q) || 
      p.summary_ar.toLowerCase().includes(q)
    );
  }

  // Sort pinned first, then by published date descending
  all.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

  const total = all.length;
  const paged = all.slice(offset, offset + limit);
  return { posts: paged, total };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, content_types!inner(slug, name_ar)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (!error && data) {
      return {
        ...data,
        content_type_slug: data.content_types?.slug,
        content_type_name_ar: data.content_types?.name_ar,
      };
    }
  }

  const all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const found = all.find(p => p.slug === slug && !p.deleted_at);
  return found || null;
}

export async function getPostById(id: string): Promise<Post | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, content_types!inner(slug, name_ar)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return {
        ...data,
        content_type_slug: data.content_types?.slug,
        content_type_name_ar: data.content_types?.name_ar,
      };
    }
  }

  const all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  return all.find(p => p.id === id) || null;
}

export async function createPost(postData: Partial<Post>): Promise<Post> {
  const types = await getContentTypes();
  const selectedType = types.find(t => t.id === postData.content_type_id) || types[0];

  const newPost: Post = {
    id: `post-${Date.now()}`,
    content_type_id: selectedType.id,
    content_type_slug: selectedType.slug,
    content_type_name_ar: selectedType.name_ar,
    title_ar: postData.title_ar || 'منشور جديد',
    title_en: postData.title_en || '',
    slug: postData.slug || `post-${Date.now()}`,
    summary_ar: postData.summary_ar || '',
    summary_en: postData.summary_en || '',
    content_ar: postData.content_ar || '',
    content_en: postData.content_en || '',
    featured_image: postData.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    status: postData.status || 'draft',
    is_pinned: postData.is_pinned || false,
    is_featured: postData.is_featured || false,
    published_at: postData.status === 'published' ? new Date().toISOString() : postData.published_at,
    scheduled_for: postData.scheduled_for,
    metadata: postData.metadata || {},
    seo_title: postData.seo_title || postData.title_ar,
    seo_description: postData.seo_description || postData.summary_ar,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content_type_id: newPost.content_type_id,
        title_ar: newPost.title_ar,
        title_en: newPost.title_en,
        slug: newPost.slug,
        summary_ar: newPost.summary_ar,
        summary_en: newPost.summary_en,
        content_ar: newPost.content_ar,
        content_en: newPost.content_en,
        featured_image: newPost.featured_image,
        status: newPost.status,
        is_pinned: newPost.is_pinned,
        is_featured: newPost.is_featured,
        published_at: newPost.published_at,
        scheduled_for: newPost.scheduled_for,
        metadata: newPost.metadata,
        seo_title: newPost.seo_title,
        seo_description: newPost.seo_description,
      })
      .select()
      .single();

    if (!error && data) {
      await logAdminAction('CREATE', 'post', data.id, { title: newPost.title_ar });
      broadcastContentUpdate('posts');
      return { ...data, content_type_slug: selectedType.slug, content_type_name_ar: selectedType.name_ar };
    }
  }

  const all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  all.unshift(newPost);
  setStoredData(STORAGE_KEYS.POSTS, all);
  await logAdminAction('CREATE', 'post', newPost.id, { title: newPost.title_ar });
  return newPost;
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post> {
  const updatedTime = new Date().toISOString();
  const cleanUpdates = {
    ...updates,
    updated_at: updatedTime,
    ...(updates.status === 'published' && !updates.published_at ? { published_at: updatedTime } : {}),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('posts')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction('UPDATE', 'post', id, { title: updates.title_ar });
      broadcastContentUpdate('posts');
      return data;
    }
  }

  const all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  const index = all.findIndex(p => p.id === id);
  if (index !== -1) {
    all[index] = { ...all[index], ...cleanUpdates };
    setStoredData(STORAGE_KEYS.POSTS, all);
    await logAdminAction('UPDATE', 'post', id, { title: all[index].title_ar });
    return all[index];
  }
  throw new Error('Post not found');
}

export async function deletePost(id: string, softDelete = true): Promise<void> {
  if (isSupabaseConfigured) {
    if (softDelete) {
      await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
    } else {
      await supabase.from('posts').delete().eq('id', id);
    }
  }

  const all = getStoredData<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  if (softDelete) {
    const updated = all.map(p => p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p);
    setStoredData(STORAGE_KEYS.POSTS, updated);
  } else {
    const filtered = all.filter(p => p.id !== id);
    setStoredData(STORAGE_KEYS.POSTS, filtered);
  }
  await logAdminAction('DELETE', 'post', id);
}

// ------------------------------------------------------------------------------
// 4. SITE SETTINGS
// ------------------------------------------------------------------------------
export async function getSettings(): Promise<Record<string, SiteSetting>> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data && data.length > 0) {
      const map: Record<string, SiteSetting> = {};
      data.forEach(item => { map[item.key] = item; });
      return map;
    }
  }
  return getStoredData<Record<string, SiteSetting>>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function updateSetting(key: string, value_ar: string, value_en?: string): Promise<SiteSetting> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value_ar, value_en, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (!error && data) {
      broadcastContentUpdate('settings');
      return data;
    }
  }

  const settings = await getSettings();
  const updated: SiteSetting = {
    key,
    value_ar,
    value_en: value_en || settings[key]?.value_en || '',
    description: settings[key]?.description || '',
    category: settings[key]?.category || 'general',
    is_public: true,
    updated_at: new Date().toISOString(),
  };
  settings[key] = updated;
  setStoredData(STORAGE_KEYS.SETTINGS, settings);
  await logAdminAction('SETTINGS_UPDATE', 'setting', key, { value_ar });
  return updated;
}

// ------------------------------------------------------------------------------
// 5. NAVIGATION ITEMS
// ------------------------------------------------------------------------------
export async function getNavigationItems(): Promise<NavigationItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.filter(item => item.path !== '/opportunities');
    }
  }
  const items = getStoredData<NavigationItem[]>(STORAGE_KEYS.NAVIGATION, INITIAL_NAVIGATION);
  return items.filter(item => item.is_active && item.path !== '/opportunities');
}

export async function saveNavigationItems(items: NavigationItem[]): Promise<NavigationItem[]> {
  if (isSupabaseConfigured) {
    await supabase.from('navigation_items').upsert(items);
  }
  setStoredData(STORAGE_KEYS.NAVIGATION, items);
  await logAdminAction('UPDATE', 'setting', 'navigation', { count: items.length });
  return items;
}

// ------------------------------------------------------------------------------
// 6. CONTACT MESSAGES
// ------------------------------------------------------------------------------
export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'created_at' | 'is_read' | 'is_archived'>
): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data: inserted, error } = await supabase
      .from('contact_messages')
      .insert(newMsg)
      .select()
      .single();
    if (!error && inserted) return inserted;
  }

  const msgs = getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  msgs.unshift(newMsg);
  setStoredData(STORAGE_KEYS.MESSAGES, msgs);
  return newMsg;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
}

export async function markContactMessageRead(id: string, is_read: boolean): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('contact_messages').update({ is_read }).eq('id', id);
  }
  const msgs = await getContactMessages();
  const updated = msgs.map(m => m.id === id ? { ...m, is_read } : m);
  setStoredData(STORAGE_KEYS.MESSAGES, updated);
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('contact_messages').delete().eq('id', id);
  }
  const msgs = await getContactMessages();
  setStoredData(STORAGE_KEYS.MESSAGES, msgs.filter(m => m.id !== id));
}

// ------------------------------------------------------------------------------
// 7. AUDIT LOGS
// ------------------------------------------------------------------------------
export async function logAdminAction(
  action: AuditLog['action'], 
  entity_type: AuditLog['entity_type'], 
  entity_id?: string, 
  details?: any
): Promise<void> {
  const log: AuditLog = {
    id: `log-${Date.now()}`,
    admin_email: 'admin@iraqifps.org',
    action,
    entity_type,
    entity_id,
    details,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    await supabase.from('audit_logs').insert(log);
  }

  const logs = getStoredData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  logs.unshift(log);
  if (logs.length > 200) logs.pop();
  setStoredData(STORAGE_KEYS.AUDIT_LOGS, logs);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) return data;
  }
  return getStoredData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
}

// ------------------------------------------------------------------------------
// 8. PDF DOCUMENTS & DOWNLOADS
// ------------------------------------------------------------------------------
export async function getPDFDocuments(): Promise<PDFDocument[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return getStoredData<PDFDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
}

export async function createPDFDocument(doc: Omit<PDFDocument, 'id' | 'created_at'>): Promise<PDFDocument> {
  const newDoc: PDFDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    downloads_count: doc.downloads_count || 0,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('pdf_documents')
      .insert(newDoc)
      .select()
      .single();
    if (!error && data) {
      await logAdminAction('CREATE', 'document', data.id, { title: data.title });
      return data;
    }
  }

  const docs = await getPDFDocuments();
  const updated = [newDoc, ...docs];
  setStoredData(STORAGE_KEYS.DOCUMENTS, updated);
  await logAdminAction('CREATE', 'document', newDoc.id, { title: newDoc.title });
  return newDoc;
}

export async function updatePDFDocument(id: string, updates: Partial<PDFDocument>): Promise<PDFDocument> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('pdf_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      await logAdminAction('UPDATE', 'document', id, updates);
      return data;
    }
  }

  const docs = await getPDFDocuments();
  const index = docs.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Document not found');
  const updatedDoc = { ...docs[index], ...updates };
  docs[index] = updatedDoc;
  setStoredData(STORAGE_KEYS.DOCUMENTS, docs);
  await logAdminAction('UPDATE', 'document', id, updates);
  return updatedDoc;
}

export async function deletePDFDocument(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('pdf_documents').delete().eq('id', id);
  }
  const docs = await getPDFDocuments();
  const target = docs.find(d => d.id === id);
  const filtered = docs.filter(d => d.id !== id);
  setStoredData(STORAGE_KEYS.DOCUMENTS, filtered);
  await logAdminAction('DELETE', 'document', id, { title: target?.title });
}

export async function incrementDocumentDownload(id: string): Promise<void> {
  const docs = await getPDFDocuments();
  const doc = docs.find(d => d.id === id);
  if (doc) {
    const newCount = (doc.downloads_count || 0) + 1;
    if (isSupabaseConfigured) {
      await supabase.from('pdf_documents').update({ downloads_count: newCount }).eq('id', id);
    }
    const updated = docs.map(d => d.id === id ? { ...d, downloads_count: newCount } : d);
    setStoredData(STORAGE_KEYS.DOCUMENTS, updated);
  }
}

