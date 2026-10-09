import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, Calendar, FileText, ArrowRight, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { getPostBySlug } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { RichTextRenderer } from '../../components/common/RichTextRenderer';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const OpportunityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [opp, setOpp] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpp() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getPostBySlug(slug);
        if (found) {
          setOpp(found);
        } else {
          navigate('/opportunities');
        }
      } catch (e) {
        console.error('Error loading opportunity:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOpp();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <LoadingSpinner size="lg" label="جارِ تحميل التفاصيل..." />
      </div>
    );
  }

  if (!opp) return null;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <SEO 
        title={opp.seo_title || opp.title_ar} 
        description={opp.seo_description || opp.summary_ar}
        image={opp.featured_image}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-900">الرئيسية</Link>
          <span>/</span>
          <Link to="/opportunities" className="hover:text-navy-900">الدراسات العليا</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{opp.title_ar}</span>
        </nav>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="md">إعلان أكاديمي رسمي</Badge>
              {opp.metadata?.deadline && (
                <span className="text-xs text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold">
                  الموعد النهائي: {opp.metadata.deadline}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-4">
              {opp.title_ar}
            </h1>

            {opp.summary_ar && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border-r-4 border-medical-500 mb-6">
                {opp.summary_ar}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">الجهة المشرفة والمعلنة:</span>
                  <span>{opp.metadata?.authority || 'المجلس العلمي لاختصاص طب الأسرة'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">نوع الامتحان أو الفرصة:</span>
                  <span>{opp.metadata?.exam_type || 'بورد عربي / عراقي'}</span>
                </div>
              </div>
            </div>
          </header>

          {opp.metadata?.file_url && (
            <div className="mb-8 p-5 rounded-2xl bg-medical-50 border border-medical-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-medical-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">
                    {opp.metadata.file_name || 'ملف شروط وتعليمات الامتحان الرسمي'}
                  </h4>
                  <p className="text-xs text-slate-500">تحميل ملف الوثائق والمواعيد واللجان الامتحانية</p>
                </div>
              </div>
              <a
                href={opp.metadata.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>تحميل الدليل (PDF)</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="py-4">
            <RichTextRenderer content={opp.content_ar} />
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-medical-600"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لإعلانات الدراسات العليا</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
