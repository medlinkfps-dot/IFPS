import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'تعذر تسجيل الدخول، يرجى التحقق من البريد وكلمة المرور.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 pattern-grid relative overflow-hidden">
      <SEO title="تسجيل الدخول الإداري | IFPS CMS" />

      {/* Decorative gradient circles */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-medical-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 mx-auto mb-4 flex items-center justify-center shadow-xl border border-slate-700">
            <img 
              src="https://iraqifps.org/wp-content/uploads/2025/11/photo_2025-11-14_19-45-19.jpg" 
              alt="IFPS" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            لوحة إدارة جمعية أطباء الأسرة العراقية
          </h2>
          <p className="mt-1 text-xs text-medical-300 font-sans">
            IFPS Institutional Management System
          </p>
        </div>

        <div className="mt-8 bg-navy-900/90 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-navy-700/80 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                البريد الإلكتروني المعتمد للمسؤول
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@iraqifps.org"
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-navy-950/80 border border-navy-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-left font-sans placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-navy-950/80 border border-navy-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-left font-sans placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-medical-600 hover:bg-medical-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? 'جارِ التحقق من الحساب...' : 'تسجيل الدخول الآمن'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-800 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              هذه المنطقة مخصصة حصراً للهيئة الإدارية المخولة لجمعية أطباء الأسرة العراقية. جميع محاولات الدخول مسجلة ومحمية.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>العودة إلى الموقع العام</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
