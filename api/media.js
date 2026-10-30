// Vercel Serverless Function to securely stream media files from private Vercel Blob store
// Provides global edge CDN caching and public access to images and documents.

import { get } from '@vercel/blob';

const MIME_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  json: 'application/json',
  txt: 'text/plain',
};

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawPath = req.query.pathname || req.query.path || req.query.file;
  if (!rawPath || typeof rawPath !== 'string') {
    return res.status(400).json({ error: 'Missing pathname parameter' });
  }

  const token = 
    process.env.BLOB_READ_WRITE_TOKEN || 
    'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';

  const STORE_BASE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/';
  
  // Clean pathname
  let cleanPath = rawPath.trim();
  if (cleanPath.startsWith('http')) {
    // Already full URL
  } else {
    cleanPath = cleanPath.replace(/^\/+/, '');
    cleanPath = STORE_BASE_URL + cleanPath;
  }

  try {
    const blobResult = await get(cleanPath, {
      token,
      access: 'private',
    });

    if (!blobResult || !blobResult.stream) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // Determine content type
    let contentType = blobResult.headers?.get?.('content-type');
    if (!contentType || contentType === 'application/octet-stream') {
      const ext = cleanPath.split('.').pop()?.toLowerCase() || '';
      contentType = MIME_MAP[ext] || 'application/octet-stream';
    }

    const buffer = Buffer.from(await new Response(blobResult.stream).arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, stale-while-revalidate=86400, immutable');
    res.setHeader('CDN-Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=31536000, immutable');

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Error streaming media file:', err);
    return res.status(500).json({ error: 'Error streaming media file', details: err.message });
  }
}
