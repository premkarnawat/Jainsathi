import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const JainSaathiLogo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const logoHeight = size === 'sm' ? 'h-10' : size === 'md' ? 'h-16' : 'h-24';

  return (
    <div className="inline-flex items-center gap-3 cursor-pointer select-none">
      {/* Official JainSaathi Logo Image */}
      <img
        src="/logo.jpg"
        alt="JainSaathi Logo"
        className={`${logoHeight} w-auto object-contain rounded-lg`}
        onError={(e) => {
          // Fallback if logo.jpg fails to load
          e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=100';
        }}
      />
    </div>
  );
};
