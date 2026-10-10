import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, Newspaper } from 'lucide-react';
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
    : posts.filter(p => p.categories?.some(c => c.slug === selectedCategory));

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="أحدث الأخبار والإعلانات" 
        description="مركز الأخبار والمستجدات المهنية والعلمية لجمعية أطباء الأسرة العراقية (IFPS)."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <Newspaper className="w-3.5 h-3.5" />
            <span>المستجدات والأنشطة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            أخبار وإعلانات الجمعية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            متابعة مستمرة لأنشطة الرعاية الأولية ومشاركات WONCA والأوامر الإدارية
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-soft border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الأخبار..."
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
              جميع الأخبار
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

        {/* News Grid */}
        {loading ? (
          <LoadingSpinner size="lg" label="جارِ جلب الأخبار..." />
        ) : displayedPosts.length === 0 ? (
          <EmptyState 
            title="لا توجد أخبار مطابقة"
            description="لم يتم العثور على أي نتائج مطابقة لبحثك الحالي."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={post.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title_ar}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.is_pinned && (
                    <span className="absolute top-3 right-3 bg-navy-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      مثبت
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ')}</span>
                    </div>

                    <h2 className="text-base font-bold text-navy-900 leading-snug group-hover:text-medical-600 transition-colors line-clamp-2">
                      <Link to={`/news/${post.slug}`}>{post.title_ar}</Link>
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-normal">
                      {post.summary_ar}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">
                      {post.author_name || 'إدارة الجمعية'}
                    </span>
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700"
                    >
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
