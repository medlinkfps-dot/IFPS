import React from 'react';
import { Link } from 'react-router-dom';
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

export const Footer: React.FC = () => {
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
                  src="/fps.png" 
                  alt="شعار جمعية أطباء الأسرة العراقية" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-snug">
                  جمعية أطباء الأسرة العراقية
                </h3>
                <p className="text-[11px] text-medical-300 font-sans tracking-wide">
                  Iraqi Family Physicians Society • IFPS
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
                <Link to="/opportunities" className="hover:text-white transition-colors">الدراسات العليا والزمالات</Link>
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
                <a href="mailto:info@iraqifps.org" className="hover:text-white transition-colors">
                  info@iraqifps.org
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-medical-400 shrink-0" />
                <span>المقر العام: بغداد، جمهورية العراق</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://facebook.com/iraqi.fps"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-medical-600 text-slate-300 hover:text-white transition-colors"
                aria-label="فيسبوك"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/iraqi.fps"
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
          <p>© {new Date().getFullYear()} جمعية أطباء الأسرة العراقية (IFPS). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">من نحن</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-400">اتصل بنا</Link>
            <span>•</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-medical-400">دخول الإدارة</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
