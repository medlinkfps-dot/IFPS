import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, ChevronLeft } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const res = await getPosts({ contentTypeSlug: 'events' });
        setEvents(res.posts);
      } catch (e) {
        console.error('Error loading events:', e);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="الفعاليات والمؤتمرات العلمية" 
        description="المؤتمرات السنوية والندوات العلمية وورش العمل التخصصية لجمعية أطباء الأسرة العراقية (IFPS)."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <Calendar className="w-4 h-4 text-medical-500" />
            <span>اللقاءات العلمية الوطنية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            المؤتمرات والفعاليات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            ملتقيات تجمع استشاريي وأطباء الأسرة في العراق لمناقشة أحدث بروتوكولات الرعاية الأولية
          </p>
        </div>

        {/* Events List */}
        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الفعاليات..." />
        ) : events.length === 0 ? (
          <EmptyState 
            title="لا توجد مؤتمرات مدرجة حالياً"
            description="ترقبوا الإعلان عن مواعيد المؤتمرات القادمة قريباً."
          />
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-7 shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
              >
                {/* Date block */}
                <div className="w-full sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center p-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-medium">المؤتمر السنوي</span>
                  <span className="text-xl font-black text-navy-900 font-sans my-0.5">2026</span>
                  <span className="text-[11px] font-bold text-medical-700 bg-medical-50 px-2 py-0.5 rounded-full">
                    بغداد
                  </span>
                </div>

                {/* Event info */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-navy-900 bg-navy-50 px-2.5 py-0.5 rounded-full">
                      مؤتمر علمي وطني
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      التسجيل مفتوح
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-snug hover:text-medical-600 transition-colors">
                    <Link to={`/events/${event.slug}`}>
                      {event.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {event.summary_ar}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50 text-xs">
                    <div className="flex items-center gap-4 text-slate-400">
                      {event.metadata?.venue && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{event.metadata.venue}</span>
                        </span>
                      )}
                      {event.metadata?.event_date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.metadata.event_date}</span>
                        </span>
                      )}
                    </div>

                    <Link 
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-medical-600 hover:text-medical-700"
                    >
                      <span>تفاصيل المؤتمر</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
