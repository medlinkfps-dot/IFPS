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
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-navy-800/80">
          {/* Column 1: Society Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                <img 
                  src="https://iraqifps.org/wp-content/uploads/2025/11/photo_2025-11-14_19-45-19.jpg" 
                  alt="شعار الجمعية" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-snug">
                  جمعية أطباء الأسرة العراقية
                </h3>
                <p className="text-xs text-medical-300 font-sans">
                  Iraqi Family Physicians Society (IFPS)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              المظلة المهنية والعلمية الرسمية لأطباء وطبيبات الأسرة في العراق. نعمل على مأسسة الرعاية الصحية الأولية والارتقاء بالتدريب والتعليم الطبي المستمر.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-iraqiGold-300">
              <ShieldCheck className="w-4 h-4 text-iraqiGold-400" />
              <span>تأسست رسمياً عام 2012</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              أقسام الموقع
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-medical-300 transition-colors">عن الجمعية والهيكل التنظيمي</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-medical-300 transition-colors">أحدث الأخبار والإعلانات</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-medical-300 transition-colors">المؤتمرات والفعاليات العلمية</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-medical-300 transition-colors">منظومة التطوير المهني CPD-s</Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-medical-300 transition-colors">الدراسات العليا وامتحانات البورد</Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-medical-300 transition-colors">إصدار وتجديد هويات الجمعية</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: International Affiliations & Resources */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              الشراكات والروابط الرسمية
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a 
                  href="https://id.iraqifps.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:text-medical-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>بوابة الهويات الإلكترونية (id.iraqifps.org)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.globalfamilydoctor.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:text-medical-300 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>المنظمة العالمية لأطباء الأسرة (WONCA World)</span>
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>المجلس العربي للاختصاصات الصحية</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>المجلس العراقي للاختصاصات الطبية</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              التواصل الرسمي
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-medical-400 shrink-0 mt-0.5" />
                <span>المقر العام: بغداد - جمهورية العراق</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-medical-400 shrink-0" />
                <a href="mailto:info@iraqifps.org" className="hover:text-white transition-colors">
                  info@iraqifps.org
                </a>
              </div>
            </div>

            <div className="mt-5">
              <span className="block text-[11px] text-slate-400 mb-2 font-medium">حسابات التواصل الاجتماعي:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com/iraqi.fps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-medical-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="صفحة الفيسبوك الرسمية"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/iraqi.fps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-medical-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="حساب الإنستغرام الرسمي"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} جمعية أطباء الأسرة العراقية (IFPS).</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/about" className="hover:text-slate-300">من نحن</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">سياسة الخصوصية والاستخدام</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-medical-400">بوابة الإدارة</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
