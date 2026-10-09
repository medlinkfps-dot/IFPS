import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'جارِ التحميل...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-slate-200 border-t-medical-500 rounded-full animate-spin mb-3`}
      />
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
};
