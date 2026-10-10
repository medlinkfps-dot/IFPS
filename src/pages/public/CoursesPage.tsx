import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, MapPin, ExternalLink, Users, ChevronLeft } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const res = await getPosts({ contentTypeSlug: 'courses' });
        setCourses(res.posts);
      } catch (e) {
        console.error('Error loading courses:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();

    const handleUpdate = () => {
      loadCourses();
    };
    window.addEventListener('ifps_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ifps_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="دورات منظومة التطوير المهني CPD-s" 
        description="الدورات التدريبية المعتمدة وورش العمل التخصصية لأطباء الأسرة في العراق ضمن إطار منظومة CPD-s."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <GraduationCap className="w-4 h-4 text-medical-500" />
            <span>التعليم الطبي المستمر</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            الدورات وورش العمل (CPD-s)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            برامج تدريبية تخصصية معتمدة تدعم الكفاءة السريرية ومتطلبات الترقية العلمية
          </p>
        </div>

        {/* CPD-s Info Card */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <span className="text-[11px] font-bold text-medical-300 font-sans tracking-wide">
                CPD-s FRAMEWORK
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                منظومة التطوير المهني المستدام
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
                تمنح دورات الجمعية ساعات تعليمية موثقة تضاف إلى السجل المهني للأعضاء وتؤهل للترقيات والمشاركات الدولية.
              </p>
            </div>

            <a
              href="mailto:info@iraqifps.org?subject=استفسار%20عن%20ساعات%20التطوير%20المهني%20CPD-s"
              className="px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              استفسار عن الساعات المعتمدة
            </a>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الدورات..." />
        ) : courses.length === 0 ? (
          <EmptyState 
            title="لا توجد دورات تدريبية حالياً"
            description="ترقبوا الإعلان عن الحقائب التدريبية الجديدة قريباً."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-md transition-all flex flex-col justify-between p-6 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full">
                      {course.metadata?.cpd_hours ? `${course.metadata.cpd_hours} ساعات معتمدة` : 'دورة تخصصية'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      التسجيل متاح
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-base leading-snug group-hover:text-medical-600 transition-colors">
                    <Link to={`/courses/${course.slug}`}>
                      {course.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-normal">
                    {course.summary_ar}
                  </p>

                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 font-normal">
                    {course.metadata?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-medical-600" />
                        <span>المدة: {course.metadata.duration}</span>
                      </div>
                    )}
                    {course.metadata?.mode && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-medical-600" />
                        <span>الانعقاد: {course.metadata.mode}</span>
                      </div>
                    )}
                    {course.metadata?.instructor && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-medical-600" />
                        <span>المحاضر: {course.metadata.instructor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-2">
                  <Link
                    to={`/courses/${course.slug}`}
                    className="flex-1 py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
                  >
                    تفاصيل الدورة
                  </Link>
                  {course.metadata?.registration_url && (
                    <a
                      href={course.metadata.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-medical-50 hover:bg-medical-100 text-medical-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>تسجيل</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
