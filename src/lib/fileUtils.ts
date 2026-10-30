import { isSupabaseConfigured, supabase } from './supabase';

export interface ProcessedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export async function uploadFile(file: File, bucket = 'documents'): Promise<ProcessedFile> {
  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `uploads/${Date.now()}-${cleanName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (urlData?.publicUrl) {
          return {
            url: urlData.publicUrl,
            name: file.name,
            size: file.size,
            type: file.type,
          };
        }
      }
    } catch (e) {
      console.warn('Supabase storage upload failed:', e);
    }
  }

  // Upload to Vercel Blob via our API route
  try {
    const { getAdminToken } = await import('./auth');
    const token = getAdminToken();
    
    const ext = file.name.split('.').pop() || 'pdf';
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `uploads/docs/${Date.now()}-${cleanName}.${ext}`;

    const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        'x-admin-token': token || '',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': file.type,
      },
      body: file, // Raw file
    });

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      return {
        url: data.url, // Vercel Blob returns a URL
        name: file.name,
        size: file.size,
        type: file.type,
      };
    } else {
      console.error('Vercel Blob upload failed:', await uploadRes.text());
      throw new Error('Vercel Blob upload failed');
    }
  } catch (err) {
    console.error('API upload error:', err);
    throw err;
  }
}
