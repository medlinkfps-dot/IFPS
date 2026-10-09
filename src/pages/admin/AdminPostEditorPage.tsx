import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  ArrowRight, 
  Eye, 
  Calendar, 
  Pin, 
  Star, 
  Clock, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Layers,
  FileText
} from 'lucide-react';
import { getPostById, createPost, updatePost, getContentTypes } from '../../lib/db';
import { Post, ContentType, PostStatus } from '../../types';
import { SEO } from '../../components/common/SEO';
import { VisualEditor } from '../../components/admin/VisualEditor';
import { PostPreviewModal } from '../../components/admin/PostPreviewModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminPostEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form State
  const [contentTypeId, setContentTypeId] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [summaryAr, setSummaryAr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<PostStatus>('draft');
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Metadata State
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    async function initEditor() {
      try {
        const types = await getContentTypes();
        setContentTypes(types);

        if (isEditing && id) {
          const post = await getPostById(id);
          if (post) {
            setContentTypeId(post.content_type_id);
            setTitleAr(post.title_ar);
            setTitleEn(post.title_en || '');
            setSlug(post.slug);
            setSummaryAr(post.summary_ar);
            setContentAr(post.content_ar);
            setFeaturedImage(post.featured_image || '');
            setStatus(post.status);
            setIsPinned(post.is_pinned);
            setIsFeatured(post.is_featured);
            setScheduledFor(post.scheduled_for || '');
            setSeoTitle(post.seo_title || '');
            setSeoDescription(post.seo_description || '');
            setMetadata(post.metadata || {});
          }
        } else if (types.length > 0) {
          setContentTypeId(types[0].id);
        }
      } catch (e) {
        console.error('Error initializing editor:', e);
      } finally {
        setLoading(false);
      }
    }
    initEditor();
  }, [id, isEditing]);

  // Auto-generate slug from Arabic title if creating new post
  const handleTitleChange = (val: string) => {
    setTitleAr(val);
    if (!isEditing && !slug) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\s\u0621-\u064A-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated || `post-${Date.now()}`);
    }
  };

  const handleSave = async (targetStatus: PostStatus = status) => {
    if (!titleAr.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال عنوان المنشور بالعربية.' });
      return;
    }
    if (!contentAr.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال محتوى المنشور.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const postPayload: Partial<Post> = {
      content_type_id: contentTypeId,
      title_ar: titleAr.trim(),
      title_en: titleEn.trim() || undefined,
      slug: slug.trim() || `post-${Date.now()}`,
      summary_ar: summaryAr.trim() || titleAr.trim().slice(0, 150),
      content_ar: contentAr,
      featured_image: featuredImage.trim() || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      status: targetStatus,
      is_pinned: isPinned,
      is_featured: isFeatured,
      scheduled_for: targetStatus === 'scheduled' ? scheduledFor : undefined,
      metadata,
      seo_title: seoTitle.trim() || titleAr.trim(),
      seo_description: seoDescription.trim() || summaryAr.trim(),
    };

    try {
      if (isEditing && id) {
        await updatePost(id, postPayload);
        setStatusMessage({ type: 'success', text: 'تم تحديث المنشور بنجاح!' });
      } else {
        const created = await createPost(postPayload);
        setStatusMessage({ type: 'success', text: 'تم إنشاء المنشور بنجاح!' });
        navigate(`/admin/posts/edit/${created.id}`);
      }
    } catch (err: any) {
      console.error('Error saving post:', err);
      setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ المنشور.' });
    } finally {
      setSaving(false);
    }
  };

  const selectedTypeSlug = contentTypes.find(t => t.id === contentTypeId)?.slug || 'news';

  if (loading) {
    return <LoadingSpinner size="lg" label="جارِ تحميل المحرر..." />;
  }

  return (
    <div className="space-y-6 pb-20">
      <SEO title={isEditing ? `تعديل المنشور: ${titleAr}` : 'إنشاء منشور جديد | IFPS CMS'} />

      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="p-2 text-slate-400 hover:text-navy-900 rounded-xl hover:bg-slate-100 transition-colors"
            title="العودة لقائمة المنشورات"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-navy-900">
              {isEditing ? 'تعديل المنشور' : 'إنشاء منشور جديد'}
            </h1>
            <span className="text-xs text-slate-400">
              {isEditing ? `معرف: ${id}` : 'منشور جديد في موقع الجمعية'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <Eye className="w-4 h-4 text-medical-600" />
            <span>معاينة مباشرة</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-50"
          >
            حفظ كمسودة
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جارِ الحفظ...' : 'نشر على الموقع'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Content Form (8 cols) and Sidebar Settings (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Titles & Slug Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                عنوان المنشور (بالعربية) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="أدخل عنوان المنشور الرئيسي..."
                className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  العنوان باللغة الإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="English title..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-medical-500 font-sans"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  رابط المنشور (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug-url"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-medical-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                الملخص التمهيدي (يظهر في البطاقات والمشاركات)
              </label>
              <textarea
                rows={3}
                value={summaryAr}
                onChange={(e) => setSummaryAr(e.target.value)}
                placeholder="موجز عن المنشور لا يتجاوز سطرين أو ثلاثة..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>
          </div>

          {/* Visual Rich Editor Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-navy-900">
                المحتوى التفصيلي للمنشور <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">يدعم العناوين، القوائم، الصور، والجداول</span>
            </div>

            <VisualEditor
              value={contentAr}
              onChange={(val) => setContentAr(val)}
              placeholder="اكتب تفاصيل المحتوى هنا..."
            />
          </div>

          {/* Custom Section Specific Fields */}
          {selectedTypeSlug === 'events' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-medical-600" />
                <span>بيانات الفعالية والمؤتمر</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ الفعالية</label>
                  <input
                    type="date"
                    value={metadata.event_date || ''}
                    onChange={(e) => setMetadata({ ...metadata, event_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">التوقيت</label>
                  <input
                    type="text"
                    value={metadata.event_time || ''}
                    onChange={(e) => setMetadata({ ...metadata, event_time: e.target.value })}
                    placeholder="مثال: 09:00 ص - 04:00 م"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المكان والقاعة</label>
                  <input
                    type="text"
                    value={metadata.venue || ''}
                    onChange={(e) => setMetadata({ ...metadata, venue: e.target.value })}
                    placeholder="مثال: بغداد - فندق الرشيد"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">رابط التسجيل الخارجي</label>
                  <input
                    type="url"
                    value={metadata.registration_url || ''}
                    onChange={(e) => setMetadata({ ...metadata, registration_url: e.target.value })}
                    placeholder="https://forms.gle/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTypeSlug === 'courses' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-medical-600" />
                <span>بيانات دورة منظومة التطوير المهني CPD-s</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المدة</label>
                  <input
                    type="text"
                    value={metadata.duration || ''}
                    onChange={(e) => setMetadata({ ...metadata, duration: e.target.value })}
                    placeholder="مثال: 4 أسابيع"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ساعات CPD المعتمدة</label>
                  <input
                    type="number"
                    value={metadata.cpd_hours || ''}
                    onChange={(e) => setMetadata({ ...metadata, cpd_hours: Number(e.target.value) })}
                    placeholder="مثال: 24"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">حالة التسجيل</label>
                  <select
                    value={metadata.registration_status || 'open'}
                    onChange={(e) => setMetadata({ ...metadata, registration_status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="open">متاح</option>
                    <option value="closed">مغلق</option>
                    <option value="upcoming">قريباً</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المحاضرون والمدربون</label>
                  <input
                    type="text"
                    value={metadata.instructor || ''}
                    onChange={(e) => setMetadata({ ...metadata, instructor: e.target.value })}
                    placeholder="نخبة من استشاريي طب الأسرة"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">رابط التسجيل</label>
                  <input
                    type="url"
                    value={metadata.registration_url || ''}
                    onChange={(e) => setMetadata({ ...metadata, registration_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Official Attachment File Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-navy-900">الملفات الرسمية المرفقة (PDF)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رابط الملف المباشر</label>
                <input
                  type="url"
                  value={metadata.file_url || ''}
                  onChange={(e) => setMetadata({ ...metadata, file_url: e.target.value })}
                  placeholder="https://iraqifps.org/...pdf"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم الملف الظاهر للأعضاء</label>
                <input
                  type="text"
                  value={metadata.file_name || ''}
                  onChange={(e) => setMetadata({ ...metadata, file_name: e.target.value })}
                  placeholder="مثال: أمر إداري وجبة خامسة.pdf"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section & Publication Options */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-navy-900">إعدادات النشر والقسم</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">قسم المنشور</label>
              <select
                value={contentTypeId}
                onChange={(e) => setContentTypeId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-medical-500"
              >
                {contentTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name_ar} ({t.name_en})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">حالة النشر</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="draft">مسودة (غير ظاهر للعامة)</option>
                <option value="published">منشور فوراً</option>
                <option value="scheduled">مجدول لوقت لاحق</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">تاريخ ووقت الجدولة</label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-medical-600 focus:ring-medical-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-amber-500" />
                  <span>تثبيت المنشور في أعلى القسم</span>
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-medical-600 focus:ring-medical-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-medical-500" />
                  <span>إبراز في واجهة الصفحة الرئيسية</span>
                </span>
              </label>
            </div>
          </div>

          {/* Featured Image Picker */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-medical-600" />
              <span>الصورة البارزة</span>
            </h3>

            <div>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                dir="ltr"
              />
            </div>

            {featuredImage && (
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                <img src={featuredImage} alt="معاينة" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* SEO Meta Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-navy-900">تحسين محركات البحث (SEO)</h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">عنوان الميتا (Meta Title)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="عنوان يظهر في محركات البحث..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">وصف الميتا (Meta Description)</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="وصف مختصر يظهر في جوجل ومواقع التواصل..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <PostPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={{
          title_ar: titleAr,
          summary_ar: summaryAr,
          content_ar: contentAr,
          featured_image: featuredImage,
          content_type_name_ar: contentTypes.find(t => t.id === contentTypeId)?.name_ar,
          is_pinned: isPinned,
          author_name: 'إدارة جمعية أطباء الأسرة العراقية',
        }}
      />
    </div>
  );
};
