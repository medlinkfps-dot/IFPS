import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Users, 
  Award, 
  Globe, 
  HeartHandshake, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="عن جمعية أطباء الأسرة العراقية" 
        description="التعريف الرسمي بجمعية أطباء الأسرة العراقية (IFPS)، الرؤية، الرسالة، الأهداف، والهيكل التنظيمي المعتمد منذ تأسيسها عام 2012."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            المظلة المهنية والعلمية الرسمية
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 mb-4">
            جمعية أطباء الأسرة العراقية (IFPS)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            نحن جمعية أطباء الأسرة العراقية؛ المظلة المهنية الرسمية التي تضم نُخبة أطباء وطبيبات الأسرة في العراق، والذين نذروا عِلمهم وخبرتهم لخدمة الفرد والعائلة كوحدة واحدة.
          </p>
          <p className="text-base sm:text-lg font-bold text-medical-600 mt-2">
            "نحن لا ننتظر المرض لنعالجه، بل نعمل لنحميك منه أولاً."
          </p>
        </div>

        {/* Founding & Identity Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-soft mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-iraqiGold-600 uppercase tracking-widest">تاريخ التأسيس والمسيرة</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">
                مسيرة متواصلة في خدمة صحة المجتمع العراقي منذ 2012
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تأسست جمعية أطباء الأسرة العراقية عام 2012 لتكون الركيزة الأساسية لتنظيم مهنة طب الأسرة في العراق، ووضع المعايير الأخلاقية والمهنية للممارسة الطبية في القطاعين العام والخاص، والعمل كشريك استراتيجي لوزارة الصحة والمؤسسات الأكاديمية لوضع السياسات الصحية الداعمة للرعاية الأولية.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-semibold text-navy-900">
                  <ShieldCheck className="w-4 h-4 text-medical-600" />
                  <span>تأسست رسمياً عام 2012</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-navy-900">
                  <Globe className="w-4 h-4 text-medical-600" />
                  <span>عضوية ومشاركة فاعلة في منظمة WONCA العالمية</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-56 h-56 rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-inner">
                <img 
                  src="https://iraqifps.org/wp-content/uploads/2025/11/photo_2025-11-14_19-45-19.jpg" 
                  alt="شعار الجمعية" 
                  className="w-24 h-24 object-contain rounded-2xl mb-3 shadow"
                />
                <span className="font-bold text-navy-900 text-sm">IFPS IRAQ</span>
                <span className="text-[11px] text-slate-500">منذ عام 2012</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy-800">
            <div className="w-12 h-12 rounded-2xl bg-medical-500/20 border border-medical-500/30 flex items-center justify-center text-medical-300 mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              رؤيتنا: شريككم الدائم نحو صحة أفضل
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              نؤمن بأن الرعاية الصحية الحقيقية تبدأ من الوقاية والتثقيف، وليس فقط من وصف الدواء. طبيب الأسرة هو «حجر الزاوية» في النظام الصحي الحديث، وهو الشريك الموثوق الذي يرافق الفرد والعائلة في جميع مراحل حياتهم الصحية؛ بدءاً من الكشف المبكر، مروراً بالعلاج، وانتهاءً بالمتابعة المستمرة.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-navy-900 mb-4">
              رسالتنا المؤسسية
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <span><strong>الرعاية الشاملة:</strong> تقديم خدمة صحية متكاملة لجميع أفراد الأسرة، من الطفل إلى كبير السن.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <span><strong>خط الدفاع الأول:</strong> أن نكون وجهتكم الأولى والموثوقة لأي استشارة صحية، وتوجيهكم نحو الاختصاص الصحيح عند الحاجة.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <span><strong>بناء المستقبل:</strong> المساهمة الفعالة في بناء نظام الضمان الصحي الوطني، وضمان حصول كل مواطن على رعاية عالية الجودة.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
                <span><strong>التطوير المستمر:</strong> تنظيم مهنة طب الأسرة والارتقاء بها عبر منظومة التعليم الطبي المستمر CPD-s.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* President's Address Card */}
        <div className="bg-slate-100/80 rounded-3xl p-8 sm:p-12 border border-slate-200 mb-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-base">
                IFPS
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">كلمة رئيس جمعية أطباء الأسرة العراقية</h3>
                <p className="text-xs text-medical-700 font-medium">الطبيب الاستشاري د. منتظر سعد</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <p>
                "يسعدني أن أرحب بكم، زملائي الأطباء وزوارنا الكرام، في الموقع الرسمي لجمعية أطباء الأسرة العراقية.
              </p>
              <p>
                يقف العراق اليوم على أعتاب تحول تاريخي مع البدء بتطبيق قانون الضمان الصحي. ويلعب طب الأسرة الدور المحوري والأساسي في إنجاح هذا المشروع الوطني. فمن خلال تسجيل المواطنين لدى طبيب أسرة محدد، ننتقل من ثقافة «العلاج» إلى ثقافة «الوقاية»، وهو الهدف الأسمى الذي نعمل من أجله.
              </p>
              <p>
                إن هدفنا واضح: الانتقال من نظام صحي قائم على المستشفيات إلى نظام حديث قائم على مراكز الرعاية الصحية الأولية وطبيب الأسرة. أدعو جميع زملائي للالتفاف حول جمعيتهم لنبني معاً عراقاً أكثر صحة."
              </p>
            </div>
          </div>
        </div>

        {/* Committees and Organizational Structure */}
        <div>
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">
            اللجان العلمية والتنظيمية في الجمعية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Award className="w-8 h-8 text-medical-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">اللجنة العلمية العليا</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                الإشراف على إعداد المناهج التدريبية، اعتماد ساعات منظومة CPD-s، والتنسيق العلمي مع المجلس العربي والعراقي للاختصاصات الطبية.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="w-8 h-8 text-navy-800 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">لجنة المؤتمرات والتعليم الطبي</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تنظيم المؤتمر السنوي الوطني لطب الأسرة، وعقد الندوات التخصصية الافتراضية والحضورية في عموم المحافظات العراقية.
              </p>
            </Card>

            <Card className="p-6">
              <Globe className="w-8 h-8 text-iraqiGold-600 mb-3" />
              <h3 className="font-bold text-navy-900 text-base mb-1">لجنة العلاقات والتعاون الدولي</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تمثيل العراق في المنظمة العالمية لأطباء الأسرة (WONCA)، وتطوير الشراكات العلمية مع الجمعيات الإقليمية والدولية.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
