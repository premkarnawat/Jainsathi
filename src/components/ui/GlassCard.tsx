import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'white';
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'light',
  className = '',
  hoverEffect = false,
}) => {
  const baseStyle =
    variant === 'dark'
      ? 'glass-card-dark'
      : variant === 'light'
      ? 'glass-card-light'
      : 'glass-card-white';

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D6A24A]'
    : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} p-6 ${className}`}>
      {children}
    </div>
  );
};
