import {
  getClientIp,
  checkLoginRateLimit,
  recordFailedLogin,
  clearFailedLogin,
  verifyAdminPassword,
  generateAdminToken,
  verifyAdminToken,
} from './_auth_util.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const ip = getClientIp(req);
    const action = body?.action || 'login';

    // -----------------------------------------------------------------------
    // Action 1: Login
    // -----------------------------------------------------------------------
    if (action === 'login') {
      const rateCheck = checkLoginRateLimit(ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: `تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. يرجى المحاولة بعد ${rateCheck.retryAfter} ثانية.`,
        });
      }

      const { email, password } = body;
      const isPasswordValid = verifyAdminPassword(password);

      if (!isPasswordValid) {
        recordFailedLogin(ip);
        return res.status(401).json({
          success: false,
          error: 'رمز الدخول غير صحيح، يرجى إدخال الرمز المعتمد للإدارة.',
        });
      }

      clearFailedLogin(ip);
      const userEmail = (email && typeof email === 'string' ? email.trim() : 'admin@iraqifps.org');
      const token = generateAdminToken(userEmail);

      const userProfile = {
        id: 'admin-master',
        email: userEmail,
        full_name: 'مدير النظام (IFPS Admin)',
        role: 'admin',
        created_at: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        token,
        user: userProfile,
      });
    }

    // -----------------------------------------------------------------------
    // Action 2: Verify Token
    // -----------------------------------------------------------------------
    if (action === 'verify') {
      const authHeader = req.headers['authorization'];
      const token = body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

      if (!token) {
        return res.status(401).json({ success: false, valid: false, error: 'No token provided' });
      }

      const verified = verifyAdminToken(token);
      if (!verified) {
        return res.status(401).json({ success: false, valid: false, error: 'Token invalid or expired' });
      }

      return res.status(200).json({
        success: true,
        valid: true,
        user: {
          id: verified.sub,
          email: verified.email,
          full_name: 'مدير النظام (IFPS Admin)',
          role: verified.role,
        },
      });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Auth handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
