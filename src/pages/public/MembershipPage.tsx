import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  FileText, 
  Search, 
  AlertCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { getSettings } from '../../lib/db';
import { SiteSetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

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

    // Direct user safely to the official verification portal without leaking private DB data
    setVerifyResult({
      message: `للتحقق الموثق والمعتمد من رقم الهوية "${verifyIdInput.trim()}"، يتم التوجيه إلى البوابة الإلكترونية المركزية id.iraqifps.org لحماية خصوصية بيانات الأعضاء.`,
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
      a: '1. وثيقة أو كتاب تأييد الاختصاص في طب الأسرة، 2. هوية نقابة أطباء العراق نافذة المفعول، 3. صورة شخصية حديثة بخلفية بيضاء، 4. ملء استمارة المعلومات الرسمية عبر منصة الهويات الإلكترونية.',
    },
    {
      q: 'كيف يتم تجديد هوية الجمعية المنتهية الصلاحية؟',
      a: 'يتم التجديد إلكترونياً بالكامل من خلال الدخول إلى بوابة الهويات (id.iraqifps.org)، اختيار "تجديد هوية الجمعية"، وتحديث البيانات الشخصية ومكان العمل وإرفاق وصل التجديد السنوي.',
    },
    {
      q: 'ما هي الامتيازات التي يحصل عليها حامل هوية IFPS؟',
      a: 'الحصول على التمثيل المهني الرسمي، المشاركة المجانية أو بخصومات تفضيلية في مؤتمرات الجمعية ومنظمة WONCA العالمية، احتساب ساعات التعليم الطبي المستمر CPD-s، والاشتراك في اللجان العلمية والبحثية.',
    },
    {
      q: 'ما هي مدة صلاحية هوية الجمعية؟',
      a: 'تصدر الهوية بصلاحية سنتين تقويميتين، ويتم إشعار العضو عبر البريد الإلكتروني أو الرسائل النصية قبل شهرين من انتهاء صلاحيتها لتسهيل إجراءات التجديد المبكر.',
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <SEO 
        title="العضوية والهويات المهنية" 
        description="دليل الانتساب، تجديد هويات جمعية أطباء الأسرة العراقية، والتحقق الرقمي عبر البوابة المعتمدة id.iraqifps.org."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" size="md" className="mb-3">
            الخدمات المهنية للأعضاء
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            العضوية المهنية وإصدار وتجديد الهويات
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            تعتبر هوية جمعية أطباء الأسرة العراقية وثيقة الاعتماد المهني الرسمية التي تجمع اختصاصيي طب الأسرة، وتمنحهم الأولوية في برامج التطوير والمؤتمرات والتمثيل الدولي.
          </p>
        </div>

        {/* Official Portal Direct Access Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl border border-navy-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-900/60 border border-medical-700/60 text-medical-300 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>المنظومة الإلكترونية المركزية للهويات</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                بوابة إصدار وتجديد الهويات (id.iraqifps.org)
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-light">
                نظام رقمي موحد ومستقل مخصص لإدارة سجلات أعضاء جمعية أطباء الأسرة العراقية، يتيح تقديم طلب هوية جديدة، تجديد الهوية المنتهية، ومتابعة حالة الطلب إلكترونياً.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={idSystemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 bg-medical-500 hover:bg-medical-600 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>الدخول لمنصة الهويات الرسمية</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={`${idSystemUrl}/renew`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white font-semibold rounded-xl text-sm border border-navy-700 transition-colors"
                >
                  تجديد هوية موجودة مباشرة
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-64 bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 mx-auto flex items-center justify-center shadow">
                  <img 
                    src="https://iraqifps.org/wp-content/uploads/2025/11/photo_2025-11-14_19-45-19.jpg" 
                    alt="ختم الجمعية" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">هوية معتمدة رسمياً</h4>
                  <p className="text-[11px] text-slate-400">تحتوي على QR Code ذكي للتحقق الفوري</p>
                </div>
                <div className="text-[11px] text-medical-300 bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                  صالحة لجميع المعاملات المهنية الرسمية
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">
            مزايا وفوائد العضوية في جمعية أطباء الأسرة العراقية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">المظلة القانونية والمهنية</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تمثيل حقوق أطباء الأسرة أمام وزارة الصحة والمؤسسات الرسمية، والدفاع عن استحقاقات الاختصاص في تطبيق قانون الضمان الصحي.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">منظومة التطوير المهني CPD-s</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                أولوية التسجيل وحسومات خاصة على ورش العمل والدورات التخصصية المعتمدة بساعات تعليم طبي مستمر تؤهلك للترقيات الأكاديمية.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">التمثيل الدولي في WONCA</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ربط أطباء الأسرة العراقيين بالشبكة الدولية للمنظمة العالمية لأطباء الأسرة والمشاركة في المؤتمرات الإقليمية والعالمية.
              </p>
            </Card>
          </div>
        </div>

        {/* ID Verification Portal Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft mb-16 max-w-3xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-navy-900">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-1">التحقق من صحة وصلاحية الهوية</h3>
            <p className="text-xs text-slate-500">أدخل رقم الهوية للتحقق عبر البوابة الرسمية الآمنة لمنع التزوير وحماية بيانات الأعضاء.</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={verifyIdInput}
                onChange={(e) => setVerifyIdInput(e.target.value)}
                placeholder="أدخل رقم الهوية (مثال: IFPS-2026-XXXX)"
                className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-center sm:text-right"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-sm transition-colors shrink-0"
              >
                التحقق الآن
              </button>
            </div>

            {verifyResult && (
              <div className="p-4 rounded-xl bg-medical-50 border border-medical-200 text-xs text-medical-900 flex items-start gap-3 mt-4">
                <AlertCircle className="w-5 h-5 text-medical-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p>{verifyResult.message}</p>
                  <a
                    href={`${idSystemUrl}?verify=${encodeURIComponent(verifyIdInput.trim())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-medical-700 underline text-xs"
                  >
                    <span>متابعة التحقق في بوابة الهويات المركزية</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1.5 text-medical-600 text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>الأسئلة الأكثر شيوعاً</span>
            </div>
            <h2 className="text-2xl font-bold text-navy-900">
              إرشادات واستفسارات العضوية
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-navy-900 hover:text-medical-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-medical-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
