import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ShieldAlert } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <SEO title="الصفحة غير موجودة (404)" />
      
      <div className="max-w-md mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="text-sm font-bold text-medical-600 font-mono tracking-widest block mb-1">
          ERROR 404
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-3">
          الصفحة المطلوبة غير موجودة
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8">
          قد يكون الرابط الذي اتبعته غير صحيح أو تم نقل المحتوى أو حذفه من قِبل إدارة جمعية أطباء الأسرة العراقية.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
          <Link
            to="/news"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs sm:text-sm border border-slate-300 transition-colors"
          >
            <span>استعراض الأخبار</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
