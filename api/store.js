// Vercel Serverless Function to manage IFPS central store on Vercel Blob
// Protected with server-side HMAC authorization, rate limiting, and zero-latency reads.

import { get, put } from '@vercel/blob';
import {
  getClientIp,
  checkRateLimit,
  verifyAdminToken,
} from './_auth_util.js';

let lastSavedPayload = null;
let lastSavedTimestamp = 0;

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ip = getClientIp(req);

  // Rate Limiting check
  const maxReqs = (req.method === 'GET' ? 200 : 60);
  const rateLimit = checkRateLimit(ip, maxReqs, 60);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `تم تجاوز معدل الطلبات المسموح به. يرجى الانتظار ${rateLimit.retryAfter} ثانية.`,
    });
  }

  const token = 
    process.env.BLOB_READ_WRITE_TOKEN || 
    'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';

  const STORE_PATHNAME = 'ifps_store.json';
  const STORE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/ifps_store.json';

  // Always disable caching on the API endpoint so updates are instant globally
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  // -------------------------------------------------------------------------
  // GET: Public read-only access directly from Vercel Blob SDK (Zero CDN Cache)
  // -------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const blobResult = await get(STORE_URL, {
        token,
        access: 'private',
      });

      if (blobResult && blobResult.stream) {
        const data = await new Response(blobResult.stream).json();

        // Monotonic check: prefer recently saved payload if cloud replica is momentarily lagging
        if (
          lastSavedPayload && 
          lastSavedPayload.last_updated && 
          new Date(lastSavedPayload.last_updated).getTime() > new Date(data.last_updated || 0).getTime()
        ) {
          return res.status(200).json(lastSavedPayload);
        }

        return res.status(200).json(data);
      }

      if (lastSavedPayload) {
        return res.status(200).json(lastSavedPayload);
      }

      return res.status(404).json({ error: 'Store blob not found' });
    } catch (err) {
      if (lastSavedPayload) {
        return res.status(200).json(lastSavedPayload);
      }
      console.error('Error fetching store from Vercel Blob SDK:', err);
      return res.status(500).json({ error: 'Server error reading store', details: err.message });
    }
  }

  // -------------------------------------------------------------------------
  // POST / PUT: Requires Valid Admin Authentication Token
  // -------------------------------------------------------------------------
  if (req.method === 'POST' || req.method === 'PUT') {
    // 1. Mandatory Authorization Check (SEC-01)
    const authHeader = req.headers['authorization'];
    const adminToken = 
      req.headers['x-admin-token'] || 
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!adminToken) {
      return res.status(401).json({ 
        error: 'غير مصرح: يجب تسجيل الدخول بصلاحيات الإدارة لتطبيق التعديلات على الموقع (Missing Authorization Token).' 
      });
    }

    const verified = verifyAdminToken(adminToken);
    if (!verified || verified.role !== 'admin') {
      return res.status(403).json({ 
        error: 'رمز التحقق الإداري غير صالح أو منتهي الصلاحية، يرجى تسجيل الدخول مجدداً (Invalid or Expired Admin Token).' 
      });
    }

    // 2. Validate Payload
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON body' });
        }
      }

      if (!payload || !Array.isArray(payload.posts)) {
        return res.status(400).json({ error: 'Invalid store payload: posts array required' });
      }

      payload.last_updated = new Date().toISOString();
      lastSavedPayload = payload;
      lastSavedTimestamp = Date.now();

      const blobResult = await put(STORE_PATHNAME, JSON.stringify(payload), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
        contentType: 'application/json',
      });

      return res.status(200).json({
        success: true,
        last_updated: payload.last_updated,
        result: blobResult
      });
    } catch (err) {
      console.error('Error saving store to Vercel Blob SDK:', err);
      return res.status(500).json({ error: 'Server error saving store', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
