import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Globe, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ChevronLeft,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getPosts, getSettings } from '../../lib/db';
import { Post, SiteSetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [news, setNews] = useState<Post[]>([]);
  const [courses, setCourses] = useState<Post[]>([]);
  const [events, setEvents] = useState<Post[]>([]);
  const [opportunities, setOpportunities] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [newsRes, coursesRes, eventsRes, oppsRes, setts] = await Promise.all([
          getPosts({ contentTypeSlug: 'news', limit: 3 }),
          getPosts({ contentTypeSlug: 'courses', limit: 3 }),
          getPosts({ contentTypeSlug: 'events', limit: 2 }),
          getPosts({ contentTypeSlug: 'opportunities', limit: 2 }),
          getSettings(),
        ]);

        setNews(newsRes.posts);
        setCourses(coursesRes.posts);
        setEvents(eventsRes.posts);
        setOpportunities(oppsRes.posts);
        setSettings(setts);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeContent();
  }, []);

  const emblemUrl = settings['official_emblem_url']?.value_ar || '/fps.png';
  const idSystemUrl = settings['id_system_url']?.value_ar || 'https://id.iraqifps.org';

  return (
    <>
      <SEO 
        title="الرئيسية" 
        description="الموقع الرسمي لجمعية أطباء الأسرة العراقية (IFPS) - المظلة المهنية والعلمية لأطباء الأسرة في العراق، شريككم الدائم نحو صحة أفضل."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle Geometric Background */}
        <div className="absolute inset-0 pattern-grid opacity-15 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-iraqiGold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Institutional Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-navy-700/80 text-medical-300 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-xs">
                <ShieldCheck className="w-4 h-4 text-medical-400 shrink-0" />
                <span>المظلة المهنية والعلمية الرسمية لأطباء الأسرة في العراق منذ 2012</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.2] tracking-tight">
                نحو نظام صحي وطني حديث يرتكز على <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-300 via-medical-400 to-teal-200">الوقاية ورعاية الأسرة</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
                نحن لا ننتظر المرض لنعالجه، بل نعمل لنحميك منه أولاً. نقود مسيرة تطوير طب الأسرة في العراق، ومأسسة منظومة التطوير المهني المستدام، ودعم تطبيق قانون الضمان الصحي الوطني بشراكة دولية مع منظمة WONCA العالمية.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/membership"
                  className="flex items-center gap-2 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-lg shadow-medical-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>إصدار وتجديد الهويات المهنية</span>
                </Link>

                <Link
                  to="/about"
                  className="flex items-center gap-2 bg-navy-800/80 hover:bg-navy-800 text-slate-200 hover:text-white font-semibold px-5 py-3.5 rounded-xl text-sm border border-navy-700 transition-all hover:border-slate-500"
                >
                  <span>التعرف على الجمعية ورسالتها</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-navy-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-medical-400" />
                  <span>اعتماد المجلس العلمي لطب الأسرة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-medical-400" />
                  <span>تمثيل العراق في WONCA World</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-iraqiGold-400" />
                  <span>منظومة التطوير المهني CPD-s</span>
                </div>
              </div>
            </div>

            {/* Right Card / Emblem Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-navy-900/90 border border-navy-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-navy-800">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-md">
                    <img 
                      src={emblemUrl} 
                      alt="الختم الرسمي لجمعية أطباء الأسرة العراقية" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">جمعية أطباء الأسرة العراقية</h3>
                    <p className="text-xs text-medical-300">Iraqi Family Physicians Society</p>
                    <span className="inline-block mt-1 text-[11px] bg-medical-900/60 text-medical-200 px-2 py-0.5 rounded border border-medical-700/50">
                      شريككم الدائم نحو صحة أفضل
                    </span>
                  </div>
                </div>

                {/* President Quote Card */}
                <div className="bg-navy-950/80 rounded-2xl p-4 border border-navy-800/80 relative mb-6">
                  <div className="text-xs text-slate-300 leading-relaxed italic mb-3">
                    "إننا نؤمن إيماناً راسخاً بأن طب الأسرة هو حجر الزاوية الحقيقي لبناء نظام صحي وطني مستدام وفعال. طبيب الأسرة ليس مجرد مقدم خدمة، بل هو الشريك الموثوق والدائم لصحة الفرد والعائلة وخط الدفاع الأول."
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-navy-800">
                    <span className="font-bold text-white">الطبيب الاستشاري د. منتظر سعد</span>
                    <span className="text-[11px] text-iraqiGold-400">رئيس الجمعية</span>
                  </div>
                </div>

                {/* Direct Actions in Card */}
                <div className="space-y-2">
                  <Link 
                    to="/courses"
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-800/60 hover:bg-navy-800 text-xs text-slate-200 hover:text-white transition-colors border border-navy-700/50"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-medical-400" />
                      <span>جدول دورات التطوير المهني CPD-s</span>
                    </span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </Link>

                  <a 
                    href={idSystemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-medical-900/30 hover:bg-medical-900/50 text-xs text-medical-200 hover:text-white transition-colors border border-medical-800/50"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-medical-400" />
                      <span>التحقق من الهوية الإلكترونية (id.iraqifps.org)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-medical-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Numbers Banner */}
      <section className="bg-white border-y border-slate-200/80 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">2012</span>
              <p className="text-xs text-slate-500 font-medium">سنة التأسيس والانطلاق الرسمي</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-medical-600 font-sans">WONCA</span>
              <p className="text-xs text-slate-500 font-medium">تمثيل مهني في المنظمة العالمية</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">CPD-s</span>
              <p className="text-xs text-slate-500 font-medium">منظومة معيارية للتطوير المستدام</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-iraqiGold-600 font-sans">18</span>
              <p className="text-xs text-slate-500 font-medium">محافظة تشملها خدمات ونشاطات الجمعية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Latest News */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-medical-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المستجدات والنشاطات</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                أحدث الأخبار والإعلانات الرسمية
              </h2>
            </div>
            <Link 
              to="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              <span>عرض جميع الأخبار</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} className="flex flex-col h-full">
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img 
                      src={item.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'} 
                      alt={item.title_ar}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {item.is_pinned && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                        مثبت
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.published_at || item.created_at).toLocaleDateString('ar-IQ')}</span>
                      </div>
                      <h3 className="font-bold text-navy-900 text-base leading-snug mb-2 hover:text-medical-600 transition-colors line-clamp-2">
                        <Link to={`/news/${item.slug}`}>{item.title_ar}</Link>
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {item.summary_ar}
                      </p>
                    </div>

                    <Link 
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700 pt-3 border-t border-slate-100"
                    >
                      <span>قراءة الخبر كاملاً</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: CPD Courses & Workshops */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-medical-600 text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>التعليم الطبي المستمر</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                منظومة التدريب والتطوير المهني المستدام (CPD-s)
              </h2>
            </div>
            <Link 
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              <span>جميع الدورات والورش</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((item) => (
              <Card key={item.id} className="border-t-4 border-t-medical-500 flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {item.metadata?.cpd_hours ? `${item.metadata.cpd_hours} ساعة معتمدة` : 'دورة تخصصية'}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.metadata?.registration_status === 'open' ? 'التسجيل متاح' : 'قريباً'}
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-base mb-2 leading-snug">
                    <Link to={`/courses/${item.slug}`} className="hover:text-medical-600 transition-colors">
                      {item.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {item.summary_ar}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.metadata?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>المدة: {item.metadata.duration}</span>
                      </div>
                    )}
                    {item.metadata?.mode && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>طبيعة الانعقاد: {item.metadata.mode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/courses/${item.slug}`}
                    className="block w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
                  >
                    تفاصيل الدورة والتسجيل
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Conferences & Events */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2 text-medical-600 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>اللقاءات العلمية الوطنية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">
                المؤتمرات العلمية والملتقيات التخصصية
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تنظم الجمعية مؤتمرات دورية لتبادل الخبرات السريرية، ومناقشة سياسات الرعاية الأولية مع وزارة الصحة، واستعراض أحدث الأبحاث الطبية العالمية.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-navy-900 transition-colors shadow-xs"
              >
                <span>جدول الفعاليات والمؤتمرات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="w-full sm:w-28 sm:h-28 rounded-xl bg-navy-50 border border-navy-100 flex flex-col items-center justify-center text-center p-2 shrink-0">
                    <span className="text-xs text-navy-600 font-bold">المؤتمر السنوي</span>
                    <span className="text-lg font-black text-navy-950 font-sans my-0.5">2026</span>
                    <span className="text-[10px] text-medical-700 bg-medical-50 px-2 py-0.5 rounded">بغداد</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">مؤتمر وطني</Badge>
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        التسجيل مفتوح
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-snug">
                      <Link to={`/events/${event.slug}`} className="hover:text-medical-600 transition-colors">
                        {event.title_ar}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.summary_ar}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                      {event.metadata?.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{event.metadata.venue}</span>
                        </span>
                      )}
                      {event.metadata?.event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{event.metadata.event_date}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Membership & Identity System CTA */}
      <section className="py-16 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 border border-navy-700 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-900/60 border border-medical-700/60 text-medical-300 text-xs font-semibold">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>الخدمات الإلكترونية للأعضاء</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  إصدار وتجديد هويات الجمعية والتحقق الرقمي
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-light">
                  تمنح هوية جمعية أطباء الأسرة العراقية حاملها الصفة التمثيلية الرسمية، وتتيح الاستفادة من برامج منظومة التطوير المهني CPD-s، والخصومات المعتمدة في المؤتمرات الدولية، وتسهيل الإجراءات الإدارية.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to="/membership"
                    className="px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
                  >
                    دليل شروط التقديم والتجديد
                  </Link>

                  <a
                    href={idSystemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs sm:text-sm border border-navy-600 transition-colors"
                  >
                    <span>الدخول المباشر لبوابة الهويات (id.iraqifps.org)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-56 h-36 bg-gradient-to-br from-medical-600 via-medical-700 to-navy-900 rounded-2xl p-4 text-white shadow-xl border border-medical-400/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider">IFPS IRAQ</span>
                    <ShieldCheck className="w-5 h-5 text-medical-200" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-mono tracking-widest text-medical-100">•••• •••• •••• 2026</span>
                    <span className="block text-[11px] font-bold">هوية طبيب أسرة اختصاص</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-medical-200">
                    <span>جمهورية العراق</span>
                    <span>منظمة WONCA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Postgraduate & Fellowships Teaser */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-medical-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>المسار الأكاديمي والمهني</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                الدراسات العليا، البورد العربي، والفرص العلمية
              </h2>
            </div>
            <Link 
              to="/opportunities"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              <span>جميع الإعلانات الأكاديمية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((item) => (
              <Card key={item.id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="primary" size="sm">البورد العربي والعراقي</Badge>
                    {item.metadata?.deadline && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-medium">
                        الموعد النهائي: {item.metadata.deadline}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-navy-900 text-base mb-2 leading-snug">
                    <Link to={`/opportunities/${item.slug}`} className="hover:text-medical-600 transition-colors">
                      {item.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.summary_ar}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    الجهة: {item.metadata?.authority || 'المجلس العلمي لاختصاص طب الأسرة'}
                  </span>
                  <Link
                    to={`/opportunities/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700"
                  >
                    <span>التفاصيل والشروط</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
