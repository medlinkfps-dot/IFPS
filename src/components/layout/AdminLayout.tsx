import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FileDown,
  Layers, 
  Tag, 
  Image as ImageIcon, 
  Menu as MenuIcon, 
  Mail, 
  History, 
  Settings, 
  LogOut, 
  ExternalLink, 
  PlusCircle, 
  X, 
  Shield, 
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner size="lg" label="جارِ التحقق من الصلاحيات الإدارية..." />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { label_ar: 'لوحة التحكم', path: '/admin/dashboard', icon: LayoutDashboard },
    { label_ar: 'إدارة المنشورات', path: '/admin/posts', icon: FileText },
    { label_ar: 'ملفات PDF والوثائق', path: '/admin/documents', icon: FileDown },
    { label_ar: 'الأقسام والمحتوى', path: '/admin/sections', icon: Layers },
    { label_ar: 'التصنيفات', path: '/admin/categories', icon: Tag },
    { label_ar: 'مكتبة الوسائط', path: '/admin/media', icon: ImageIcon },
    { label_ar: 'عناصر القائمة', path: '/admin/navigation', icon: MenuIcon },
    { label_ar: 'الرسائل الواردة', path: '/admin/messages', icon: Mail },
    { label_ar: 'سجل العمليات', path: '/admin/audit-logs', icon: History },
    { label_ar: 'إعدادات الموقع', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-arabic">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 right-0 z-50 h-screen w-64 bg-navy-950 text-white flex flex-col border-l border-navy-800 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-navy-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-0.5 shrink-0 flex items-center justify-center">
              <img 
                src="/fps.png" 
                alt="IFPS" 
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-white">إدارة IFPS</h2>
              <span className="text-[10px] text-medical-300 font-mono">لوحة التحكم الآمنة</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 pb-2">
          <Link
            to="/admin/posts/new"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-medical-600 hover:bg-medical-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء منشور جديد</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-medical-700/40 text-medical-200 border border-medical-500/40 font-bold' 
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-medical-400' : 'text-slate-400'}`} />
                <span>{item.label_ar}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-navy-800/80 bg-navy-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <UserCircle className="w-8 h-8 text-medical-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-medical-300 font-mono">
                  <Shield className="w-2.5 h-2.5" />
                  {isAdmin ? 'مدير عام' : 'محرر'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-100"
              aria-label="فتح القائمة الجانبية"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-600 hidden sm:inline">
              نظام إدارة المحتوى المؤسسي (IFPS CMS)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>النشر والتطبيق المباشر نشط</span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors border border-slate-200/60"
            >
              <span>معاينة الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
