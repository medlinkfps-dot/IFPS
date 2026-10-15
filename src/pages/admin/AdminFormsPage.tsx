import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy, 
  Check, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';
import { getForms, deleteForm, updateForm } from '../../lib/db';
import { CustomForm } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';

export const AdminFormsPage: React.FC = () => {
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const data = await getForms();
      setForms(data);
    } catch (err) {
      console.error('Failed to fetch forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
    const handleUpdate = () => fetchForms();
    window.addEventListener('ifps_content_updated', handleUpdate);
    return () => window.removeEventListener('ifps_content_updated', handleUpdate);
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggleStatus = async (form: CustomForm) => {
    const newStatus = form.status === 'open' ? 'closed' : 'open';
    try {
      await updateForm(form.id, { status: newStatus });
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, status: newStatus } : f));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteForm(id);
      setForms(prev => prev.filter(f => f.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete form:', err);
    }
  };

  const filteredForms = forms.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    f.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSubmissions = forms.reduce((acc, f) => acc + (f.submission_count || 0), 0);
  const activeFormsCount = forms.filter(f => f.status === 'open').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-sm">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">إدارة الاستمارات والاستبيانات (DTform)</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                إنشاء استبيانات واستمارات تسجيل ديناميكية واستقبال الإجابات والمرفقات وتنظيمها.
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/admin/forms/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء استمارة جديدة</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">إجمالي الاستمارات</p>
            <p className="text-2xl font-black text-slate-900">{forms.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">الاستمارات النشطة</p>
            <p className="text-2xl font-black text-emerald-600">{activeFormsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">إجمالي الردود المستلمة</p>
            <p className="text-2xl font-black text-teal-600">{totalSubmissions}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن استمارة بالعنوان، الوصف، أو الرابط..."
          className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-soft"
        />
      </div>

      {/* Forms List */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner size="lg" label="جارِ تحميل الاستمارات..." />
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">لا توجد استمارات حتى الآن</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            يمكنك الآن إنشاء أول استمارة ديناميكية بمختلف أنواع الحقول (نص، خيارات، رفع صور ومستندات) ونشرها فوراً.
          </p>
          <Link
            to="/admin/forms/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء أول استمارة الآن</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredForms.map((form) => {
            const isExpired = form.deadline && new Date(form.deadline).getTime() < Date.now();
            return (
              <div 
                key={form.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-extrabold text-slate-900">{form.title}</h3>
                    {form.status === 'open' && !isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        مفتوحة للتقديم
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        انتهى الموعد النهائي
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        مغلقة
                      </span>
                    )}
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {form.fields.length} حقل / سؤال
                    </span>
                  </div>

                  {form.description && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                      {form.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      تاريخ الإنشاء: {new Date(form.created_at).toLocaleDateString('ar-IQ')}
                    </span>
                    {form.deadline && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        موعد الإغلاق: {new Date(form.deadline).toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px] dir-ltr">
                      /forms/{form.slug}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Link
                    to={`/admin/forms/${form.id}/responses`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition-all border border-teal-200/60"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>الردود ({form.submission_count || 0})</span>
                  </Link>

                  <button
                    onClick={() => handleCopyLink(form.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                    title="نسخ الرابط العام"
                  >
                    {copiedSlug === form.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/forms/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    title="معاينة الاستمارة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    to={`/admin/forms/edit/${form.id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                    title="تعديل الاستمارة"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(form)}
                    className={`p-2 rounded-xl transition-all ${
                      form.status === 'open' 
                        ? 'text-emerald-600 hover:bg-emerald-50' 
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={form.status === 'open' ? 'إغلاق الاستمارة' : 'فتح الاستمارة'}
                  >
                    {form.status === 'open' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>

                  {deleteConfirmId === form.id ? (
                    <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
                      <span className="text-[11px] font-bold text-red-600 px-1">تأكيد الحذف؟</span>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                      >
                        نعم
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(form.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="حذف الاستمارة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
