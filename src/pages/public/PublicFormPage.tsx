import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Home, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getFormBySlug, submitFormResponse } from '../../lib/db';
import { CustomForm, FormField, FormSubmissionFile } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { SEO } from '../../components/common/SEO';

export const PublicFormPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form values: field.id -> string | string[] | FormSubmissionFile
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) return;
    const fetchForm = async () => {
      setLoading(true);
      try {
        const data = await getFormBySlug(slug);
        setForm(data);
      } catch (err) {
        console.error('Error fetching form:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [slug]);

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, isChecked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[fieldId]) ? [...prev[fieldId]] : [];
      if (isChecked) {
        if (!current.includes(option)) current.push(option);
      } else {
        const idx = current.indexOf(option);
        if (idx !== -1) current.splice(idx, 1);
      }
      return { ...prev, [fieldId]: current };
    });
  };

  const handleFileUpload = async (field: FormField, file: File) => {
    setFileErrors(prev => ({ ...prev, [field.id]: '' }));

    // 1. Check file size
    const maxSizeMB = field.maxFileSizeMB || 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileErrors(prev => ({
        ...prev,
        [field.id]: `حجم الملف كبير جداً (${(file.size / (1024 * 1024)).toFixed(1)}MB). الحد الأقصى المسموح به هو ${maxSizeMB}MB.`
      }));
      return;
    }

    // 2. Check file extension
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowed = (field.allowedFileTypes || ['jpg', 'jpeg', 'png', 'webp', 'pdf']).map(e => e.toLowerCase().replace('.', ''));
    if (!allowed.includes(ext)) {
      setFileErrors(prev => ({
        ...prev,
        [field.id]: `صيغة الملف غير مسموح بها (.${ext}). الصيغ المسموحة هي: ${allowed.map(e => '.' + e).join('، ')}`
      }));
      return;
    }

    setUploadingFieldId(field.id);

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `submissions/${Date.now()}-${cleanName}.${ext}`;

      const res = await fetch(`/api/upload?purpose=form_submission&filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!res.ok) {
        throw new Error('فشل رفع الملف إلى السيرفر');
      }

      const blobData = await res.json();
      const submissionFile: FormSubmissionFile = {
        url: blobData.url,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      handleInputChange(field.id, submissionFile);
    } catch (err: any) {
      console.error('File upload error:', err);
      setFileErrors(prev => ({
        ...prev,
        [field.id]: err.message || 'حدث خطأ أثناء رفع الملف، يرجى المحاولة مرة أخرى.'
      }));
    } finally {
      setUploadingFieldId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const val = answers[field.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
          setSubmitError(`يرجى ملء الحقل الإجباري: "${field.label}"`);
          const el = document.getElementById(`field-${field.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitFormResponse(form.id, form.slug, answers);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err?.message || 'حدث خطأ أثناء إرسال الاستمارة، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="جارِ تحميل الاستمارة..." />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container-custom py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">الاستمارة المطلوبة غير متوفرة</h2>
          <p className="text-xs text-slate-500 mb-6">قد يكون تم تغيير رابط الاستمارة أو إزالتها من قبل إدارة الجمعية.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-medical-500 text-white font-bold text-xs"
          >
            <Home className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = form.deadline && new Date(form.deadline).getTime() < Date.now();
  const isClosed = form.status === 'closed' || isExpired;

  return (
    <div className="bg-gradient-to-b from-slate-50 via-medical-50/20 to-white min-h-screen py-12">
      <SEO 
        title={`${form.title} | جمعية أطباء الأسرة العراقية`} 
        description={form.description || 'استمارة واستبيان جمعية أطباء الأسرة العراقية'} 
      />

      <div className="container-custom max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-medical-600 transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{form.title}</span>
        </nav>

        {/* Success Screen */}
        {submitted ? (
          <div className="bg-white rounded-3xl border border-emerald-200/80 p-8 sm:p-12 shadow-lg text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                تم استلام ردك بنجاح!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {form.success_message || 'شكراً لمشاركتك معنا. تم حفظ إجاباتك وبياناتك في سجلات الجمعية.'}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-medical-500 hover:bg-medical-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <Home className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                إرسال رد آخر
              </button>
            </div>
          </div>
        ) : isClosed ? (
          /* Closed Notice Screen */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                عذراً، باب التسجيل أو المشاركة في هذه الاستمارة مغلق حالياً
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {isExpired
                  ? 'انتهى الموعد النهائي المحدد لاستقبال الردود لهذه الاستمارة.'
                  : 'تم إغلاق استقبال الردود من قبل إدارة الجمعية. يمكنك متابعة أنشطتنا القادمة عبر الموقع.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-medical-500 text-white font-bold text-xs"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الرجوع للموقع</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Form */
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-medical-500 via-teal-500 to-navy-900" />
              
              <div className="flex items-center gap-2 text-xs font-bold text-medical-600 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>جمعية أطباء الأسرة العراقية (IFPS)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                {form.title}
              </h1>

              {form.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-3">
                  {form.description}
                </p>
              )}

              {form.deadline && (
                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    آخر موعد للتسجيل: {new Date(form.deadline).toLocaleString('ar-IQ', { dateStyle: 'full', timeStyle: 'short' })}
                  </span>
                </div>
              )}
            </div>

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {form.fields.map((field, idx) => {
                const val = answers[field.id];
                const isFieldUploading = uploadingFieldId === field.id;
                const fieldErr = fileErrors[field.id];

                return (
                  <div
                    key={field.id}
                    id={`field-${field.id}`}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-3 transition-all hover:border-slate-300"
                  >
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-slate-900 mb-1">
                        {idx + 1}. {field.label}
                        {field.required && <span className="text-red-500 mr-1">*</span>}
                      </label>
                      {field.helpText && (
                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                          {field.helpText}
                        </p>
                      )}
                    </div>

                    {/* Short text, email, phone, number */}
                    {['text', 'email', 'phone', 'number'].includes(field.type) && (
                      <input
                        type={field.type === 'phone' ? 'tel' : field.type}
                        required={field.required}
                        value={val || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || 'إجابتك...'}
                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all ${
                          field.type === 'phone' || field.type === 'email' ? 'dir-ltr' : ''
                        }`}
                      />
                    )}

                    {/* Textarea */}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={4}
                        required={field.required}
                        value={val || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || 'اكتب إجابتك هنا...'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all leading-relaxed"
                      />
                    )}

                    {/* Radio */}
                    {field.type === 'radio' && (
                      <div className="space-y-2.5 pt-1">
                        {(field.options || []).map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                              val === opt 
                                ? 'bg-medical-50/50 border-medical-500 text-medical-900 font-bold' 
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/60 text-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`radio-${field.id}`}
                              required={field.required && !val}
                              checked={val === opt}
                              onChange={() => handleInputChange(field.id, opt)}
                              className="w-4 h-4 text-medical-600 focus:ring-medical-500 border-slate-300"
                            />
                            <span className="text-xs sm:text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Checkbox */}
                    {field.type === 'checkbox' && (
                      <div className="space-y-2.5 pt-1">
                        {(field.options || []).map((opt, optIdx) => {
                          const isChecked = Array.isArray(val) && val.includes(opt);
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                                isChecked 
                                  ? 'bg-medical-50/50 border-medical-500 text-medical-900 font-bold' 
                                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/60 text-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                                className="w-4 h-4 rounded text-medical-600 focus:ring-medical-500 border-slate-300"
                              />
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Select */}
                    {field.type === 'select' && (
                      <select
                        required={field.required}
                        value={val || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                      >
                        <option value="">-- اختر إجابة من القائمة --</option>
                        {(field.options || []).map((opt, optIdx) => (
                          <option key={optIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {/* File / Image Upload */}
                    {field.type === 'file' && (
                      <div className="space-y-3 pt-1">
                        {val && typeof val === 'object' && val.url ? (
                          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{val.name}</p>
                                <p className="text-[10px] text-slate-500">
                                  {(val.size / (1024 * 1024)).toFixed(2)} MB • تم الرفع بنجاح
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleInputChange(field.id, null)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-all"
                              title="حذف الملف وإعادة الرفع"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label className="border-2 border-dashed border-slate-300 hover:border-medical-500 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-medical-50/20 transition-all text-center">
                              {isFieldUploading ? (
                                <div className="py-2 text-center">
                                  <LoadingSpinner size="md" label="جارِ رفع الملف إلى السيرفر..." />
                                </div>
                              ) : (
                                <>
                                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-medical-500" />
                                  <p className="text-xs font-bold text-slate-700 mb-1">
                                    انقر لاختيار صورة أو ملف من جهازك
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    الصيغ المسموحة: {(field.allowedFileTypes || ['jpg', 'png', 'pdf']).map(e => '.' + e).join('، ')} (الحد الأقصى {field.maxFileSizeMB || 5}MB)
                                  </p>
                                </>
                              )}
                              <input
                                type="file"
                                disabled={isFieldUploading}
                                className="hidden"
                                accept={(field.allowedFileTypes || ['jpg', 'png', 'pdf']).map(e => `.${e}`).join(',')}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(field, file);
                                }}
                              />
                            </label>
                            {fieldErr && (
                              <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{fieldErr}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || Boolean(uploadingFieldId)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" label="جارِ إرسال الرد..." />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{form.submit_button_text || 'إرسال الاستمارة الآن'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
