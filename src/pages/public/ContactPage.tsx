import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Facebook, 
  Instagram, 
  ShieldCheck
} from 'lucide-react';
import { submitContactMessage } from '../../lib/db';
import { SEO } from '../../components/common/SEO';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).');
      return;
    }

    // Cooldown rate-limit check (SEC-05)
    const lastSubmitTime = localStorage.getItem('ifps_last_contact_submit');
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime, 10) < 60000) {
      const waitSeconds = Math.ceil((60000 - (Date.now() - parseInt(lastSubmitTime, 10))) / 1000);
      setStatus('error');
      setErrorMessage(`يرجى الانتظار ${waitSeconds} ثانية قبل إرسال رسالة جديدة لحماية النظام من الإغراق.`);
      return;
    }

    if (formData.message.length > 3000) {
      setStatus('error');
      setErrorMessage('نص الرسالة طويل جداً، الحد الأقصى المسموح به هو 3000 حرف.');
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
      localStorage.setItem('ifps_last_contact_submit', Date.now().toString());
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
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="اتصل بنا" 
        description="التواصل الرسمي مع إدارة جمعية أطباء الأسرة العراقية (IFPS)، قنوات المراسلة الآمنة والاستفسارات المهنية."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <Mail className="w-3.5 h-3.5" />
            <span>قنوات المراسلة المعتمدة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            اتصل بإدارة الجمعية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            يسعدنا استقبال استفسارات الزملاء الأطباء والمؤسسات الصحية في كافة محافظات العراق
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl space-y-5">
              <div className="flex items-center gap-3 pb-5 border-b border-navy-800">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0">
                  <img 
                    src="/fps.png" 
                    alt="IFPS" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">المقر العام للجمعية</h3>
                  <span className="text-xs text-medical-300 font-medium">بغداد — جمهورية العراق</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm font-normal">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-xs mb-0.5">البريد الإلكتروني:</span>
                    <a 
                      href="mailto:info@iraqifps.org" 
                      className="font-bold text-white hover:text-medical-300 transition-colors font-sans"
                    >
                      info@iraqifps.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-xs mb-0.5">العنوان:</span>
                    <span className="text-slate-200">بغداد، جمهورية العراق</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-navy-800">
                <span className="block text-xs text-slate-400 mb-2.5 font-medium">حسابات التواصل الاجتماعي:</span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://facebook.com/iraqi.fps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-medical-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Facebook className="w-4 h-4 text-medical-400" />
                    <span>iraqi.fps</span>
                  </a>

                  <a
                    href="https://instagram.com/iraqi.fps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-medical-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Instagram className="w-4 h-4 text-medical-400" />
                    <span>iraqi.fps</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center gap-3 text-xs text-slate-600 font-normal">
              <ShieldCheck className="w-5 h-5 text-medical-500 shrink-0" />
              <span>يتم استقبال كافة الرسائل ومتابعتها بسرية تامة من قبل المعنيين في الجمعية.</span>
            </div>
          </div>

          {/* Secure Message Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft space-y-5">
              <div>
                <h2 className="text-xl font-black text-navy-900 mb-1">إرسال استفسار أو رسالة</h2>
                <p className="text-xs text-slate-500 font-normal">يرجى كتابة تفاصيل استفسارك وسيتم الرد عليكم عبر البريد الإلكتروني.</p>
              </div>

              {status === 'success' ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold">تم إرسال رسالتكم بنجاح</h3>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    شكراً لتواصلكم مع جمعية أطباء الأسرة العراقية. تم استلام رسالتكم وسيتم الرد في أقرب وقت.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
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

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
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
                        placeholder="د. الاسم واللقب"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
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
                        placeholder="example@domain.com"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium text-left"
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
                        placeholder="07XXXXXXXXX"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium text-left"
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
                        placeholder="مثال: استفسار حول منظومة CPD-s"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-1.5">
                      نص الرسالة أو الاستفسار <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب استفسارك هنا بكل وضوح..."
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto px-8 py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'جارِ الإرسال...' : 'إرسال الرسالة'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
