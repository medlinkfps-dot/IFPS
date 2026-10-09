import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ChevronLeft, Sparkles, Filter } from 'lucide-react';
import { getPosts, getCategories } from '../../lib/db';
import { Post, Category } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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
          getPosts({ contentTypeSlug: 'news', search: searchQuery }),
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
  }, [searchQuery]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="أحدث الأخبار والإعلانات" 
        description="مركز الأخبار والمستجدات المهنية والعلمية لجمعية أطباء الأسرة العراقية (IFPS)."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <Badge variant="secondary" size="md" className="mb-3">
            المستجدات والأنشطة الرسمية
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            أخبار جمعية أطباء الأسرة العراقية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            متابعة حية لكافة الأنشطة المهنية، اللقاءات التشاورية مع وزارة الصحة، مشاركات WONCA العالمية، والأوامر الإدارية الخاصة بأطباء الأسرة في العراق.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالكلمات المفتاحية..."
              className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الأخبار
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
        ) : posts.length === 0 ? (
          <EmptyState 
            title="لا توجد أخبار مطابقة"
            description="لم يتم العثور على أي نتائج مطابقة لبحثك الحالي. جرب البحث بكلمات أخرى."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={post.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title_ar}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {post.is_pinned && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                      مثبت
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ')}</span>
                      </div>
                      {post.metadata?.read_time && (
                        <span>{post.metadata.read_time}</span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-navy-900 mb-2 leading-snug hover:text-medical-600 transition-colors">
                      <Link to={`/news/${post.slug}`}>{post.title_ar}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                      {post.summary_ar}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 truncate max-w-[160px]">
                      {post.author_name || 'إدارة الجمعية'}
                    </span>
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700"
                    >
                      <span>قراءة التفاصيل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
