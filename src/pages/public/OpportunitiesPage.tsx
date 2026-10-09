import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, FileText, ChevronLeft, Download } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const res = await getPosts({ contentTypeSlug: 'opportunities' });
        setOpportunities(res.posts);
      } catch (e) {
        console.error('Error loading opportunities:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="الدراسات العليا والفرص العلمية" 
        description="إعلانات امتحانات البورد العربي والمجلس العلمي لاختصاص طب الأسرة والفرص التدريبية والزمالات في العراق."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="primary" size="md" className="mb-3">
            المسار التخصصي والأكاديمي
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            الدراسات العليا، البورد العربي، والزمالات
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            دليلك الرسمي لكافة إعلانات برامج البورد العربي والمجلس العراقي للاختصاصات الطبية، مواعيد الامتحانات السريرية والأوسكي، وفرص التدريب الإكلينيكي المتقدم.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الفرص العلمية..." />
        ) : opportunities.length === 0 ? (
          <EmptyState 
            title="لا توجد إعلانات دراسات عليا حالياً"
            description="يتم تحديث الإعلانات الأكاديمية فور صدورها من المجلس العلمي للجمعية."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((item) => (
              <Card key={item.id} className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant="primary" size="sm">
                      {item.metadata?.exam_type || 'بورد تخصصي'}
                    </Badge>
                    {item.metadata?.deadline && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full font-bold">
                        الموعد النهائي: {item.metadata.deadline}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-navy-900 mb-3 leading-snug hover:text-medical-600 transition-colors">
                    <Link to={`/opportunities/${item.slug}`}>{item.title_ar}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {item.summary_ar}
                  </p>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-medical-600 shrink-0" />
                      <span>الجهة المعلنة: {item.metadata?.authority || 'المجلس العلمي لطب الأسرة'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/opportunities/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-medical-600"
                  >
                    <span>تفاصيل الشروط والتعليمات</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>

                  {item.metadata?.file_url && (
                    <a
                      href={item.metadata.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-medical-700 bg-medical-50 hover:bg-medical-100 px-3 py-1.5 rounded-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>الملف الرسمي</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
