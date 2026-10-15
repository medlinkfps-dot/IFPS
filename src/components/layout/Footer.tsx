import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Facebook, 
  Instagram, 
  ExternalLink,
  Award,
  FileDown
} from 'lucide-react';
import { getSettings, getInitialSettingsSnapshot } from '../../lib/db';
import { SiteSetting } from '../../types';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, SiteSetting>>(() => getInitialSettingsSnapshot());

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (e) {
        console.error('Error loading settings in footer:', e);
      }
    }
    loadSettings();

    const handleUpdate = () => {
      loadSettings();
    };
    window.addEventListener('ifps_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ifps_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleAdminAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = window.prompt("الرجاء إدخال الرمز الأمني للولوج:");
    if (code === "218721") {
      navigate('/admin/login');
    } else if (code !== null) {
      alert("الرمز غير صحيح!");
    }
  };

  const siteName = settings['site_name']?.value_ar || 'جمعية أطباء الأسرة العراقية';
  const siteNameEn = settings['site_name']?.value_en || 'Iraqi Family Physicians Society • IFPS';
  const logoUrl = settings['official_logo_url']?.value_ar || '/fps.png';
  const email = settings['official_email']?.value_ar || 'info@iraqifps.org';
  const address = settings['headquarters_city']?.value_ar || 'العراق - بغداد - مجمع النقابات - مجاور نقابة اطباء العراق';
  
  const rawFb = settings['facebook_handle']?.value_ar || 'iraqi.fps';
  const fbUrl = rawFb.startsWith('http') ? rawFb : `https://facebook.com/${rawFb}`;
  
  const rawInsta = settings['instagram_handle']?.value_ar || 'iraqi.fps';
  const instaUrl = rawInsta.startsWith('http') ? rawInsta : `https://instagram.com/${rawInsta}`;

  return (
    <footer className="bg-navy-950 text-slate-300 pt-14 pb-10 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-navy-900">
          
          {/* Col 1: Society Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-snug">
                  {siteName}
                </h3>
                <p className="text-[11px] text-medical-300 font-sans tracking-wide">
                  {siteNameEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              المظلة المهنية والعلمية لاختصاصيي طب الأسرة في العراق. نعمل على تعزيز التدريب السريري، مأسسة الرعاية الأولية، والتمثيل الدولي في منظمة WONCA.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-medical-400" />
              <span>تأسست رسمياً في العراق عام 2012</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-medical-300">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">عن الجمعية والقيادة</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">الأخبار والمستجدات</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">دورات التعليم الطبي CPD-s</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">المؤتمرات العلمية</Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">الوثائق والاستمارات (PDF)</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider text-medical-300">
              المنصات وقنوات التواصل
            </h4>

            <div className="space-y-2 text-xs">
              <Link 
                to="/documents" 
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
              >
                <span>مكتبة الوثائق وتحميل الملفات (PDF)</span>
                <FileDown className="w-3.5 h-3.5 text-medical-400" />
              </Link>

              <div className="flex items-center gap-2 text-slate-400 pt-1">
                <Mail className="w-3.5 h-3.5 text-medical-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-medical-400 shrink-0" />
                <span>{address}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-medical-600 text-slate-300 hover:text-white transition-colors"
                aria-label="فيسبوك"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-medical-600 text-slate-300 hover:text-white transition-colors"
                aria-label="إنستغرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteName}. جميع الحقوق{' '}
            <span 
              onClick={handleAdminAccess}
              className="text-inherit hover:text-inherit focus:outline-none cursor-default select-none ml-1"
              tabIndex={-1}
            >
              محفوظة
            </span>.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">من نحن</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-400">اتصل بنا</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
