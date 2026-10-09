import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  Check, 
  HardDrive, 
  Calendar,
  Upload,
  ArrowDownToLine,
  FileDown
} from 'lucide-react';
import { 
  getPDFDocuments, 
  createPDFDocument, 
  updatePDFDocument, 
  deletePDFDocument 
} from '../../lib/db';
import { PDFDocument } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const PRESET_CATEGORIES = [
  'أوامر وقرارات إدارية',
  'استمارات رسمية',
  'أدلة إرشادية ومعايير',
  'لوائح وتعليمات',
  'بحوث ومطبوعات علمية',
  'أخرى'
];

export const AdminDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isActive, setIsActive] = useState(true);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await getPDFDocuments();
      setDocuments(data);
    } catch (e) {
      console.error('Failed to load documents in admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const openAddModal = () => {
    setEditingDocId(null);
    setTitle('');
    setDescription('');
    setCategory(PRESET_CATEGORIES[0]);
    setCustomCategory('');
    setFileUrl('');
    setFileName('');
    setFileSize('');
    setPublishedDate(new Date().toISOString().split('T')[0]);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: PDFDocument) => {
    setEditingDocId(doc.id);
    setTitle(doc.title);
    setDescription(doc.description || '');
    if (PRESET_CATEGORIES.includes(doc.category)) {
      setCategory(doc.category);
      setCustomCategory('');
    } else {
      setCategory('أخرى');
      setCustomCategory(doc.category);
    }
    setFileUrl(doc.file_url);
    setFileName(doc.file_name);
    setFileSize(doc.file_size || '');
    setPublishedDate(doc.published_date || new Date().toISOString().split('T')[0]);
    setIsActive(doc.is_active);
    setIsModalOpen(true);
  };

  // Handle local PDF upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // Calculate readable size
    const sizeInKb = file.size / 1024;
    if (sizeInKb > 1024) {
      setFileSize(`${(sizeInKb / 1024).toFixed(1)} MB`);
    } else {
      setFileSize(`${Math.round(sizeInKb)} KB`);
    }

    // Auto set title if blank
    if (!title) {
      const suggestedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(suggestedTitle);
    }

    // Convert file to object URL or base64 data URL for offline/local resilience
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) {
      alert('يرجى كتابة عنوان الوثيقة وإرفاق أو إدخال رابط ملف PDF.');
      return;
    }

    const finalCategory = (category === 'أخرى' && customCategory.trim()) 
      ? customCategory.trim() 
      : category;

    setIsSaving(true);
    try {
      if (editingDocId) {
        await updatePDFDocument(editingDocId, {
          title: title.trim(),
          description: description.trim(),
          category: finalCategory,
          file_url: fileUrl.trim(),
          file_name: fileName.trim() || `${title.trim()}.pdf`,
          file_size: fileSize.trim() || '1.0 MB',
          published_date: publishedDate,
          is_active: isActive,
        });
      } else {
        await createPDFDocument({
          title: title.trim(),
          description: description.trim(),
          category: finalCategory,
          file_url: fileUrl.trim(),
          file_name: fileName.trim() || `${title.trim()}.pdf`,
          file_size: fileSize.trim() || '1.0 MB',
          published_date: publishedDate,
          is_active: isActive,
          downloads_count: 0,
        });
      }

      setIsModalOpen(false);
      await loadDocs();
    } catch (e) {
      console.error('Error saving document:', e);
      alert('حدث خطأ أثناء حفظ الوثيقة.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (doc: PDFDocument) => {
    if (!confirm(`هل أنت متأكد من حذف الوثيقة: "${doc.title}"؟`)) return;
    try {
      await deletePDFDocument(doc.id);
      await loadDocs();
    } catch (e) {
      console.error('Failed to delete document:', e);
    }
  };

  const handleToggleStatus = async (doc: PDFDocument) => {
    try {
      await updatePDFDocument(doc.id, { is_active: !doc.is_active });
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, is_active: !d.is_active } : d));
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalDownloads = documents.reduce((acc, d) => acc + (d.downloads_count || 0), 0);

  return (
    <div className="space-y-6">
      <SEO title="إدارة ملفات PDF والوثائق | IFPS CMS" />

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <FileDown className="w-6 h-6 text-medical-600" />
            <span>إدارة ملفات PDF والوثائق الرسمية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إضافة وإدارة الأوامر الإدارية، الاستمارات، والملفات الرسمية المتاحة للتحميل من قبل الزوار والأعضاء
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-medical-600 hover:bg-medical-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ملف PDF جديد</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-navy-900 font-sans">{documents.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">إجمالي الوثائق المسجلة</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-navy-900 font-sans">{totalDownloads.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">إجمالي مرات التحميل</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-navy-900 font-sans">
              {documents.filter(d => d.is_active).length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">الوثائق النشطة والمنشورة</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الوثائق..."
            className="w-full pr-10 pl-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-medical-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-navy-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            الكل ({documents.length})
          </button>
          {PRESET_CATEGORIES.map(cat => {
            const count = documents.filter(d => d.category === cat).length;
            if (count === 0 && cat !== 'أخرى') return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-medical-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="جارِ تحميل قائمة الوثائق..." />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-navy-900">لا توجد وثائق مطابقة</div>
            <p className="text-xs text-slate-400">يمكنك إضافة وثيقة جديدة من الزر أعلاه</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 pr-6">عنوان الوثيقة والملف</th>
                  <th className="py-3.5 px-4">التصنيف</th>
                  <th className="py-3.5 px-4">الحجم والتاريخ</th>
                  <th className="py-3.5 px-4 text-center">التحميلات</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 pl-6 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-navy-900 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                            {doc.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs font-mono">
                            {doc.file_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-sans">
                      <div>{doc.file_size || '—'}</div>
                      <div className="text-[10px] text-slate-400">{doc.published_date}</div>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-navy-900 text-xs">
                        {doc.downloads_count || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(doc)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          doc.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {doc.is_active ? 'منشور ونشط' : 'معطل'}
                      </button>
                    </td>

                    <td className="py-4 pl-6 text-left whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          title="معاينة الملف"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="تعديل البيانات"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="حذف الوثيقة"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDocId ? 'تعديل بيانات وثيقة PDF' : 'إضافة وثيقة PDF جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-navy-900 block">
              عنوان الوثيقة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الأمر الإداري الوجبة الخامسة لاختصاصيي طب الأسرة"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-navy-900 block">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs bg-white"
              >
                {PRESET_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {category === 'أخرى' && (
              <div className="space-y-1">
                <label className="font-bold text-navy-900 block">اكتب اسم التصنيف الجديد</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="مثال: بحوث المؤتمرات"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-navy-900 block">تاريخ الإصدار / النشر</label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-navy-900 block">الوصف وملاحظات المحتوى</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح موجز عن محتوى الوثيقة أو الغرض منها..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs"
            />
          </div>

          {/* File Upload Box */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-navy-900 block">
              ملف الوثيقة (PDF) <span className="text-rose-500">*</span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-medical-300 hover:border-medical-500 bg-medical-50/40 text-medical-700 cursor-pointer font-bold transition-colors">
                <Upload className="w-4 h-4" />
                <span>رفع ملف PDF من جهازك</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="text-[11px] text-slate-400 text-center sm:text-right">
                أو يمكنك إدخال رابط مباشر لملف الـ PDF بالأسفل.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">رابط الملف المباشر (URL)</label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://... أو رابط مرفوع"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">حجم الملف التقديري</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="مثال: 500 KB أو 1.5 MB"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 block">اسم الملف عند التحميل</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="document-name.pdf"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-medical-500 focus:outline-none text-xs font-mono"
              />
            </div>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-medical-600 focus:ring-medical-500 w-4 h-4"
            />
            <label htmlFor="isActive" className="font-bold text-navy-900 cursor-pointer">
              نشر الوثيقة فوراً وإتاحتها للتحميل العام
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 active:scale-95 text-white font-bold transition-all shadow-sm"
            >
              {isSaving ? 'جارِ الحفظ...' : editingDocId ? 'حفظ التعديلات' : 'إضافة الوثيقة'}
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
};
export default AdminDocumentsPage;
