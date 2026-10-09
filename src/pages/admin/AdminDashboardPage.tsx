import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  Mail, 
  Eye, 
  TrendingUp, 
  Layers, 
  ExternalLink,
  ChevronLeft,
  FileDown
} from 'lucide-react';
import { getPosts, getContactMessages, getContentTypes, getPDFDocuments } from '../../lib/db';
import { Post, ContactMessage, ContentType, PDFDocument } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [postsRes, msgs, types, docs] = await Promise.all([
          getPosts({ limit: 100 }),
          getContactMessages(),
          getContentTypes(),
          getPDFDocuments(),
        ]);
        setPosts(postsRes.posts);
        setMessages(msgs);
        setContentTypes(types);
        setDocuments(docs);
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" label="جارِ تحميل مؤشرات لوحة التحكم..." />;
  }

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  const newsCount = posts.filter(p => p.content_type_slug === 'news').length;
  const eventsCount = posts.filter(p => p.content_type_slug === 'events').length;
  const coursesCount = posts.filter(p => p.content_type_slug === 'courses').length;
  const oppsCount = posts.filter(p => p.content_type_slug === 'opportunities').length;
  const unreadMessagesCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-8">
      <SEO title="لوحة القيادة والتحكم الإداري | IFPS CMS" />

      {/* Top Welcome & Quick Actions */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-medical-300">لوحة الإدارة المركزية</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              مرحباً بكم في نظام إدارة محتوى جمعية أطباء الأسرة العراقية
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
              يمكنك من هنا التحكم بجميع أقسام الموقع، نشر الأخبار والفعاليات، إدارة دورات منظومة CPD-s، والرد على الرسائل الواردة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/posts/new"
              className="flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إنشاء منشور جديد</span>
            </Link>
            <Link
              to="/admin/documents"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/15 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>ملفات PDF والوثائق</span>
            </Link>
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-navy-700 transition-colors"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">المنشورات النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">{publishedCount}</span>
          <span className="block text-[11px] text-slate-400 mt-1">منشور منشور على الموقع</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">المسودات</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">{draftCount}</span>
          <span className="block text-[11px] text-slate-400 mt-1">مسودة قيد المراجعة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">دورات CPD-s</span>
            <div className="w-9 h-9 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">{coursesCount}</span>
          <span className="block text-[11px] text-slate-400 mt-1">برنامج تدريبي معتمد</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">الرسائل غير المقروءة</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">{unreadMessagesCount}</span>
          <span className="block text-[11px] text-slate-400 mt-1">استفسار وارد جديد</span>
        </div>
      </div>

      {/* Secondary Metrics / Categories Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">الأخبار</span>
            <span className="text-lg font-bold text-navy-900">{newsCount}</span>
          </div>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">الفعاليات</span>
            <span className="text-lg font-bold text-navy-900">{eventsCount}</span>
          </div>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">الدراسات العليا</span>
            <span className="text-lg font-bold text-navy-900">{oppsCount}</span>
          </div>
          <Award className="w-5 h-5 text-slate-400" />
        </div>

        <Link 
          to="/admin/documents"
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center justify-between transition-colors group"
        >
          <div>
            <span className="text-xs text-slate-500 block group-hover:text-medical-600">ملفات PDF والوثائق</span>
            <span className="text-lg font-bold text-navy-900">{documents.length}</span>
          </div>
          <FileDown className="w-5 h-5 text-slate-400 group-hover:text-medical-600 transition-colors" />
        </Link>
      </div>

      {/* Main Content Split: Recent Posts & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-navy-900">آخر المنشورات المضافة والمعدلة</h2>
              <p className="text-xs text-slate-500">إدارة التعديلات وحالة النشر</p>
            </div>
            <Link 
              to="/admin/posts"
              className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1"
            >
              <span>جميع المنشورات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3 pr-2">العنوان</th>
                  <th className="pb-3">القسم</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3">التاريخ</th>
                  <th className="pb-3 pl-2 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.slice(0, 6).map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-2 font-bold text-navy-900 max-w-xs truncate">
                      <Link to={`/admin/posts/edit/${post.id}`} className="hover:text-medical-600">
                        {post.title_ar}
                      </Link>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {post.content_type_name_ar || 'الأخبار'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Badge 
                        variant={post.status === 'published' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {post.status === 'published' ? 'منشور' : 'مسودة'}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(post.updated_at || post.created_at).toLocaleDateString('ar-IQ')}
                    </td>
                    <td className="py-3.5 pl-2 text-left">
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="text-medical-600 hover:underline font-bold"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-navy-900">آخر الاستفسارات</h2>
              <p className="text-xs text-slate-500">رسائل نموذج التواصل</p>
            </div>
            <Link 
              to="/admin/messages"
              className="text-xs font-bold text-medical-600 hover:text-medical-700"
            >
              عرض الكل
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              لا توجد رسائل واردة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                    !msg.is_read ? 'bg-medical-50/50 border-medical-200' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-navy-900 truncate max-w-[140px]">{msg.full_name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString('ar-IQ')}
                    </span>
                  </div>
                  <p className="font-medium text-slate-700 truncate mb-1">{msg.subject}</p>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
