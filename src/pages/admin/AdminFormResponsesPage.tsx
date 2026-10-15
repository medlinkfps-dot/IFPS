import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  ExternalLink, 
  Users, 
  Calendar, 
  PieChart, 
  Table, 
  CheckCircle2, 
  Search, 
  Image as ImageIcon,
  FileCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { getFormById, getFormSubmissions, deleteFormSubmission } from '../../lib/db';
import { CustomForm, FormSubmission, FormField } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminFormResponsesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<CustomForm | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'table' | 'analytics'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const formData = await getFormById(id);
      setForm(formData);
      const subsData = await getFormSubmissions(id);
      setSubmissions(subsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener('ifps_content_updated', handleUpdate);
    return () => window.removeEventListener('ifps_content_updated', handleUpdate);
  }, [id]);

  const handleDelete = async (subId: string) => {
    try {
      await deleteFormSubmission(subId);
      setSubmissions(prev => prev.filter(s => s.id !== subId));
      if (selectedSubmission?.id === subId) {
        setSelectedSubmission(null);
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  // Export to Excel / CSV with UTF-8 BOM for proper Arabic display in MS Excel
  const handleExportCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = [
      'رقم التسلسل',
      'تاريخ الإرسال',
      ...form.fields.map(f => f.label)
    ];

    const rows = submissions.map((sub, index) => {
      const dateStr = new Date(sub.submitted_at).toLocaleString('ar-IQ');
      const answersRow = form.fields.map(field => {
        const val = sub.answers[field.id];
        if (!val) return '';
        if (typeof val === 'object' && val.url) {
          return val.url; // File link
        }
        if (Array.isArray(val)) {
          return val.join(' - ');
        }
        return String(val).replace(/"/g, '""');
      });
      return [index + 1, dateStr, ...answersRow];
    });

    // Add UTF-8 BOM so Excel opens Arabic correctly
    const csvContent = '\uFEFF' + [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form.slug}-responses-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <LoadingSpinner size="lg" label="جارِ تحميل نتائج وردود الاستمارة..." />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">الاستمارة المطلوبة غير موجودة</h2>
        <Link to="/admin/forms" className="inline-block mt-4 text-teal-600 font-bold text-sm">
          العودة لقائمة الاستمارات
        </Link>
      </div>
    );
  }

  // Analytics computation
  const choiceFields = form.fields.filter(f => ['radio', 'checkbox', 'select'].includes(f.type));

  const filteredSubmissions = submissions.filter(sub => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(sub.answers).some(val => {
      if (!val) return false;
      if (typeof val === 'string') return val.toLowerCase().includes(q);
      if (typeof val === 'object' && val.name) return val.name.toLowerCase().includes(q);
      if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(q));
      return false;
    });
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Top Header */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{form.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {submissions.length} مشارك
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              استعراض الإجابات المستلمة، المرفقات والصور، وتصدير النتائج إلى Excel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={submissions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>تصدير إلى Excel (CSV)</span>
          </button>
          <a
            href={`/forms/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            title="عرض الاستمارة العامة"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* View Switcher Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'table' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>جدول الردود ({submissions.length})</span>
          </button>

          {choiceFields.length > 0 && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>ملخص الإحصائيات والنسب</span>
            </button>
          )}
        </div>

        {activeTab === 'table' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث داخل الإجابات..."
              className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">لا توجد ردود مسجلة بعد</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            شارك رابط الاستمارة مع الأطباء والمشاركين للبدء في استقبال إجاباتهم ومرفقاتهم هنا.
          </p>
        </div>
      ) : activeTab === 'analytics' ? (
        /* Analytics Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {choiceFields.map(field => {
            const options = field.options || [];
            const counts: Record<string, number> = {};
            options.forEach(opt => { counts[opt] = 0; });

            submissions.forEach(sub => {
              const answer = sub.answers[field.id];
              if (Array.isArray(answer)) {
                answer.forEach(a => {
                  if (counts[a] !== undefined) counts[a] += 1;
                });
              } else if (typeof answer === 'string') {
                if (counts[answer] !== undefined) counts[answer] += 1;
              }
            });

            const totalAnswersForField = Object.values(counts).reduce((a, b) => a + b, 0);

            return (
              <div key={field.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">{field.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    إجمالي الإجابات: {totalAnswersForField}
                  </p>
                </div>

                <div className="space-y-3">
                  {options.map((opt) => {
                    const count = counts[opt] || 0;
                    const pct = totalAnswersForField > 0 ? Math.round((count / totalAnswersForField) * 100) : 0;
                    return (
                      <div key={opt} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{opt}</span>
                          <span className="text-slate-500 font-mono">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Tab */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">تاريخ ووقت الإرسال</th>
                  {form.fields.slice(0, 4).map(f => (
                    <th key={f.id} className="py-3.5 px-4 max-w-[200px] truncate">{f.label}</th>
                  ))}
                  {form.fields.length > 4 && (
                    <th className="py-3.5 px-4 text-slate-400">حقول إضافية...</th>
                  )}
                  <th className="py-3.5 px-4 text-center w-28">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(sub.submitted_at).toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    {form.fields.slice(0, 4).map(f => {
                      const val = sub.answers[f.id];
                      return (
                        <td key={f.id} className="py-3 px-4 max-w-[200px] truncate">
                          {val ? (
                            typeof val === 'object' && val.url ? (
                              <a
                                href={val.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold underline"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>عرض المرفق</span>
                              </a>
                            ) : Array.isArray(val) ? (
                              val.join('، ')
                            ) : (
                              String(val)
                            )
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                    {form.fields.length > 4 && (
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        +{form.fields.length - 4} أخرى
                      </td>
                    )}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                          title="عرض التفاصيل الكاملة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === sub.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                            >
                              حذف
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(sub.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="حذف هذا الرد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">تفاصيل رد المشارك الكاملة</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تاريخ التقديم: {new Date(selectedSubmission.submitted_at).toLocaleString('ar-IQ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {form.fields.map((f, i) => {
                const val = selectedSubmission.answers[f.id];
                const isFile = f.type === 'file' || (val && typeof val === 'object' && val.url);

                return (
                  <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 block">
                      {i + 1}. {f.label}
                    </span>
                    {val ? (
                      isFile ? (
                        <div className="pt-1">
                          <a
                            href={val.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl text-xs border border-teal-200/80 transition-all"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>عرض وتنزيل المرفق ({val.name || 'ملف'})</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {val.map((item, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-bold text-xs text-slate-800">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-slate-900 whitespace-pre-wrap leading-relaxed">
                          {String(val)}
                        </p>
                      )
                    ) : (
                      <p className="text-xs text-slate-400 italic">لم تتم الإجابة</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDelete(selectedSubmission.id)}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف هذا الرد</span>
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
