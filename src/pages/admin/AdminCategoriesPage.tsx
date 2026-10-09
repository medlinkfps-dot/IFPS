import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { getCategories, createCategory, getContentTypes } from '../../lib/db';
import { Category, ContentType } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [contentTypeId, setContentTypeId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, types] = await Promise.all([
        getCategories(),
        getContentTypes(),
      ]);
      setCategories(cats);
      setContentTypes(types);
      if (types.length > 0) setContentTypeId(types[0].id);
    } catch (e) {
      console.error('Error loading categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !slug.trim()) return;

    try {
      await createCategory({
        content_type_id: contentTypeId,
        name_ar: nameAr.trim(),
        name_en: nameEn.trim() || slug.trim(),
        slug: slug.trim(),
      });
      setModalOpen(false);
      setNameAr('');
      setNameEn('');
      setSlug('');
      loadData();
    } catch (e) {
      console.error('Error creating category:', e);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="إدارة التصنيفات | IFPS CMS" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">إدارة تصنيفات المحتوى</h1>
          <p className="text-xs text-slate-500">تصنيف الأخبار والمؤتمرات والدورات لتسهيل البحث والتصفية</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="جارِ تحميل التصنيفات..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 pr-6">اسم التصنيف (بالعربية)</th>
                  <th className="py-3.5 px-4">الاسم (بالإنجليزية)</th>
                  <th className="py-3.5 px-4">المعرف (Slug)</th>
                  <th className="py-3.5 px-4">القسم التابع له</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => {
                  const sectionName = contentTypes.find(t => t.id === c.content_type_id)?.name_ar || 'عام';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 pr-6 font-bold text-navy-900">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-medical-600" />
                          <span>{c.name_ar}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-sans text-slate-600">{c.name_en}</td>
                      <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">{c.slug}</td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs">{sectionName}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="إضافة تصنيف جديد"
        size="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">القسم الرئيسي</label>
            <select
              value={contentTypeId}
              onChange={(e) => setContentTypeId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              {contentTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name_ar}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              اسم التصنيف (بالعربية) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => {
                setNameAr(e.target.value);
                if (!slug) setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
              }}
              placeholder="مثال: ورش عمل إكلينيكية"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">الاسم بالإنجليزية</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Clinical Workshops"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              المعرف (Slug) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. clinical-workshops"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
              dir="ltr"
            />
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
              حفظ التصنيف
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
