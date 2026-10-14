import { put } from '@vercel/blob';
import { verifyAdminToken, getClientIp, checkRateLimit } from './_auth_util.js';

export const config = {
  api: {
    bodyParser: false, // Disabling body parser to stream raw body
  },
};

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip, 30, 60); // 30 uploads per minute max
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  const auth = await verifyAdminToken(req);
  if (!auth.isValid) {
    return res.status(401).json({ error: 'Unauthorized: Admin privileges required to upload files.' });
  }

  try {
    const filename = req.query.filename || `upload-${Date.now()}`;
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    
    // Read the stream and upload
    const blob = await put(filename, req, {
      access: 'public', // Images and PDFs should be public
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: contentType,
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
