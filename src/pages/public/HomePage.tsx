import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Globe, 
  ChevronLeft,
  GraduationCap,
  ExternalLink,
  Sparkles,
  MapPin,
  CheckCircle2,
  Stethoscope
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
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [newsRes, coursesRes, eventsRes, setts] = await Promise.all([
          getPosts({ contentTypeSlug: 'news', limit: 3 }),
          getPosts({ contentTypeSlug: 'courses', limit: 3 }),
          getPosts({ contentTypeSlug: 'events', limit: 2 }),
          getSettings(),
        ]);

        setNews(newsRes.posts);
        setCourses(coursesRes.posts);
        setEvents(eventsRes.posts);
        setSettings(setts);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeContent();

    const handleUpdate = () => {
      loadHomeContent();
    };
    window.addEventListener('ifps_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ifps_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const emblemUrl = settings['official_emblem_url']?.value_ar || '/fps.png';

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      <SEO 
        title="الرئيسية" 
        description="الموقع الرسمي لجمعية أطباء الأسرة العراقية (IFPS) - المظلة المهنية والعلمية لأطباء الأسرة في العراق، شريككم الدائم نحو صحة أفضل."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Clean, Spacious, Contemporary) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-12 lg:p-16 overflow-hidden border border-navy-800 shadow-xl">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-medical-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-80 h-80 bg-medical-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Text & Primary Actions */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-right">
                
                {/* Institutional Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-medical-300 text-xs sm:text-sm font-semibold">
                  <ShieldCheck className="w-4 h-4 text-medical-400 shrink-0" />
                  <span>المظلة المهنية الرسمية لأطباء الأسرة في العراق</span>
                </div>

                {/* Primary Headline in Cairo */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-normal">
                  صحة المجتمع تبدأ من <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-300 via-medical-400 to-teal-200">
                    طبيب الأسرة الموثوق
                  </span>
                </h1>

                {/* Clean, Concise Subtitle */}
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                  نقود تطوير الرعاية الصحية الأولية في العراق عبر برامج التدريب المستمر (CPD-s)، تعزيز البحث العلمي، والشراكة الدولية الفاعلة مع منظمة WONCA العالمية.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Link
                    to="/about"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>عن الجمعية ورسالتها</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/courses"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3.5 rounded-2xl text-sm border border-white/10 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-medical-300" />
                    <span>دورات منظومة CPD-s</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-medical-400" />
                    <span>تأسست 2012</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-medical-400" />
                    <span>عضوية WONCA World</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-medical-400" />
                    <span>اعتماد ساعات CPD-s</span>
                  </div>
                </div>
              </div>

              {/* Visual Showcase (Emblem & Quick Info Card) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
                  
                  {/* Digital Media & Communications Glowing Tag */}
                  <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-500/20 border border-medical-400/50 shadow-[0_0_20px_rgba(45,212,191,0.3)] backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300 shadow-[0_0_8px_#2dd4bf]"></span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-teal-200 animate-glow-text tracking-wide">
                      الإعلام والتواصل الرقمي
                    </span>
                  </div>

                  {/* Emblem */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 p-2 bg-white rounded-3xl shadow-lg flex items-center justify-center">
                    <img 
                      src={emblemUrl} 
                      alt="شعار جمعية أطباء الأسرة العراقية" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h2 className="text-white font-black text-lg mb-1">
                    جمعية أطباء الأسرة العراقية
                  </h2>
                  <p className="text-xs text-medical-300 font-sans tracking-wide mb-5">
                    Iraqi Family Physicians Society • IFPS
                  </p>

                  <div className="bg-navy-950/60 rounded-2xl p-4 border border-white/10 text-right space-y-2">
                    <div className="text-xs text-slate-200 leading-relaxed font-light">
                      "{settings['president_quote']?.value_ar || 'طبيب الأسرة هو خط الدفاع الأول والشريك الدائم لصحة الفرد والعائلة في كل مراحل الحياة.'}"
                    </div>
                    <div className="text-[11px] font-bold text-medical-300">
                      {settings['president_name']?.value_ar || 'الطبيب الاستشاري  أ.م.د. منتظر سعد جابر'} — {settings['president_title']?.value_ar || 'رئيس الجمعية'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & KEY METRICS (Clean Minimal Row) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
            <div className="text-center space-y-1 pt-2 sm:pt-0">
              <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">2012</span>
              <p className="text-xs text-slate-500 font-medium">سنة التأسيس والانطلاق</p>
            </div>
            <div className="text-center space-y-1 pt-2 sm:pt-0">
              <span className="text-2xl sm:text-3xl font-black text-medical-600 font-sans">WONCA</span>
              <p className="text-xs text-slate-500 font-medium">التمثيل في المنظمة العالمية</p>
            </div>
            <div className="text-center space-y-1 pt-2 sm:pt-0">
              <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">CPD-s</span>
              <p className="text-xs text-slate-500 font-medium">منظومة التطوير المهني المستدام</p>
            </div>
            <div className="text-center space-y-1 pt-2 sm:pt-0">
              <span className="text-2xl sm:text-3xl font-black text-navy-900 font-sans">18</span>
              <p className="text-xs text-slate-500 font-medium">محافظة تغطيها نشاطاتنا</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE PILLARS (Clean 3 Cards) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2">
            محاور عمل الجمعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            خدمات مهنية وأكاديمية متكاملة تدعم أطباء الأسرة في كافة محافظات العراق
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: CPD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-medical-600 transition-colors">
                التطوير المهني المستمر (CPD-s)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                برامج تدريبية وورش عمل سريرية معتمدة بساعات تعليم طبي تسهم في الترقية الأكاديمية والمهنية.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                <span>استعراض الدورات المتاحة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Conferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-medical-600 transition-colors">
                المؤتمرات والفعاليات العلمية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                ملتقيات سنوية وندوات متخصصة لمناقشة أحدث بروتوكولات الرعاية الأولية وتبادل الخبرات الطبية.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                <span>جدول المؤتمرات القادمة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Global Representation & Partnerships */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-medical-600 transition-colors">
                التمثيل والشراكات الدولية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                عضوية معتمدة في المنظمة العالمية لأطباء الأسرة (WONCA) لربط الخبرات العراقية بالمعايير السريرية الدولية.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                <span>عن الشراكات والتمثيل</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LATEST NEWS (Modern Editorial Cards) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
              أحدث الأخبار والنشاطات
            </h2>
            <p className="text-xs text-slate-500 mt-1">متابعة مستمرة لفعاليات الجمعية والمستجدات الطبية</p>
          </div>
          <Link 
            to="/news"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-medical-600 hover:text-medical-700 transition-colors"
          >
            <span>كل الأخبار</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={item.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'} 
                    alt={item.title_ar}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.is_pinned && (
                    <span className="absolute top-3 right-3 bg-navy-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      مثبت
                    </span>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(item.published_at || item.created_at).toLocaleDateString('ar-IQ')}
                    </span>
                    <h3 className="font-bold text-navy-900 text-base leading-snug line-clamp-2 group-hover:text-medical-600 transition-colors">
                      <Link to={`/news/${item.slug}`}>{item.title_ar}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.summary_ar}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-50">
                    <Link 
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 group-hover:text-medical-600 transition-colors"
                    >
                      <span>قراءة التفاصيل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. CPD COURSES & UPCOMING EVENTS (Balanced Split) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Courses Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                  دورات التعليم الطبي المستمر (CPD-s)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">ورش تخصصية معتمدة لتطوير الكفاءات السريرية</p>
              </div>
              <Link 
                to="/courses"
                className="text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                المزيد
              </Link>
            </div>

            <div className="space-y-4">
              {courses.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full">
                        {item.metadata?.cpd_hours ? `${item.metadata.cpd_hours} ساعات معتمدة` : 'دورة معتمدة'}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        التسجيل متاح
                      </span>
                    </div>

                    <h3 className="font-bold text-navy-900 text-sm sm:text-base leading-snug">
                      <Link to={`/courses/${item.slug}`} className="hover:text-medical-600 transition-colors">
                        {item.title_ar}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      {item.metadata?.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.metadata.duration}</span>
                        </span>
                      )}
                      {item.metadata?.mode && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.metadata.mode}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/courses/${item.slug}`}
                    className="shrink-0 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
                  >
                    التفاصيل والتسجيل
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Events Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                  المؤتمرات القادمة
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">ملتقيات علمية وطنية ودولية</p>
              </div>
              <Link 
                to="/events"
                className="text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                المزيد
              </Link>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-navy-900 bg-navy-50 px-2.5 py-0.5 rounded-full">
                      مؤتمر علمي
                    </span>
                    <span className="text-xs font-bold text-medical-600">
                      بغداد 2026
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-sm sm:text-base leading-snug">
                    <Link to={`/events/${event.slug}`} className="hover:text-medical-600 transition-colors">
                      {event.title_ar}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {event.summary_ar}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-50">
                    <span className="text-slate-400">
                      {event.metadata?.venue || 'بغداد - جمهورية العراق'}
                    </span>
                    <Link 
                      to={`/events/${event.slug}`}
                      className="font-bold text-medical-600 hover:text-medical-700"
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INSTITUTIONAL COMMUNICATION & HEADQUARTERS BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-10 border border-navy-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3 text-center lg:text-right">
              <span className="text-[11px] font-bold text-medical-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full inline-block">
                الأمانة العامة والتواصل المؤسسي
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white">
                جمعية أطباء الأسرة العراقية — المقر العام في بغداد
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
                نرحب بتواصل كافة الزملاء والكوادر الصحية والمؤسسات الأكاديمية لتنسيق الفعاليات العلمية والمبادرات المهنية المشتركة نحو تطوير الرعاية الصحية الأولية.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>تواصل معنا</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white py-3 px-5 rounded-2xl text-xs font-semibold border border-white/10 transition-colors"
              >
                <span>عن الجمعية وأهدافها</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
