// Vercel Serverless Function to manage IFPS central store on Vercel Blob
// Bypasses browser CORS restrictions and provides real-time no-cache reads & writes.

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = 
    process.env.BLOB_READ_WRITE_TOKEN || 
    process.env.VITE_BLOB_READ_WRITE_TOKEN || 
    'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';

  const BLOB_STORE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/ifps_store.json';
  const BLOB_PUT_API = 'https://blob.vercel-storage.com/ifps_store.json';

  // Always disable caching on the API endpoint so updates are instant globally
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  // -------------------------------------------------------------------------
  // GET: Fetch the latest store from Vercel Blob
  // -------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${BLOB_STORE_URL}?_nocache=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: 'Failed to read store from Vercel Blob',
          status: response.status 
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching store from Vercel Blob:', err);
      return res.status(500).json({ error: 'Server error reading store', details: err.message });
    }
  }

  // -------------------------------------------------------------------------
  // POST / PUT: Save store payload to Vercel Blob
  // -------------------------------------------------------------------------
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON body' });
        }
      }

      if (!payload || !Array.isArray(payload.posts)) {
        return res.status(400).json({ error: 'Invalid store payload: posts array required' });
      }

      payload.last_updated = new Date().toISOString();

      const blobRes = await fetch(BLOB_PUT_API, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-version': '7',
          'x-vercel-blob-access': 'private',
          'x-add-random-suffix': '0',
          'x-allow-overwrite': '1',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!blobRes.ok) {
        const errText = await blobRes.text();
        console.error('Blob PUT error:', blobRes.status, errText);
        return res.status(blobRes.status).json({ 
          error: 'Failed to save to Vercel Blob', 
          details: errText 
        });
      }

      const result = await blobRes.json();
      return res.status(200).json({
        success: true,
        last_updated: payload.last_updated,
        result
      });
    } catch (err) {
      console.error('Error saving store to Vercel Blob:', err);
      return res.status(500).json({ error: 'Server error saving store', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
