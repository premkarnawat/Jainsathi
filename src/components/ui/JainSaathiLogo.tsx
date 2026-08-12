import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const JainSaathiLogo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : 44;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const taglineSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  const textColor = variant === 'dark' ? 'text-white' : 'text-[#241A20]';
  const taglineColor = variant === 'dark' ? 'text-[#F3D59B]' : 'text-[#6E1231]';

  return (
    <div className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      {/* Jain Lotus Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <path
          d="M20 4C20 4 24 10 24 16C24 22 20 25 20 25C20 25 16 22 16 16C16 10 20 4 20 4Z"
          fill="url(#lotus_gold)"
        />
        <path
          d="M20 25C20 25 28 23 33 17C38 11 36 6 36 6C36 6 31 10 27 16C24 21 20 25 20 25Z"
          fill="url(#lotus_ruby)"
        />
        <path
          d="M20 25C20 25 12 23 7 17C2 11 4 6 4 6C4 6 9 10 13 16C16 21 20 25 20 25Z"
          fill="url(#lotus_ruby)"
        />
        <path
          d="M10 28C10 28 15 26 20 28C25 26 30 28 30 28C30 28 26 32 20 33C14 32 10 28 10 28Z"
          fill="url(#lotus_gold)"
        />
        <circle cx="20" cy="14" r="2.5" fill="#F3D59B" />
        <defs>
          <linearGradient id="lotus_gold" x1="16" y1="4" x2="24" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3D59B" />
            <stop offset="1" stopColor="#D6A24A" />
          </linearGradient>
          <linearGradient id="lotus_ruby" x1="4" y1="6" x2="36" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9E183A" />
            <stop offset="1" stopColor="#6E1231" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col leading-none">
        <span className={`font-serif font-bold tracking-tight ${textSize} ${textColor}`}>
          Jain<span className="text-[#D6A24A]">Saathi</span>
        </span>
        <span className={`font-sans tracking-wider ${taglineSize} ${taglineColor} opacity-90`}>
          Find Your Jain Saathi
        </span>
      </div>
    </div>
  );
};
