import React from 'react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'ruby' | 'gold-outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'ruby',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-4 py-2 text-xs'
      : size === 'md'
      ? 'px-6 py-3 text-sm'
      : 'px-8 py-4 text-base';

  let variantClasses = '';
  if (variant === 'ruby') {
    variantClasses = 'btn-ruby';
  } else if (variant === 'gold-outline') {
    variantClasses = 'btn-gold-outline';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-[#FFF9F1] text-[#6E1231] font-semibold border border-[#D6A24A]/40 hover:bg-[#F8E8EA] transition-all rounded-full shadow-sm';
  } else {
    variantClasses = 'bg-transparent text-[#F3D59B] hover:text-white transition-colors';
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex items-center">{icon}</span>}
    </button>
  );
};
