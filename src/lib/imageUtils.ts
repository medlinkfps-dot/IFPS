import { supabase, isSupabaseConfigured } from './supabase';

export interface ProcessedImage {
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

/**
 * Optimizes an image file locally using an HTML Canvas to ensure crisp quality
 * while preventing massive file sizes that slow down loading or fill storage.
 */
export async function optimizeImageFile(file: File, maxDimension = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or GIF, preserve raw data URL to keep vector clarity or animation intact
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Use PNG for transparency if original was PNG, otherwise JPEG
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(outputType, quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads an image file:
 * - If Supabase Storage is configured, attempts cloud upload to bucket.
 * - Otherwise generates an optimized, high-fidelity Base64 data URL that works permanently offline & online.
 */
export async function uploadImageFile(file: File, bucket = 'media'): Promise<ProcessedImage> {
  const optimizedDataUrl = await optimizeImageFile(file);

  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
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
      console.warn('Supabase storage upload failed, falling back to optimized data URL:', e);
    }
  }

  return {
    url: optimizedDataUrl,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
