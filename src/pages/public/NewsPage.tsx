import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, Newspaper, Pin, User, Sparkles, FileText } from 'lucide-react';
import { getPosts, getCategories } from '../../lib/db';
import { Post, Category } from '../../types';
import { SEO } from '../../components/common/SEO';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const [postsRes, catsRes] = await Promise.all([
          getPosts({ 
            contentTypeSlug: 'news', 
            search: searchQuery,
            limit: 1000,
          }),
          getCategories('11111111-1111-1111-1111-111111111111'),
        ]);
        setPosts(postsRes.posts);
        setCategories(catsRes);
      } catch (e) {
        console.error('Error loading news:', e);
      } finally {
        setLoading(false);
      }
    }
    loadNews();

    const handleUpdate = () => {
      loadNews();
    };
    window.addEventListener('ifps_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ifps_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [searchQuery]);

  const displayedPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.categories?.some(c => c.slug === selectedCategory) || p.metadata?.categories?.includes(selectedCategory));

  const sortedPosts = [...displayedPosts].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    const orderA = a.sort_order || 0;
    const orderB = b.sort_order || 0;
    if (orderA !== orderB) return orderB - orderA;
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="أحدث الأخبار والإعلانات" 
        description="مركز الأخبار والمستجدات المهنية والعلمية لجمعية أطباء الأسرة العراقية (IFPS)."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <Newspaper className="w-3.5 h-3.5" />
            <span>المستجدات والأنشطة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 leading-tight">
            أخبار وإعلانات الجمعية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            متابعة مستمرة لأنشطة الرعاية الأولية ومشاركات WONCA والأوامر الإدارية
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-soft border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الأخبار والمقالات..."
              className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 font-medium"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              جميع الأخبار ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name_ar}
              </button>
            ))}
          </div>
        </div>

        {/* News Feed - Articles Stacked Vertically */}
        {loading ? (
          <LoadingSpinner size="lg" label="جارِ جلب الأخبار..." />
        ) : sortedPosts.length === 0 ? (
          <EmptyState 
            title="لا توجد أخبار مطابقة"
            description="لم يتم العثور على أي نتائج مطابقة لبحثك الحالي."
          />
        ) : (
          <div className="flex flex-col space-y-8 sm:space-y-10">
            {sortedPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
              >
                {/* 1. الصورة المصغرة (Thumbnail Image) */}
                <Link 
                  to={`/news/${post.slug}`} 
                  className="block relative aspect-[16/9] sm:aspect-[21/9] max-h-[420px] overflow-hidden bg-slate-100"
                >
                  <img 
                    src={post.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'} 
                    alt={post.title_ar}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap">
                    {post.is_pinned && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900/95 backdrop-blur-md text-white text-xs font-bold shadow-md border border-white/20">
                        <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>خبر مثبت</span>
                      </span>
                    )}
                    {post.metadata?.attached_form_id && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-600/95 backdrop-blur-md text-white text-xs font-bold shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>استبيان تفاعلي</span>
                      </span>
                    )}
                    {post.metadata?.file_url && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-medical-700/95 backdrop-blur-md text-white text-xs font-bold shadow-md">
                        <FileText className="w-3.5 h-3.5" />
                        <span>ملف رسمي PDF</span>
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content Area */}
                <div className="p-6 sm:p-8 flex flex-col space-y-4">
                  {/* Meta Bar */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-medical-700 bg-medical-50 border border-medical-100 px-3 py-1 rounded-xl font-bold">
                      <Calendar className="w-3.5 h-3.5 text-medical-600" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.author_name || 'إدارة جمعية أطباء الأسرة العراقية'}</span>
                    </span>
                  </div>

                  {/* 2. اسم المنشور بارز (Prominent Post Title) */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-navy-900 leading-snug sm:leading-tight group-hover:text-medical-600 transition-colors">
                    <Link to={`/news/${post.slug}`}>
                      {post.title_ar}
                    </Link>
                  </h2>

                  {/* 3. تحتها الملخص التمهيدي (Introductory Summary) */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {post.summary_ar}
                  </p>

                  {/* Card Footer */}
                  <div className="pt-5 mt-2 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 group-hover:bg-medical-600 group-hover:text-white text-navy-900 text-xs sm:text-sm font-bold transition-all shadow-xs group-hover:shadow-md"
                    >
                      <span>قراءة الخبر بالكامل</span>
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Link>

                    <span className="text-[11px] text-slate-400 font-medium">
                      جمعية أطباء الأسرة العراقية (IFPS)
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* End of Feed Indicator */}
            <div className="text-center py-6 border-t border-slate-200/60 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                <span>نهاية قائمة المقالات • جميع الأخبار مرتبة من الأحدث إلى الأقدم</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
