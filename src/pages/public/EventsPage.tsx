import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronLeft, ExternalLink } from 'lucide-react';
import { getPosts } from '../../lib/db';
import { Post } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'all'>('upcoming');

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
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="الفعاليات والمؤتمرات العلمية" 
        description="المؤتمرات السنوية والندوات العلمية وورش العمل التخصصية لجمعية أطباء الأسرة العراقية (IFPS)."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="secondary" size="md" className="mb-3">
            المؤتمرات والملتقيات الطبية
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            المؤتمرات والفعاليات العلمية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            منصات علمية رصينة تجمع استشاريي وأطباء الأسرة من كافة المحافظات العراقية لمناقشة أحدث المستجدات السريرية ودعم منظومة الرعاية الأولية.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-soft flex gap-1">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tab === 'upcoming' 
                  ? 'bg-navy-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              الفعاليات القادمة
            </button>
            <button
              onClick={() => setTab('all')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tab === 'all' 
                  ? 'bg-navy-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              جميع الفعاليات والمؤتمرات
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="جارِ تحميل الفعاليات..." />
        ) : events.length === 0 ? (
          <EmptyState 
            title="لا توجد فعاليات معلنة حالياً"
            description="ترقبوا الإعلان عن المؤتمرات العلمية وورش العمل القادمة قريباً."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col justify-between overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img 
                    src={event.featured_image || 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80'} 
                    alt={event.title_ar} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {event.metadata?.registration_status === 'open' ? 'التسجيل متاح' : 'فعالية معلنة'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-navy-900 mb-3 hover:text-medical-600 transition-colors">
                      <Link to={`/events/${event.slug}`}>{event.title_ar}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {event.summary_ar}
                    </p>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6">
                      {event.metadata?.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-medical-600" />
                          <span className="font-semibold">{event.metadata.event_date}</span>
                          {event.metadata?.event_time && <span className="text-slate-400">({event.metadata.event_time})</span>}
                        </div>
                      )}
                      {event.metadata?.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-medical-600" />
                          <span>{event.metadata.venue}</span>
                        </div>
                      )}
                      {event.metadata?.organizer && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-medical-600" />
                          <span>الجهة المنظمة: {event.metadata.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <Link
                      to={`/events/${event.slug}`}
                      className="flex-1 py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
                    >
                      تفاصيل الفعالية وجدول الأعمال
                    </Link>
                    {event.metadata?.registration_url && (
                      <a
                        href={event.metadata.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-medical-50 hover:bg-medical-100 text-medical-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                      >
                        <span>التسجيل</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
