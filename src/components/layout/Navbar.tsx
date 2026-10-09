import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  LogIn, 
  LayoutDashboard
} from 'lucide-react';
import { getNavigationItems, getSettings } from '../../lib/db';
import { NavigationItem, SiteSetting } from '../../types';
import { useAuth } from '../../lib/auth';

export const Navbar: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    async function loadNavData() {
      try {
        const [items, setts] = await Promise.all([
          getNavigationItems(),
          getSettings(),
        ]);
        setNavItems(items);
        setSettings(setts);
      } catch (err) {
        console.error('Error loading navigation data:', err);
      }
    }
    loadNavData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const logoUrl = settings['official_logo_url']?.value_ar || '/fps.png';
  const idSystemUrl = settings['id_system_url']?.value_ar || 'https://id.iraqifps.org';

  return (
    <>
      {/* Top Banner Bar for Institutional Identity */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-medical-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>المظلة المهنية والعلمية الرسمية لأطباء الأسرة في العراق (تأسست 2012)</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:inline-block text-slate-400">عضوية ومشاركة فاعلة في منظمة WONCA العالمية</span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="mailto:info@iraqifps.org" 
              className="hidden sm:inline-block text-slate-300 hover:text-white transition-colors"
            >
              info@iraqifps.org
            </a>
            {user ? (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-1 bg-medical-600/30 hover:bg-medical-600/50 text-medical-200 px-2.5 py-1 rounded text-xs transition-colors border border-medical-500/30"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>لوحة الإدارة</span>
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors text-xs"
                title="تسجيل دخول الإدارة"
              >
                <LogIn className="w-3 h-3" />
                <span className="hidden sm:inline">دخول الإدارة</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5' 
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Society Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-medical-500 rounded-lg p-1">
              <img 
                src={logoUrl} 
                alt="شعار جمعية أطباء الأسرة العراقية" 
                className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-navy-900 text-sm sm:text-base leading-tight">
                  جمعية أطباء الأسرة العراقية
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 tracking-wider font-sans font-medium">
                  Iraqi Family Physicians Society
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="القائمة الرئيسية">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return item.is_external ? (
                  <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-navy-900 hover:bg-slate-100/70 rounded-lg transition-colors"
                  >
                    <span>{item.label_ar}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive 
                        ? 'bg-navy-900 text-white shadow-sm font-semibold' 
                        : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label_ar}
                  </Link>
                );
              })}
            </nav>

            {/* Primary Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/membership"
                className="flex items-center gap-2 bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>الهويات والعضوية</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-500"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex flex-col gap-1.5 mb-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return item.is_external ? (
                  <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <span>{item.label_ar}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-navy-900 text-white font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label_ar}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/membership"
                className="flex items-center justify-center gap-2 w-full bg-medical-600 hover:bg-medical-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm text-center"
              >
                <CreditCard className="w-4 h-4" />
                <span>نظام إصدار وتجديد الهويات</span>
              </Link>
              <a
                href={idSystemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-medium text-center"
              >
                <span>بوابة الهويات المباشرة (id.iraqifps.org)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
