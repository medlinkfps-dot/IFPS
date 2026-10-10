import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'ifps_admin_hmac_secret_key_2026_super_secure_981273';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'Allawi@91';

// In-memory rate limiting tracker (per serverless container)
const failedAttempts = new Map(); // ip -> { count, resetAt }
const requestCounts = new Map();  // ip -> { count, resetAt }

export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}

export function checkRateLimit(ip, maxRequests = 60, windowSeconds = 60) {
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetAt: now + windowSeconds * 1000 };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowSeconds * 1000;
    requestCounts.set(ip, entry);
    return { allowed: true };
  }

  entry.count += 1;
  requestCounts.set(ip, entry);

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = failedAttempts.get(ip) || { count: 0, resetAt: now + 300000 }; // 5 min window

  if (now > entry.resetAt) {
    failedAttempts.delete(ip);
    return { allowed: true };
  }

  if (entry.count >= 5) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = failedAttempts.get(ip) || { count: 0, resetAt: now + 300000 };
  entry.count += 1;
  failedAttempts.set(ip, entry);
}

export function clearFailedLogin(ip) {
  failedAttempts.delete(ip);
}

export function verifyAdminPassword(inputPassword) {
  if (!inputPassword || typeof inputPassword !== 'string') return false;
  // Constant-time comparison to prevent timing attacks
  const bufA = Buffer.from(inputPassword.trim());
  const bufB = Buffer.from(ADMIN_PASSCODE.trim());
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function generateAdminToken(email = 'admin@iraqifps.org') {
  const payload = {
    sub: 'admin-master',
    email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days validity
  };

  const dataB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(dataB64).digest('base64url');
  return `${dataB64}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [dataB64, signature] = parts;

  const expectedSignature = crypto.createHmac('sha256', SECRET).update(dataB64).digest('base64url');
  
  // Timing safe signature verification
  const sigBufA = Buffer.from(signature);
  const sigBufB = Buffer.from(expectedSignature);
  if (sigBufA.length !== sigBufB.length) return null;
  if (!crypto.timingSafeEqual(sigBufA, sigBufB)) return null;

  try {
    const payload = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf8'));
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) return null; // expired
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}
