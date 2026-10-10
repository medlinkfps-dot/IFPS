import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Users, 
  Award, 
  Globe, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { getSettings } from '../../lib/db';
import { SiteSetting } from '../../types';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (e) {
        console.error('Error loading settings in AboutPage:', e);
      }
    }
    loadData();

    const handleUpdate = () => {
      loadData();
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
        title="عن الجمعية" 
        description="التعريف الرسمي بجمعية أطباء الأسرة العراقية (IFPS)، الرؤية، الرسالة، الأهداف، والهيكل التنظيمي المعتمد منذ تأسيسها عام 2012."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <ShieldCheck className="w-4 h-4 text-medical-500" />
            <span>المظلة المهنية والعلمية الرسمية منذ 2012</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 leading-tight">
            جمعية أطباء الأسرة العراقية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            تجمع الجمعية نخبة اختصاصيي طب الأسرة في العراق لتطوير ممارسة الرعاية الصحية الأولية والارتقاء بالتعليم الطبي المستمر.
          </p>
        </div>

        {/* Founding & Identity Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-medical-600 uppercase tracking-wider">
                المسيرة المهنية
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 leading-snug">
                شريككم الدائم نحو صحة أفضل.. لأن صحتكم تبدأ قبل المرض
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                تأسست جمعية أطباء الأسرة العراقية عام 2012 كمنظمة مهنية علمية تعنى بتطوير طب الأسرة في العراق، ووضع معايير الممارسة السريرية، ومساندة تطبيق قانون الضمان الصحي الوطني من خلال تفعيل دور مراكز الرعاية الأولية.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-navy-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>تأسست عام 2012</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-navy-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Globe className="w-4 h-4 text-medical-500" />
                  <span>عضوية منظمة WONCA العالمية</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-slate-50 border border-slate-100 p-6 flex flex-col items-center justify-center text-center shadow-xs">
                <img 
                  src="/fps.png" 
                  alt="شعار جمعية أطباء الأسرة العراقية" 
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-3"
                />
                <span className="font-black text-navy-900 text-sm">IFPS IRAQ</span>
                <span className="text-[11px] text-slate-400 font-sans">تأسست عام 2012</span>
              </div>
            </div>

          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vision */}
          <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-navy-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-medical-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              رؤيتنا
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              نظام صحي وطني حديث ومستدام يعتمد على طب الأسرة كحجر زاوية وخط دفاع أول، يضمن تقديم رعاية وقائية وعلاجية شاملة ومستمرة لكل مواطن وعائلة في العراق.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-navy-900">
              رسالتنا
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-normal">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-500 shrink-0 mt-0.5" />
                <span><strong>الرعاية الوقائية المتكاملة:</strong> تقديم خدمات الرعاية الشاملة لجميع الفئات العمرية.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-500 shrink-0 mt-0.5" />
                <span><strong>التعليم المستمر (CPD-s):</strong> تمكين أطباء الأسرة بأحدث المهارات السريرية والبروتوكولات العالمية.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-500 shrink-0 mt-0.5" />
                <span><strong>دعم الضمان الصحي:</strong> المساهمة الفاعلة في إنجاح تطبيق قانون الضمان الصحي في العراق.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* President's Word */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                IFPS
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-navy-900">
                  كلمة رئيس الجمعية
                </h3>
                <p className="text-xs text-medical-600 font-medium">
                  {settings['president_name']?.value_ar || 'الطبيب الاستشاري  أ.م.د. منتظر سعد جابر'} — {settings['president_title']?.value_ar || 'رئيس الجمعية'}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2.5 pt-2 border-t border-slate-50 font-normal">
              <p>
                "يسعدني أن أرحب بكم في الموقع الرسمي لجمعية أطباء الأسرة العراقية. يقف العراق اليوم أمام مرحلة مفصلية مع تطبيق قانون الضمان الصحي الوطني، والذي يعتمد بصورة أساسية على طبيب الأسرة كنقطة ارتكاز أولى."
              </p>
              <p>
                "هدفنا هو الانتقال من ثقافة انتظار المرض إلى ثقافة الوقاية والرعاية المستدامة، مع توفير كل سبل التدريب والتمكين لزملائنا الأطباء في كافة المحافظات."
              </p>
            </div>
          </div>
        </div>

        {/* Scientific & Organizational Structure */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-navy-900 mb-1">
              اللجان العلمية والتنظيمية
            </h2>
            <p className="text-xs text-slate-500">منظومة عمل تشاركية لإدارة أنشطة الجمعية وبرامجها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
              <Award className="w-8 h-8 text-medical-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">اللجنة العلمية العليا</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                اعتماد المناهج، احتساب ساعات منظومة CPD-s، والتنسيق العلمي مع المجالس التخصصية.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
              <Users className="w-8 h-8 text-navy-900 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">لجنة المؤتمرات والتدريب</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                تنظيم المؤتمر السنوي الوطني، والورش السريرية الحضورية والافتراضية.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
              <Globe className="w-8 h-8 text-medical-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">لجنة العلاقات الدولية</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                تمثيل العراق في WONCA World وتطوير الشراكات العلمية والأكاديمية.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
