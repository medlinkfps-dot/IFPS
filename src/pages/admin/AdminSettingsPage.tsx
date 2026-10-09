import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Globe, Mail, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { getSettings, updateSetting } from '../../lib/db';
import { SiteSetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [siteName, setSiteName] = useState('');
  const [siteNameEn, setSiteNameEn] = useState('');
  const [tagline, setTagline] = useState('');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        updateSetting('site_name', siteName, siteNameEn),
        updateSetting('site_tagline', tagline),
        updateSetting('official_email', email),
        updateSetting('headquarters_city', city),
        updateSetting('facebook_handle', facebook),
        updateSetting('instagram_handle', instagram),
        updateSetting('id_system_url', idUrl),
        updateSetting('official_logo_url', logoUrl),
        updateSetting('official_emblem_url', emblemUrl),
      ]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
            تحديث معلومات الجمعية، روابط منصة الهويات، وسائل التواصل، وبيانات الاتصال المعتمدة
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'جارِ الحفظ...' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ الإعدادات المؤسسية بنجاح!</span>
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
            روابط الشعارات المعتمدة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                رابط الشعار الشفاف (الترويسة)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                رابط الشعار الدائري (الختم الرسمي)
              </label>
              <input
                type="url"
                value={emblemUrl}
                onChange={(e) => setEmblemUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
