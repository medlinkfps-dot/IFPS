import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Pin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { getPosts, deletePost, updatePost, getContentTypes } from '../../lib/db';
import { Post, ContentType } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [postsRes, types] = await Promise.all([
        getPosts({
          contentTypeSlug: selectedType !== 'all' ? selectedType : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: search || undefined,
          limit: 100,
        }),
        getContentTypes(),
      ]);
      setPosts(postsRes.posts);
      setContentTypes(types);
    } catch (e) {
      console.error('Error fetching admin posts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedType, selectedStatus, search]);

  const handleTogglePin = async (post: Post) => {
    try {
      await updatePost(post.id, { is_pinned: !post.is_pinned });
      fetchPosts();
    } catch (e) {
      console.error('Error updating pin:', e);
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete.id);
      setDeleteModalOpen(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (e) {
      console.error('Error deleting post:', e);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="إدارة المنشورات والمحتوى | IFPS CMS" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">إدارة منشورات الموقع</h1>
          <p className="text-xs text-slate-500">إنشاء وتعديل ونشر وأرشفة الأخبار والمؤتمرات والدورات</p>
        </div>

        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء منشور جديد</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في المنشورات..."
            className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        {/* Section Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-medical-500"
          >
            <option value="all">جميع الأقسام</option>
            {contentTypes.map((t) => (
              <option key={t.id} value={t.slug}>{t.name_ar}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-medical-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="scheduled">مجدول</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="جارِ تحميل المنشورات..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            لم يتم العثور على أي منشورات مطابقة للبحث أو التصفية الحالية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 pr-6">العنوان</th>
                  <th className="py-3.5 px-3">القسم</th>
                  <th className="py-3.5 px-3">الحالة</th>
                  <th className="py-3.5 px-3">تاريخ النشر</th>
                  <th className="py-3.5 px-3 text-center">تثبيت</th>
                  <th className="py-3.5 pl-6 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-6 font-bold text-navy-900 max-w-sm">
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <img 
                            src={post.featured_image} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover shrink-0" 
                          />
                        )}
                        <div className="truncate">
                          <Link to={`/admin/posts/edit/${post.id}`} className="hover:text-medical-600 truncate block">
                            {post.title_ar}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">/{post.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {post.content_type_name_ar || 'الأخبار'}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <Badge 
                        variant={
                          post.status === 'published' ? 'success' : 
                          post.status === 'scheduled' ? 'secondary' : 'warning'
                        }
                        size="sm"
                      >
                        {post.status === 'published' ? 'منشور' : 
                         post.status === 'scheduled' ? 'مجدول' : 'مسودة'}
                      </Badge>
                    </td>

                    <td className="py-4 px-3 text-slate-500">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ')}
                    </td>

                    <td className="py-4 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(post)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          post.is_pinned 
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={post.is_pinned ? 'إلغاء التثبيت' : 'تثبيت في أعلى القسم'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="py-4 pl-6 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/news/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                          title="معاينة الرابط المباشر"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-1.5 text-slate-600 hover:text-medical-600 rounded-lg hover:bg-slate-100 font-bold"
                          title="تعديل المنشور"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="حذف المنشور"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="تأكيد حذف المنشور"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">هل أنت متأكد من رغبتك في حذف هذا المنشور؟</p>
          </div>

          <p className="text-xs text-slate-600">
            عنوان المنشور: <strong className="text-navy-900">{postToDelete?.title_ar}</strong>
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
            >
              تأكيد الحذف
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
