import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  Globe, 
  Mail, 
  MapPin, 
  CreditCard, 
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { getSettings, updateSetting } from '../../lib/db';
import { SiteSetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ImageUploadField } from '../../components/common/ImageUploadField';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [siteName, setSiteName] = useState('');
  const [siteNameEn, setSiteNameEn] = useState('');
  const [tagline, setTagline] = useState('');
  const [presidentName, setPresidentName] = useState('');
  const [presidentNameEn, setPresidentNameEn] = useState('');
  const [presidentTitle, setPresidentTitle] = useState('');
  const [presidentQuote, setPresidentQuote] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [idUrl, setIdUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [emblemUrl, setEmblemUrl] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSettings();
        setSettings(data);
        setSiteName(data['site_name']?.value_ar || 'جمعية أطباء الأسرة العراقية');
        setSiteNameEn(data['site_name']?.value_en || 'Iraqi Family Physicians Society');
        setTagline(data['site_tagline']?.value_ar || '');
        setPresidentName(data['president_name']?.value_ar || 'الطبيب الاستشاري  أ.م.د. منتظر سعد جابر');
        setPresidentNameEn(data['president_name']?.value_en || 'Consultant Dr. Muntadhar Saad Jaber');
        setPresidentTitle(data['president_title']?.value_ar || 'رئيس الجمعية');
        setPresidentQuote(data['president_quote']?.value_ar || 'طبيب الأسرة هو خط الدفاع الأول والشريك الدائم لصحة الفرد والعائلة في كل مراحل الحياة.');
        setEmail(data['official_email']?.value_ar || 'info@iraqifps.org');
        setCity(data['headquarters_city']?.value_ar || 'بغداد - جمهورية العراق');
        setFacebook(data['facebook_handle']?.value_ar || 'iraqi.fps');
        setInstagram(data['instagram_handle']?.value_ar || 'iraqi.fps');
        setIdUrl(data['id_system_url']?.value_ar || 'https://id.iraqifps.org');
        setLogoUrl(data['official_logo_url']?.value_ar || '');
        setEmblemUrl(data['official_emblem_url']?.value_ar || '');
      } catch (e) {
        console.error('Error loading settings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        updateSetting('site_name', siteName, siteNameEn),
        updateSetting('site_tagline', tagline),
        updateSetting('president_name', presidentName, presidentNameEn),
        updateSetting('president_title', presidentTitle),
        updateSetting('president_quote', presidentQuote),
        updateSetting('official_email', email),
        updateSetting('headquarters_city', city),
        updateSetting('facebook_handle', facebook),
        updateSetting('instagram_handle', instagram),
        updateSetting('id_system_url', idUrl),
        updateSetting('official_logo_url', logoUrl),
        updateSetting('official_emblem_url', emblemUrl),
      ]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      console.error('Error saving settings:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="جارِ تحميل إعدادات الموقع..." />;
  }

  return (
    <div className="space-y-6">
      <SEO title="إعدادات الموقع المؤسسي | IFPS CMS" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">إعدادات الموقع والهوية الرسمية</h1>
          <p className="text-xs text-slate-500">
            تحديث معلومات الجمعية، رئاسة الجمعية، روابط منصة الهويات، وسائل التواصل، والأختام المعتمدة
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          title="تطبيق جميع الإعدادات فوراً على الموقع مباشرة"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{saving ? 'جارِ التطبيق على الموقع...' : 'تطبيق التعديلات على الموقع'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p>تم تطبيق وحفظ التعديلات على الموقع مباشرة بنجاح!</p>
            <p className="text-xs font-normal text-emerald-700 mt-0.5">
              انعكست جميع البيانات المحدثة تلقائياً عبر صفحات الموقع دون الحاجة لأي برمجة أو إجراءات فنية.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. General Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
            معلومات الهوية الرسمية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                اسم الجمعية الرسمي (بالعربية)
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الاسم باللغة الإنجليزية
              </label>
              <input
                type="text"
                value={siteNameEn}
                onChange={(e) => setSiteNameEn(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              شعار ورؤية الجمعية (Tagline)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Society Leadership & President */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-medical-600" />
            <span>رئاسة الجمعية والقيادة الرسمية</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                اسم رئيس الجمعية واللقب العلمي (بالعربية)
              </label>
              <input
                type="text"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                placeholder="الطبيب الاستشاري  أ.م.د. منتظر سعد جابر"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الاسم باللغة الإنجليزية
              </label>
              <input
                type="text"
                value={presidentNameEn}
                onChange={(e) => setPresidentNameEn(e.target.value)}
                placeholder="Consultant Dr. Muntadhar Saad Jaber"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الصفة والمسمى الوظيفي
              </label>
              <input
                type="text"
                value={presidentTitle}
                onChange={(e) => setPresidentTitle(e.target.value)}
                placeholder="رئيس الجمعية"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                اقتباس أو كلمة رئيس الجمعية في الواجهة الرئيسية
              </label>
              <textarea
                rows={2}
                value={presidentQuote}
                onChange={(e) => setPresidentQuote(e.target.value)}
                placeholder="طبيب الأسرة هو خط الدفاع الأول والشريك الدائم لصحة الفرد والعائلة في كل مراحل الحياة."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 2. Official Links & Portals */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-medical-600" />
            <span>بوابة الهويات والخدمات الرقمية</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              رابط نظام الهويات الإلكتروني (id.iraqifps.org)
            </label>
            <input
              type="url"
              value={idUrl}
              onChange={(e) => setIdUrl(e.target.value)}
              placeholder="https://id.iraqifps.org"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-left"
              dir="ltr"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              يتم توجيه جميع أزرار طلب وتجديد الهويات والتحقق إلى هذا الرابط المعتمد.
            </p>
          </div>
        </div>

        {/* 3. Contact & Location */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-medical-600" />
            <span>بيانات الاتصال والتواصل الاجتماعي</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                البريد الإلكتروني المعتمد
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                المقر الرسمي
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                معرف فيسبوك (Facebook)
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="iraqi.fps"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                معرف إنستغرام (Instagram)
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="iraqi.fps"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* 4. Logos and Assets */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
            الشعارات والأختام الرسمية المعتمدة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUploadField
              value={logoUrl}
              onChange={(url) => setLogoUrl(url)}
              label="الشعار الشفاف (الترويسة الرئيسية)"
              description="الشعار الرسمي للجمعية الذي يظهر في شريط التنقل العلوي والفوتر."
              aspectRatio="square"
            />

            <ImageUploadField
              value={emblemUrl}
              onChange={(url) => setEmblemUrl(url)}
              label="الشعار الدائري (الختم الرسمي)"
              description="الختم الدائري المعتمد المستخدم في الشهادات والوثائق الرسمية."
              aspectRatio="square"
            />
          </div>
        </div>

        {/* 5. Instant Live Publishing System Card */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-navy-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-bold text-white">نظام النشر والتطبيق الفوري المباشر (Instant Live Apply)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            عند الضغط على <strong className="text-emerald-400 font-bold">"تطبيق التعديلات على الموقع"</strong>، يتم تحديث بيانات الموقع وهوية الجمعية فوراً وبشكل تلقائي، وتظهر التعديلات مباشرة أمام زوار الموقع دون الحاجة لأي تدخّل برمجي أو إعادة بناء.
          </p>
        </div>

        {/* Bottom Apply Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>سيتم تطبيق جميع التعديلات المحفوظة فوراً على الموقع الحي.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{saving ? 'جارِ التطبيق على الموقع...' : 'تطبيق التعديلات على الموقع'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
