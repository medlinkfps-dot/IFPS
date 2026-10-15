import { get, put } from '@vercel/blob';
import { getClientIp, checkRateLimit } from './_auth_util.js';

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip, 15, 60); // 15 submissions per minute max per IP
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: `تم تجاوز معدل الإرسال المسموح به. يرجى الانتظار ${rateLimit.retryAfter} ثانية.` 
    });
  }

  const token = 
    process.env.BLOB_READ_WRITE_TOKEN || 
    'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';

  const STORE_PATHNAME = 'ifps_store.json';
  const STORE_URL = 'https://a53ipjjute4ixwxy.private.blob.vercel-storage.com/ifps_store.json';

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { form_id, form_slug, answers } = body || {};
    if (!form_id && !form_slug) {
      return res.status(400).json({ error: 'Missing form_id or form_slug' });
    }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Missing form answers' });
    }

    // Fetch existing store
    const blobResult = await get(STORE_URL, {
      token,
      access: 'private',
    });

    if (!blobResult || !blobResult.stream) {
      return res.status(500).json({ error: 'Unable to load forms store' });
    }

    const store = await new Response(blobResult.stream).json();
    if (!store) {
      return res.status(500).json({ error: 'Failed to parse store data' });
    }

    const forms = Array.isArray(store.forms) ? store.forms : [];
    const targetForm = forms.find(f => f.id === form_id || f.slug === form_slug);

    if (!targetForm) {
      return res.status(404).json({ error: 'الاستمارة غير موجودة' });
    }

    if (targetForm.status === 'closed') {
      return res.status(400).json({ error: 'عذراً، تم إغلاق استقبال الردود لهذه الاستمارة.' });
    }

    if (targetForm.deadline) {
      const deadlineTime = new Date(targetForm.deadline).getTime();
      if (Date.now() > deadlineTime) {
        return res.status(400).json({ error: 'عذراً، انتهى الموعد النهائي المحدد لاستقبال هذه الاستمارة.' });
      }
    }

    const newSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      form_id: targetForm.id,
      form_slug: targetForm.slug,
      answers,
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    };

    if (!Array.isArray(store.form_submissions)) {
      store.form_submissions = [];
    }
    store.form_submissions.unshift(newSubmission);

    targetForm.submission_count = (targetForm.submission_count || 0) + 1;
    store.last_updated = new Date().toISOString();

    // Save updated store
    await put(STORE_PATHNAME, JSON.stringify(store), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
      contentType: 'application/json',
    });

    return res.status(200).json({
      success: true,
      submission: newSubmission,
      message: targetForm.success_message || 'تم استلام ردك بنجاح. شكراً لك!',
    });
  } catch (error) {
    console.error('Submit Form Error:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الإجابات', details: error.message });
  }
}
