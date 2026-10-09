import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Check, X, Eye, ExternalLink } from 'lucide-react';
import { getContentTypes, createContentType, updateContentType } from '../../lib/db';
import { ContentType } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminSectionsPage: React.FC = () => {
  const [types, setTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ContentType | null>(null);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isInNav, setIsInNav] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const data = await getContentTypes();
      setTypes(data);
    } catch (e) {
      console.error('Error loading content types:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const openCreateModal = () => {
    setEditingType(null);
    setNameAr('');
    setNameEn('');
    setSlug('');
    setDescription('');
    setIsInNav(true);
    setSortOrder(types.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (t: ContentType) => {
    setEditingType(t);
    setNameAr(t.name_ar);
    setNameEn(t.name_en);
    setSlug(t.slug);
    setDescription(t.description || '');
    setIsInNav(t.is_in_nav);
    setSortOrder(t.sort_order);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !slug.trim()) return;

    try {
      if (editingType) {
        await updateContentType(editingType.id, {
          name_ar: nameAr.trim(),
          name_en: nameEn.trim(),
          slug: slug.trim(),
          description: description.trim(),
          is_in_nav: isInNav,
          sort_order: Number(sortOrder),
        });
      } else {
        await createContentType({
          name_ar: nameAr.trim(),
          name_en: nameEn.trim() || slug.trim(),
          slug: slug.trim(),
          description: description.trim(),
          is_in_nav: isInNav,
          sort_order: Number(sortOrder),
          is_active: true,
          icon: 'FileText',
        });
      }
      setModalOpen(false);
      loadTypes();
    } catch (e) {
      console.error('Error saving section:', e);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="إدارة الأقسام وأنواع المحتوى | IFPS CMS" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">الأقسام وأنواع المحتوى</h1>
          <p className="text-xs text-slate-500">
            إضافة وتعديل الأقسام الرئيسية في الموقع (مثل الأخبار، المؤتمرات، الأبحاث، أو أقسام جديدة مخصصة)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="جارِ تحميل الأقسام..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 pr-6">اسم القسم (بالعربية)</th>
                  <th className="py-3.5 px-4">الاسم (بالإنجليزية)</th>
                  <th className="py-3.5 px-4">الرابط التعريفي (Slug)</th>
                  <th className="py-3.5 px-4">الترتيب</th>
                  <th className="py-3.5 px-4 text-center">في القائمة الرئيسية</th>
                  <th className="py-3.5 pl-6 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {types.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-medical-600" />
                        <span>{t.name_ar}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-sans text-slate-600">{t.name_en}</td>
                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">/{t.slug}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{t.sort_order}</td>
                    <td className="py-4 px-4 text-center">
                      {t.is_in_nav ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3" />
                          <span>ظاهر</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          <span>مخفي</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-6 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/section/${t.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                          title="عرض القالب العام"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 text-slate-600 hover:text-medical-600 rounded-lg hover:bg-slate-100 font-bold"
                          title="تعديل القسم"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Section Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingType ? 'تعديل بيانات القسم' : 'إضافة قسم محتوى جديد'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              اسم القسم (بالعربية) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => {
                setNameAr(e.target.value);
                if (!editingType && !slug) {
                  setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
                }
              }}
              placeholder="مثال: البحوث العلمية والمنشورات"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Scientific Research"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                الرابط التعريفي (Slug) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. scientific-research"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              وصف القسم (يظهر في الترويسة)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر لمحتوى هذا القسم..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">ترتيب الظهور</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInNav}
                  onChange={(e) => setIsInNav(e.target.checked)}
                  className="rounded text-medical-600 w-4 h-4"
                />
                <span>إظهار في شريط التنقل الرئيسي</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-medical-600 hover:bg-medical-700 text-white rounded-xl shadow-sm"
            >
              حفظ القسم
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
