import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContentTypes, getPosts } from '../../lib/db';
import { ContentType, Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Calendar, ChevronLeft, Layers } from 'lucide-react';

export const DynamicSectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [section, setSection] = useState<ContentType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSection() {
      if (!slug) return;
      setLoading(true);
      try {
        const types = await getContentTypes();
        const current = types.find(t => t.slug === slug);
        if (current) {
          setSection(current);
          const res = await getPosts({ contentTypeSlug: slug });
          setPosts(res.posts);
        }
      } catch (e) {
        console.error('Error loading section:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSection();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <LoadingSpinner size="lg" label="جارِ تحميل القسم..." />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <EmptyState 
          title="القسم غير موجود"
          description="لم يتم العثور على القسم المطلوب أو قد تم إخفاؤه مؤقتاً من قبل الإدارة."
          action={
            <Link to="/" className="px-5 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold">
              العودة للرئيسية
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title={section.name_ar} 
        description={section.description || `قسم ${section.name_ar} في جمعية أطباء الأسرة العراقية`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3">
            <Layers className="w-3.5 h-3.5 ml-1" />
            {section.name_en || 'Section'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            {section.name_ar}
          </h1>
          {section.description && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              {section.description}
            </p>
          )}
        </div>

        {posts.length === 0 ? (
          <EmptyState 
            title="لا توجد منشورات في هذا القسم حالياً"
            description="سيتم إضافة ونشر المحتوى الخاص بهذا القسم قريباً من قبل إدارة الجمعية."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col justify-between">
                <div>
                  {post.featured_image && (
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img 
                        src={post.featured_image} 
                        alt={post.title_ar} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ')}</span>
                    </div>

                    <h2 className="text-lg font-bold text-navy-900 mb-2 leading-snug hover:text-medical-600 transition-colors">
                      <Link to={`/news/${post.slug}`}>{post.title_ar}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {post.summary_ar}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <Link
                    to={`/news/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700"
                  >
                    <span>عرض التفاصيل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
