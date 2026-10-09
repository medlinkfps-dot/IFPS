import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import { getPostBySlug } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { RichTextRenderer } from '../../components/common/RichTextRenderer';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getPostBySlug(slug);
        if (found) {
          setEvent(found);
        } else {
          navigate('/events');
        }
      } catch (e) {
        console.error('Error loading event:', e);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <LoadingSpinner size="lg" label="جارِ تحميل تفاصيل الفعالية..." />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <SEO 
        title={event.seo_title || event.title_ar} 
        description={event.seo_description || event.summary_ar}
        image={event.featured_image}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-900">الرئيسية</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-navy-900">الفعاليات والمؤتمرات</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{event.title_ar}</span>
        </nav>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="md">مؤتمر طبي معتمد</Badge>
              <Badge variant="success" size="md">
                {event.metadata?.registration_status === 'open' ? 'التسجيل مفتوح' : 'فعالية معلنة'}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 leading-tight mb-4">
              {event.title_ar}
            </h1>

            {event.summary_ar && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border-r-4 border-medical-500 mb-6">
                {event.summary_ar}
              </p>
            )}

            {/* Quick Event Overview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">تاريخ الانعقاد:</span>
                  <span>{event.metadata?.event_date || 'تحدد لاحقاً'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">التوقيت:</span>
                  <span>{event.metadata?.event_time || '09:00 صباحاً'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">المكان والمقر:</span>
                  <span>{event.metadata?.venue || 'بغداد - جمهورية العراق'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">الجهة المنظمة:</span>
                  <span>{event.metadata?.organizer || 'جمعية أطباء الأسرة العراقية'}</span>
                </div>
              </div>
            </div>
          </header>

          {event.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={event.featured_image} 
                alt={event.title_ar} 
                className="w-full h-auto max-h-[440px] object-cover"
              />
            </div>
          )}

          {/* Registration CTA Bar */}
          {event.metadata?.registration_url && (
            <div className="mb-8 p-6 bg-gradient-to-r from-medical-900 to-navy-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-bold text-base mb-1">هل ترغب بالمشاركة في هذا المؤتمر؟</h3>
                <p className="text-xs text-slate-300">سجل بياناتك لحجز مقعدك وتأكيد شهادة الحضور المعتمدة.</p>
              </div>
              <a
                href={event.metadata.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-medical-500 hover:bg-medical-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <span>الانتقال لرابط التسجيل المعتمد</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="py-4">
            <RichTextRenderer content={event.content_ar} />
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-medical-600"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجدول الفعاليات</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
