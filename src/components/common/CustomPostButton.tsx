import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CustomPostButtonProps {
  text?: string;
  url?: string;
  className?: string;
}

export const CustomPostButton: React.FC<CustomPostButtonProps> = ({ text, url, className = '' }) => {
  if (!text || !url) return null;

  const isExternal = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');

  return (
    <div className={`my-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white shadow-lg border border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
        <div className="w-12 h-12 rounded-2xl bg-medical-500/20 border border-medical-400/30 flex items-center justify-center text-teal-300 shrink-0 shadow-inner">
          <ExternalLink className="w-5 h-5 text-medical-300" />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
            {text}
          </h4>
          <p className="text-[11px] text-slate-300 font-light mt-0.5">
            رابط مباشر معتمد لهذا المنشور
          </p>
        </div>
      </div>

      <a
        href={url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-medical-500 to-teal-500 hover:from-medical-600 hover:to-teal-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
      >
        <span>{text}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
