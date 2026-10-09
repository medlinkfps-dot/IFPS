import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronLeft } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
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
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="الدراسات العليا والفرص العلمية" 
        description="إعلانات امتحانات البورد العربي والمجلس العلمي لاختصاص طب الأسرة والفرص التدريبية والزمالات في العراق."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <Award className="w-4 h-4 text-medical-500" />
            <span>المسار التخصصي والأكاديمي</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            الدراسات العليا والزمالات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            إعلانات البورد العربي والمجلس العراقي للاختصاصات الطبية ومواعيد الامتحانات السريرية
          </p>
        </div>

        {/* Opportunities List */}
        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الفرص العلمية..." />
        ) : opportunities.length === 0 ? (
          <EmptyState 
            title="لا توجد إعلانات دراسات عليا حالياً"
            description="يتم تحديث الإعلانات الأكاديمية فور صدورها من المجلس العلمي."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {opportunities.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-navy-900 bg-navy-50 px-2.5 py-0.5 rounded-full">
                      البورد العربي والعراقي
                    </span>
                    {item.metadata?.deadline && (
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                        الموعد النهائي: {item.metadata.deadline}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-navy-900 text-base leading-snug group-hover:text-medical-600 transition-colors">
                    <Link to={`/opportunities/${item.slug}`}>
                      {item.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.summary_ar}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    الجهة: {item.metadata?.authority || 'المجلس العلمي لطب الأسرة'}
                  </span>
                  <Link
                    to={`/opportunities/${item.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-medical-600 hover:text-medical-700"
                  >
                    <span>الشروط والتفاصيل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
