import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown, 
  Search, 
  AlertCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { getSettings } from '../../lib/db';
import { SiteSetting } from '../../types';
import { SEO } from '../../components/common/SEO';

export const MembershipPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ message: string; type: 'info' | 'warning' } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const setts = await getSettings();
      setSettings(setts);
    }
    loadSettings();
  }, []);

  const idSystemUrl = settings['id_system_url']?.value_ar || 'https://id.iraqifps.org';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;

    setVerifyResult({
      message: `للتحقق المعتمد من رقم الهوية "${verifyIdInput.trim()}"، يتم التوجيه إلى البوابة الإلكترونية المركزية id.iraqifps.org لحماية خصوصية بيانات الأعضاء.`,
      type: 'info',
    });
  };

  const faqs = [
    {
      q: 'من يحق له الانتساب لجمعية أطباء الأسرة العراقية؟',
      a: 'يحق الانتساب لجميع الأطباء العراقيين من حملة شهادات الاختصاص في طب الأسرة (البورد العراقي، البورد العربي، الدبلوم العالي أو ما يعادلها)، بالإضافة إلى الأطباء المقيمين الأقدم وطلبة الدراسات العليا في مراكز التدريب المعتمدة.',
    },
    {
      q: 'ما هي المستمسكات والوثائق المطلوبة لإصدار الهوية الجديدة؟',
      a: '1. وثيقة أو كتاب تأييد الاختصاص في طب الأسرة، 2. هوية نقابة أطباء العراق نافذة المفعول، 3. صورة شخصية حديثة بخلفية بيضاء، 4. استمارة المعلومات الرسمية عبر منصة الهويات الإلكترونية.',
    },
    {
      q: 'كيف يتم تجديد هوية الجمعية المنتهية الصلاحية؟',
      a: 'يتم التجديد إلكترونياً بالكامل من خلال الدخول إلى بوابة الهويات (id.iraqifps.org)، اختيار "تجديد هوية الجمعية"، وتحديث البيانات ومكان العمل وإرفاق وصل التجديد السنوي.',
    },
    {
      q: 'ما هي الامتيازات التي يحصل عليها حامل هوية IFPS؟',
      a: 'الحصول على التمثيل المهني الرسمي، المشاركة المجانية أو بخصومات تفضيلية في مؤتمرات الجمعية ومنظمة WONCA العالمية، احتساب ساعات التعليم الطبي المستمر CPD-s، والاشتراك في اللجان العلمية والبحثية.',
    },
    {
      q: 'ما هي مدة صلاحية هوية الجمعية؟',
      a: 'تصدر الهوية بصلاحية سنتين تقويميتين، مع إشعار مسبق عبر البريد الإلكتروني لتسهيل التجديد الإلكتروني المبكر.',
    },
  ];

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="العضوية والهويات المهنية" 
        description="دليل الانتساب، تجديد هويات جمعية أطباء الأسرة العراقية، والتحقق الرقمي عبر البوابة المعتمدة id.iraqifps.org."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <CreditCard className="w-4 h-4 text-medical-500" />
            <span>الخدمات الإلكترونية للأعضاء</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 leading-tight">
            العضوية وإصدار وتجديد الهويات
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            وثيقة الاعتماد المهني الرسمية التي تجمع اختصاصيي طب الأسرة في العراق، وتتيح الاستفادة من برامج التطوير والمؤتمرات والتمثيل الدولي.
          </p>
        </div>

        {/* Official Portal Access Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-12 border border-navy-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-center lg:text-right">
              <span className="text-[11px] font-bold text-medical-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full inline-block">
                المنظومة الرقمية المركزية
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                بوابة الهويات الرسمية (id.iraqifps.org)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                منصة رقمية موحدة لإدارة سجلات أعضاء جمعية أطباء الأسرة العراقية، إصدار الهويات الجديدة الذكية، وتجديد العضوية إلكترونياً.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href={idSystemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>الدخول لمنصة الهويات الرسمية</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={`${idSystemUrl}/renew`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl text-xs sm:text-sm border border-white/10 transition-colors"
                >
                  تجديد هوية نافذة
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-56 bg-navy-900 border border-navy-700/80 rounded-3xl p-6 text-center space-y-3 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 mx-auto flex items-center justify-center shadow">
                  <img 
                    src="/fps.png" 
                    alt="ختم الجمعية" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">هوية رقمية معتمدة</h4>
                  <p className="text-[11px] text-slate-400">مزودة بـ QR Code للتحقق الفوري</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-navy-900 text-center">
            مزايا العضوية في الجمعية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">المظلة المهنية والتمثيل</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                تمثيل حقوق أطباء الأسرة أمام وزارة الصحة والمؤسسات الرسمية ودعم تطبيق قانون الضمان الصحي.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">منظومة التطوير CPD-s</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                أولوية المشاركة وحسومات تفضيلية على الورش المعتمدة بساعات تعليم طبي مستمر تؤهلك للترقيات.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">التمثيل الدولي في WONCA</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                ربط أطباء الأسرة العراقيين بالشبكة العالمية لمنظمة WONCA والمشاركة في المؤتمرات الدولية.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-navy-900">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-navy-900">
              التحقق من صحة الهوية
            </h3>
            <p className="text-xs text-slate-500">
              أدخل رقم الهوية للتحقق عبر البوابة المركزية الرسمية الآمنة
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={verifyIdInput}
                onChange={(e) => setVerifyIdInput(e.target.value)}
                placeholder="أدخل رقم الهوية (مثال: IFPS-2026-XXXX)"
                className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-center sm:text-right font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors shrink-0"
              >
                التحقق الآن
              </button>
            </div>

            {verifyResult && (
              <div className="p-4 rounded-2xl bg-medical-50 border border-medical-200 text-xs text-medical-900 flex items-start gap-3 mt-3">
                <AlertCircle className="w-5 h-5 text-medical-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <p>{verifyResult.message}</p>
                  <a
                    href={`${idSystemUrl}?verify=${encodeURIComponent(verifyIdInput.trim())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-medical-700 underline text-xs"
                  >
                    <span>متابعة التحقق في منصة id.iraqifps.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-navy-900 mb-1">
              الأسئلة الشائعة حول العضوية
            </h2>
            <p className="text-xs text-slate-500">إرشادات التقديم، التجديد، والمستمسكات الرسمية</p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-navy-900 hover:text-medical-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-medical-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
