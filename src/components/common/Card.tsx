import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
