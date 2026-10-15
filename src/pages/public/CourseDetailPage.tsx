import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Clock, MapPin, Award, Users, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { getPostBySlug } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { RichTextRenderer } from '../../components/common/RichTextRenderer';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getDerivedRegistrationStatus } from '../../lib/statusUtils';
import { AttachedFormCard } from '../../components/common/AttachedFormCard';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = course?.metadata?.gallery_images?.length 
    ? course.metadata.gallery_images 
    : [course?.featured_image].filter(Boolean) as string[];

  useEffect(() => {
    if (!displayImages || displayImages.length <= 1) return;
    
    const interval = (course?.metadata?.slider_interval || 3) * 1000;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [displayImages.length, course?.metadata?.slider_interval]);

  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getPostBySlug(slug);
        if (found) {
          setCourse(found);
        } else {
          navigate('/courses');
        }
      } catch (e) {
        console.error('Error loading course:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <LoadingSpinner size="lg" label="جارِ تحميل تفاصيل الدورة..." />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <SEO 
        title={course.seo_title || course.title_ar} 
        description={course.seo_description || course.summary_ar}
        image={course.featured_image}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-900">الرئيسية</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-navy-900">الدورات والورش</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{course.title_ar}</span>
        </nav>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" size="md">
                {course.metadata?.cpd_hours ? `${course.metadata.cpd_hours} ساعة CPD معتمدة` : 'دورة معتمدة'}
              </Badge>
              {getDerivedRegistrationStatus(course) === 'open' && (
                <Badge variant="success" size="md">التسجيل مفتوح</Badge>
              )}
              {getDerivedRegistrationStatus(course) === 'closed' && (
                <Badge variant="danger" size="md">التسجيل انتهى</Badge>
              )}
              {getDerivedRegistrationStatus(course) === 'archived' && (
                <Badge variant="neutral" size="md">مؤرشفة</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-4">
              {course.title_ar}
            </h1>

            {course.summary_ar && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border-r-4 border-medical-500 mb-6">
                {course.summary_ar}
              </p>
            )}

            {/* Course Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">مدة البرنامج:</span>
                  <span>{course.metadata?.duration || 'مكثف'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">طبيعة الحضور:</span>
                  <span>{course.metadata?.mode || 'حضوري وافتراضي'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">المحاضرون والمدربون:</span>
                  <span>{course.metadata?.instructor || 'اللجنة العلمية للتدريب'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">الشهادة والاعتماد:</span>
                  <span>{course.metadata?.certificate_info || 'شهادة معتمدة من جمعية أطباء الأسرة العراقية'}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image / Gallery Slider */}
          {displayImages.length > 0 && (
            <div className={`mb-8 rounded-2xl overflow-hidden shadow-sm relative group ${
              course.metadata?.image_display_style === 'contain' ? 'bg-slate-100 flex flex-col items-center justify-center' : ''
            }`}>
              <div className="relative w-full overflow-hidden cursor-zoom-in" onClick={() => setFullscreenImage(displayImages[currentImageIndex])}>
                <img 
                  key={currentImageIndex}
                  src={displayImages[currentImageIndex]} 
                  alt={`${course.title_ar} - صورة ${currentImageIndex + 1}`} 
                  className={`w-full transition-transform hover:opacity-95 animate-fade-in ${
                    course.metadata?.image_display_style === 'auto'
                      ? 'h-auto object-contain'
                      : course.metadata?.image_display_style === 'contain'
                        ? 'h-auto max-h-[600px] object-contain'
                        : 'h-[300px] sm:h-[460px] object-cover'
                  }`}
                />
              </div>

              {/* Slider Dots */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                        currentImageIndex === idx 
                          ? 'bg-medical-600 scale-125' 
                          : 'bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`الانتقال للصورة رقم ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Registration Box */}
          {course.metadata?.registration_url && getDerivedRegistrationStatus(course) === 'open' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-medical-900 to-navy-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-bold text-base mb-1">المشاركة والتسجيل في الدورة</h3>
                <p className="text-xs text-slate-300">سجل بياناتك للانضمام إلى مسار التدريب واحتساب الساعات المعتمدة.</p>
              </div>
              <a
                href={course.metadata.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-medical-500 hover:bg-medical-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <span>استمارة التسجيل الرسمية</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="py-4">
            <RichTextRenderer content={course.content_ar} />
          </div>

          {/* Attached Survey / Form (DTform) */}
          <AttachedFormCard 
            formId={course.metadata?.attached_form_id} 
            formSlug={course.metadata?.attached_form_slug} 
          />

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-medical-600"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع الدورات</span>
            </Link>
          </div>
        </article>
      </div>

      {/* Fullscreen Image Lightbox */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={fullscreenImage} 
            alt="صورة مكبرة" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </div>
  );
};
