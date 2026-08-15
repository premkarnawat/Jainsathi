import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const JainSaathiLogo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const logoHeight = size === 'sm' ? 'h-10' : size === 'md' ? 'h-16' : 'h-24';

  return (
    <div className="inline-flex items-center gap-3 cursor-pointer select-none">
      <img
        src="/logo.png"
        alt="JainSaathi Logo"
        className={`${logoHeight} w-auto object-contain rounded-lg`}
      />
    </div>
  );
};
