import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  FileText,
  CheckSquare,
  CircleDot,
  ListFilter,
  UploadCloud,
  Hash,
  Mail,
  Phone,
  AlignLeft,
  Settings,
  Calendar,
  HelpCircle,
  GripVertical
} from 'lucide-react';
import { getFormById, createForm, updateForm } from '../../lib/db';
import { CustomForm, FormField, FormFieldType } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminFormEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Meta State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'open' | 'closed'>('open');
  const [deadline, setDeadline] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('إرسال الاستمارة');
  const [successMessage, setSuccessMessage] = useState('تم استلام ردك بنجاح. شكراً لمشاركتك معنا!');

  // Form Fields State
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      const loadForm = async () => {
        try {
          const form = await getFormById(id);
          if (form) {
            setTitle(form.title);
            setSlug(form.slug);
            setDescription(form.description || '');
            setStatus(form.status);
            setDeadline(form.deadline || '');
            setSubmitButtonText(form.submit_button_text || 'إرسال الاستمارة');
            setSuccessMessage(form.success_message || 'تم استلام ردك بنجاح. شكراً لمشاركتك معنا!');
            setFields(form.fields || []);
          } else {
            setError('الاستمارة المطلوبة غير موجودة');
          }
        } catch (err) {
          console.error(err);
          setError('فشل في تحميل بيانات الاستمارة');
        } finally {
          setLoading(false);
        }
      };
      loadForm();
    } else {
      // Default initial fields for a new form
      setFields([
        {
          id: `field-${Date.now()}-1`,
          label: 'الاسم الثلاثي واللقب',
          type: 'text',
          placeholder: 'أدخل اسمك الكامل...',
          required: true,
        },
        {
          id: `field-${Date.now()}-2`,
          label: 'رقم الهاتف (واتساب)',
          type: 'phone',
          placeholder: '07xxxxxxxxx',
          required: true,
        },
        {
          id: `field-${Date.now()}-3`,
          label: 'البريد الإلكتروني',
          type: 'email',
          placeholder: 'example@domain.com',
          required: false,
        }
      ]);
    }
  }, [id, isEditing]);

  // Auto-generate slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && (!slug || slug === generateSlug(title))) {
      setSlug(generateSlug(val));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, '-')
      .replace(/[^\w\u0621-\u064A\-]/g, '');
  };

  // Add a new question
  const handleAddField = (type: FormFieldType = 'text') => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      label: type === 'file' ? 'يرجى إرفاق الصورة / الوثيقة المطلوبة' : 'سؤال جديد',
      type,
      placeholder: '',
      helpText: '',
      required: false,
      options: ['radio', 'checkbox', 'select'].includes(type) ? ['الخيار الأول', 'الخيار الثاني'] : undefined,
      allowedFileTypes: type === 'file' ? ['jpg', 'jpeg', 'png', 'webp', 'pdf'] : undefined,
      maxFileSizeMB: type === 'file' ? 5 : undefined,
    };
    setFields(prev => [...prev, newField]);
  };

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    setFields(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleDuplicateField = (index: number) => {
    const original = fields[index];
    const clone: FormField = {
      ...JSON.parse(JSON.stringify(original)),
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      label: `${original.label} (نسخة)`,
    };
    setFields(prev => {
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  };

  const handleDeleteField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setFields(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  // Option management for choice questions
  const handleAddOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    handleUpdateField(fieldIndex, {
      options: [...currentOptions, `خيار ${currentOptions.length + 1}`],
    });
  };

  const handleUpdateOption = (fieldIndex: number, optIndex: number, val: string) => {
    const field = fields[fieldIndex];
    const nextOptions = [...(field.options || [])];
    nextOptions[optIndex] = val;
    handleUpdateField(fieldIndex, { options: nextOptions });
  };

  const handleDeleteOption = (fieldIndex: number, optIndex: number) => {
    const field = fields[fieldIndex];
    const nextOptions = (field.options || []).filter((_, i) => i !== optIndex);
    handleUpdateField(fieldIndex, { options: nextOptions });
  };

  // Allowed file types toggle
  const handleToggleFileType = (fieldIndex: number, ext: string) => {
    const field = fields[fieldIndex];
    const currentTypes = field.allowedFileTypes || [];
    let updated: string[];
    if (currentTypes.includes(ext)) {
      updated = currentTypes.filter(t => t !== ext);
    } else {
      updated = [...currentTypes, ext];
    }
    handleUpdateField(fieldIndex, { allowedFileTypes: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة عنوان للاستمارة');
      return;
    }
    if (!slug.trim()) {
      setError('يرجى تحديد رابط (Slug) للاستمارة');
      return;
    }
    if (fields.length === 0) {
      setError('يرجى إضافة سؤال أو حقل واحد على الأقل في الاستمارة');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        status,
        deadline: deadline || undefined,
        submit_button_text: submitButtonText.trim() || 'إرسال الاستمارة',
        success_message: successMessage.trim() || 'تم استلام ردك بنجاح. شكراً لك!',
        fields,
      };

      if (isEditing && id) {
        await updateForm(id, payload);
      } else {
        await createForm(payload);
      }
      navigate('/admin/forms');
    } catch (err: any) {
      console.error('Save Form Error:', err);
      setError(err?.message || 'حدث خطأ أثناء حفظ الاستمارة');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <LoadingSpinner size="lg" label="جارِ تحميل محرر الاستمارة..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/forms"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            title="العودة للاستمارات"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isEditing ? 'تعديل الاستمارة' : 'إنشاء استمارة واستبيان جديد'}
            </h1>
            <p className="text-xs text-slate-500">
              حدد عنوان الاستمارة، الأسئلة والحقول المطلوبة، وإعدادات رفع الملفات.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/forms"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'جارِ الحفظ...' : 'حفظ ونشر الاستمارة'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-4 h-4 text-teal-600" />
          <span>المعلومات الأساسية للاستمارة</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              عنوان الاستمارة / الاستبيان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="مثال: استمارة التسجيل في المؤتمر السنوي الخامس لطب الأسرة"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرابط المخصص (Slug) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="annual-conference-registration"
                  className="w-full pl-3 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 dir-ltr"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono select-none">
                  /forms/
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                حالة استقبال الردود
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="open">🟢 مفتوحة لاستقبال الردود</option>
                <option value="closed">🔴 مغلقة حالياً</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الوصف أو التعليمات التوضيحية للمشاركين
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تعليمات للمشاركين أو شروط التقديم لتظهر في بداية الاستمارة..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>موعد الإغلاق التلقائي (اختياري)</span>
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 dir-ltr"
              />
              <p className="text-[10px] text-slate-400 mt-1">يتم إغلاق الاستمارة تلقائياً بعد هذا الوقت.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نص زر الإرسال
              </label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                placeholder="إرسال الاستمارة"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رسالة النجاح بعد الإرسال
              </label>
              <input
                type="text"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="تم استلام ردك بنجاح. شكراً لك!"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fields / Questions Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-600" />
              <span>الأسئلة والحقول المطلوبة ({fields.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              يمكنك إضافة أي عدد من الأسئلة بمختلف الأنواع، وترتيبها كما تشاء.
            </p>
          </div>
        </div>

        {/* List of fields */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isChoice = ['radio', 'checkbox', 'select'].includes(field.type);
            const isFile = field.type === 'file';

            return (
              <div 
                key={field.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-soft space-y-4 relative group hover:border-teal-300 transition-all"
              >
                {/* Header row of field card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400">سؤال {index + 1}</span>
                  </div>

                  {/* Actions for this question */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveField(index, 'up')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveField(index, 'down')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateField(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                      title="تكرار السؤال"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Field configuration inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نص السؤال / اسم الحقل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                      placeholder="مثال: التخصص الطبي أو صورة هوية النقابة"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نوع الإجابة / السؤال
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newType = e.target.value as FormFieldType;
                        const updates: Partial<FormField> = { type: newType };
                        if (['radio', 'checkbox', 'select'].includes(newType) && !field.options?.length) {
                          updates.options = ['الخيار الأول', 'الخيار الثاني'];
                        }
                        if (newType === 'file') {
                          updates.allowedFileTypes = updates.allowedFileTypes || ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
                          updates.maxFileSizeMB = updates.maxFileSizeMB || 5;
                        }
                        handleUpdateField(index, updates);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="text">📝 نص قصير (إجابة قصيرة)</option>
                      <option value="textarea">📄 فقرة مطولة (نص متعدد الأسطر)</option>
                      <option value="radio">🔘 اختيار واحد فقط (دوائر اختيار)</option>
                      <option value="checkbox">☑️ اختيار متعدد (مربعات اختيار)</option>
                      <option value="select">📑 قائمة منسدلة</option>
                      <option value="file">📎 رفع صورة أو مستند</option>
                      <option value="phone">📞 رقم هاتف</option>
                      <option value="email">✉️ بريد إلكتروني</option>
                      <option value="number">🔢 رقمي (أرقام فقط)</option>
                    </select>
                  </div>
                </div>

                {/* Sub-inputs: help text, placeholder, required toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      نص توضيحي إضافي (اختياري)
                    </label>
                    <input
                      type="text"
                      value={field.helpText || ''}
                      onChange={(e) => handleUpdateField(index, { helpText: e.target.value })}
                      placeholder="مثال: يرجى كتابة الرقم باللغة الإنجليزية"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {!isChoice && !isFile && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        نص إرشادي داخل الحقل (Placeholder)
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                        placeholder="نص يظهر باهتاً داخل الحقل..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-4 sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800">حقل إجباري (مطلوب)</span>
                    </label>
                  </div>
                </div>

                {/* Specific Settings for Choice Types (Radio, Checkbox, Select) */}
                {isChoice && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">خيارات السؤال:</span>
                      <button
                        type="button"
                        onClick={() => handleAddOption(index)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة خيار آخر</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(field.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">
                            {field.type === 'radio' ? '○' : field.type === 'checkbox' ? '□' : '•'}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleUpdateOption(index, optIdx, e.target.value)}
                            placeholder={`خيار ${optIdx + 1}`}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          {(field.options?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(index, optIdx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                              title="حذف الخيار"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Settings for File Uploads */}
                {isFile && (
                  <div className="mt-3 p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                      <UploadCloud className="w-4 h-4 text-teal-600" />
                      <span>إعدادات الملفات المرفوعة:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                          الصيغ والامتدادات المسموح بها للمشاركين:
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {['jpg', 'jpeg', 'png', 'webp', 'pdf'].map(ext => {
                            const isChecked = (field.allowedFileTypes || []).includes(ext);
                            return (
                              <button
                                key={ext}
                                type="button"
                                onClick={() => handleToggleFileType(index, ext)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                                  isChecked 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                .{ext}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                          الحد الأقصى لحجم الملف المرفوع:
                        </label>
                        <select
                          value={field.maxFileSizeMB || 5}
                          onChange={(e) => handleUpdateField(index, { maxFileSizeMB: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="1">1 ميغابايت (1 MB)</option>
                          <option value="2">2 ميغابايت (2 MB)</option>
                          <option value="5">5 ميغابايت (5 MB - موصى به)</option>
                          <option value="10">10 ميغابايت (10 MB)</option>
                          <option value="25">25 ميغابايت (25 MB)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Question Buttons Bar */}
        <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-3">
          <p className="text-xs font-bold text-slate-600">اختر نوع السؤال لإضافته للاستمارة:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleAddField('text')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>نص قصير</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('textarea')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>فقرة مطولة</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('radio')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>اختيار واحد (دوائر)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('checkbox')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>اختيار متعدد (مربعات)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('select')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>قائمة منسدلة</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('file')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-teal-300 text-teal-700 hover:bg-teal-50 text-xs font-bold shadow-sm transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>رفع صورة / ملف</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('phone')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>رقم هاتف</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddField('email')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>بريد إلكتروني</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Link
          to="/admin/forms"
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all"
        >
          إلغاء
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'جارِ الحفظ...' : 'حفظ ونشر الاستمارة'}</span>
        </button>
      </div>
    </form>
  );
};
