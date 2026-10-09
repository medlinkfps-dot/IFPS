import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ExternalLink, 
  FileDown,
  FileText, 
  LayoutDashboard,
  Home,
  Newspaper,
  Calendar,
  GraduationCap,
  Award,
  Users,
  PhoneCall,
  Info
} from 'lucide-react';
import { getNavigationItems, getSettings } from '../../lib/db';
import { INITIAL_NAVIGATION } from '../../lib/mockData';
import { NavigationItem, SiteSetting } from '../../types';
import { useAuth } from '../../lib/auth';

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': <Home className="w-4 h-4" />,
  '/about': <Info className="w-4 h-4" />,
  '/news': <Newspaper className="w-4 h-4" />,
  '/events': <Calendar className="w-4 h-4" />,
  '/courses': <GraduationCap className="w-4 h-4" />,
  '/opportunities': <Award className="w-4 h-4" />,
  '/documents': <FileText className="w-4 h-4" />,
  '/membership': <FileText className="w-4 h-4" />,
  '/contact': <PhoneCall className="w-4 h-4" />,
};

export const Navbar: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(() =>
    INITIAL_NAVIGATION.filter((item) => item.is_active && item.path !== '/opportunities')
  );
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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const logoUrl = settings['official_logo_url']?.value_ar || '/fps.png';

  return (
    <header 
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white shadow-md border-b border-slate-200' 
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between">
          
          {/* Official Brand / Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-medical-500 rounded-2xl p-1 -m-1"
            aria-label="الرئيسية - جمعية أطباء الأسرة العراقية"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-1 group-hover:border-medical-200 transition-colors">
              <img 
                src={logoUrl} 
                alt="شعار جمعية أطباء الأسرة العراقية" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-navy-900 text-sm sm:text-base leading-tight tracking-tight">
                جمعية أطباء الأسرة العراقية
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans tracking-wide font-medium">
                Iraqi Family Physicians Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="القائمة الرئيسية">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return item.is_external ? (
                <a
                  key={item.id}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <span>{item.label_ar}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 text-xs xl:text-sm rounded-xl transition-all ${
                    isActive 
                      ? 'bg-navy-900 text-white font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70 font-semibold'
                  }`}
                >
                  {item.label_ar}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions (Desktop) */}
          {user && (
            <div className="hidden lg:flex items-center gap-2.5">
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-medical-600" />
                <span>لوحة الإدارة</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-500"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-2xl max-h-[calc(100dvh-75px)] overflow-y-auto px-4 py-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              أقسام الموقع
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                const icon = NAV_ICONS[item.path] || <Users className="w-4 h-4" />;

                return item.is_external ? (
                  <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{icon}</span>
                      <span>{item.label_ar}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-navy-900 text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActive ? 'text-medical-300' : 'text-slate-400'}>
                      {icon}
                    </span>
                    <span>{item.label_ar}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer CTAs */}
          <div className="pt-5 border-t border-slate-100 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <a href="mailto:info@iraqifps.org" className="hover:text-navy-900 font-sans">
                info@iraqifps.org
              </a>
              {user && (
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-medical-600 font-bold hover:underline"
                >
                  لوحة الإدارة
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
