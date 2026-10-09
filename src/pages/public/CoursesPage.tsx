import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, MapPin, Award, ChevronLeft, ExternalLink, Users } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="منظومة التدريب والتطوير المهني المستدام (CPD-s)" 
        description="الدورات التدريبية المعتمدة وورش العمل التخصصية لأطباء الأسرة في العراق ضمن إطار منظومة CPD-s."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" size="md" className="mb-3">
            منظومة CPD-s الرسمية
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            الدورات التدريبية وورش العمل التخصصية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            إطار معياري شامل صاغته جمعية أطباء الأسرة العراقية لمأسسة التعليم الطبي المستمر والارتقاء بالأداء السريري والإداري والبحثي للطبيب.
          </p>
        </div>

        {/* CPD-s Info Box */}
        <div className="bg-gradient-to-r from-medical-900 via-navy-950 to-navy-900 text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-xl border border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <span className="text-xs font-bold text-medical-300 font-sans tracking-wider">CPD-s FRAMEWORK</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">دليل منظومة التطوير المهني المستدام</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
                تمنح دورات الجمعية ساعات تدريبية معتمدة تضاف إلى السجل المهني للأعضاء وتساعد في متطلبات الترقيات العلمية ومواكبة أحدث البروتوكولات العلاجية.
              </p>
            </div>
            <a
              href="mailto:info@iraqifps.org?subject=استفسار%20عن%20ساعات%20التطوير%20المهني%20CPD-s"
              className="px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors shrink-0"
            >
              طلب استفسار عن الساعات المعتمدة
            </a>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الدورات..." />
        ) : courses.length === 0 ? (
          <EmptyState 
            title="لا توجد دورات تدريبية متاحة حالياً"
            description="ترقبوا الإعلان عن الحقائب التدريبية الجديدة قريباً."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="border-t-4 border-t-medical-500 flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {course.metadata?.cpd_hours ? `${course.metadata.cpd_hours} ساعة معتمدة` : 'دورة معتمدة'}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {course.metadata?.registration_status === 'open' ? 'التسجيل متاح' : 'قريباً'}
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-lg mb-2 leading-snug">
                    <Link to={`/courses/${course.slug}`} className="hover:text-medical-600 transition-colors">
                      {course.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {course.summary_ar}
                  </p>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6">
                    {course.metadata?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-medical-600" />
                        <span>المدة: {course.metadata.duration}</span>
                      </div>
                    )}
                    {course.metadata?.mode && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-medical-600" />
                        <span>طبيعة التدريب: {course.metadata.mode}</span>
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

                <div className="pt-2 flex items-center gap-2">
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
                      className="py-2.5 px-3 bg-medical-50 hover:bg-medical-100 text-medical-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>تسجيل</span>
                      <ExternalLink className="w-3 h-3" />
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
