import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Facebook, 
  Instagram, 
  ShieldCheck,
  Phone
} from 'lucide-react';
import { submitContactMessage } from '../../lib/db';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/common/Badge';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '', // Spam trap
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam bot trap check
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('يرجى إدخال عنوان بريد إلكتروني صحيح.');
      return;
    }

    setStatus('submitting');
    try {
      await submitContactMessage({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim() || 'استفسار عام عبر الموقع الرسمي',
        message: formData.message.trim(),
      });

      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage('تعذر إرسال الرسالة حالياً، يرجى المحاولة لاحقاً أو مراسلتنا مباشرة عبر info@iraqifps.org');
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="اتصل بنا" 
        description="التواصل الرسمي مع إدارة جمعية أطباء الأسرة العراقية (IFPS)، قنوات المراسلة الآمنة والاستفسارات المهنية."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" size="md" className="mb-3">
            قنوات الاتصال المعتمدة
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            اتصل بجمعية أطباء الأسرة العراقية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            يسعدنا استقبال استفسارات الزملاء الأطباء والمؤسسات الصحية والمهتمين بالرعاية الأولية في العراق.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-950 text-white rounded-3xl p-8 border border-navy-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-navy-800">
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <img 
                    src="https://iraqifps.org/wp-content/uploads/2025/11/photo_2025-11-14_19-45-19.jpg" 
                    alt="IFPS" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">المقر العام للجمعية</h3>
                  <span className="text-xs text-medical-300">بغداد - جمهورية العراق</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-xs mb-0.5">البريد الإلكتروني المعتمد:</span>
                    <a 
                      href="mailto:info@iraqifps.org" 
                      className="font-bold text-white hover:text-medical-300 transition-colors font-sans"
                    >
                      info@iraqifps.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-xs mb-0.5">العنوان الرسمي:</span>
                    <span className="text-slate-200">بغداد، جمهورية العراق</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-navy-800">
                <span className="block text-xs text-slate-400 mb-3 font-medium">قنوات التواصل الاجتماعي الرسمية:</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://facebook.com/iraqi.fps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-medical-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Facebook className="w-4 h-4 text-medical-400" />
                    <span>facebook / iraqi.fps</span>
                  </a>

                  <a
                    href="https://instagram.com/iraqi.fps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-medical-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Instagram className="w-4 h-4 text-medical-400" />
                    <span>instagram / iraqi.fps</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-6 h-6 text-medical-600 shrink-0" />
              <span>يتم استقبال كافة الرسائل ومعالجتها بسرية ومهنية تامة وفق المعايير المؤسسية.</span>
            </div>
          </div>

          {/* Secure Message Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft">
              <h2 className="text-xl font-bold text-navy-900 mb-1">إرسال رسالة أو استفسار رسمي</h2>
              <p className="text-xs text-slate-500 mb-6">يرجى كتابة بياناتك وتفاصيل استفسارك وسيتم الرد عليكم في أقرب وقت.</p>

              {status === 'success' ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold">تم إرسال رسالتكم بنجاح!</h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                    شكراً لتواصلكم مع جمعية أطباء الأسرة العراقية. تم استلام الرسالة في المنظومة الإدارية وسيتم مراجعتها من قبل المعنيين.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Anti-spam Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_honey"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1.5">
                        الاسم الكامل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="د. الاسم الرباعي واللقب"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1.5">
                        البريد الإلكتروني <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-left font-sans"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1.5">
                        رقم الهاتف (اختياري)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+964 7XX XXX XXXX"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-left font-sans"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-900 mb-1.5">
                        موضوع الاستفسار
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="مثال: استفسار عن دورات CPD-s أو العضوية"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1.5">
                      نص الرسالة أو الملاحظات <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب تفاصيل استفسارك هنا..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{status === 'submitting' ? 'جارِ الإرسال...' : 'إرسال الرسالة إلى إدارة الجمعية'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
