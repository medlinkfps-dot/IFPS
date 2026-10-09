import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Share2, 
  Download, 
  Facebook, 
  Check, 
  Clock, 
  Copy,
  ChevronLeft
} from 'lucide-react';
import { getPostBySlug, getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { RichTextRenderer } from '../../components/common/RichTextRenderer';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getPostBySlug(slug);
        if (found) {
          setPost(found);
          const related = await getPosts({ contentTypeSlug: 'news', limit: 3 });
          setRelatedPosts(related.posts.filter(p => p.id !== found.id));
        } else {
          navigate('/news');
        }
      } catch (e) {
        console.error('Error loading post:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <LoadingSpinner size="lg" label="جارِ تحميل الخبر..." />
      </div>
    );
  }

  if (!post) return null;

  const currentUrl = window.location.href;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <SEO 
        title={post.seo_title || post.title_ar} 
        description={post.seo_description || post.summary_ar}
        image={post.featured_image}
        type="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-900">الرئيسية</Link>
          <span>/</span>
          <Link to="/news" className="hover:text-navy-900">الأخبار</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{post.title_ar}</span>
        </nav>

        {/* Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="primary" size="md">أخبار الجمعية</Badge>
              {post.is_pinned && <Badge variant="accent" size="md">منشور مثبت</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-4">
              {post.title_ar}
            </h1>

            {post.summary_ar && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border-r-4 border-medical-500 mb-6">
                {post.summary_ar}
              </p>
            )}

            {/* Author and Date metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-4 h-4 text-medical-600" />
                  <span>{post.author_name || 'إدارة جمعية أطباء الأسرة العراقية'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ar-IQ')}</span>
                </span>
                {post.metadata?.read_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{post.metadata.read_time}</span>
                  </span>
                )}
              </div>

              {/* Share Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="نسخ رابط الخبر"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'مشاركة'}</span>
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-navy-900 hover:text-white text-slate-600 transition-colors"
                  title="مشاركة على فيسبوك"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={post.featured_image} 
                alt={post.title_ar} 
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* Official Attachment Download Box */}
          {post.metadata?.file_url && (
            <div className="mb-8 p-4 rounded-2xl bg-medical-50 border border-medical-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-medical-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">
                    {post.metadata.file_name || 'ملف الأمر الإداري الرسمي'}
                  </h4>
                  <p className="text-xs text-slate-500">نسخة رسمية صادرة عن جمعية أطباء الأسرة العراقية (PDF)</p>
                </div>
              </div>
              <a
                href={post.metadata.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                تنزيل الملف الرسمي
              </a>
            </div>
          )}

          {/* Article Main Text Content */}
          <div className="py-4">
            <RichTextRenderer content={post.content_ar} />
          </div>

          {/* Back Navigation */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-medical-600 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لصفحة الأخبار</span>
            </Link>
          </div>
        </article>

        {/* Related News */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-navy-900 mb-6">أخبار وتقارير ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div 
                  key={rel.id} 
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-md transition-shadow flex items-start gap-4"
                >
                  <img 
                    src={rel.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80'} 
                    alt={rel.title_ar}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {new Date(rel.published_at || rel.created_at).toLocaleDateString('ar-IQ')}
                    </span>
                    <h4 className="font-bold text-navy-900 text-sm leading-snug hover:text-medical-600 mb-2">
                      <Link to={`/news/${rel.slug}`}>{rel.title_ar}</Link>
                    </h4>
                    <Link 
                      to={`/news/${rel.slug}`} 
                      className="text-xs font-semibold text-medical-600 flex items-center gap-1"
                    >
                      <span>قراءة</span>
                      <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
