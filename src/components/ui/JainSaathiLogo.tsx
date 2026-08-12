import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const JainSaathiLogo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const logoHeight = size === 'sm' ? 40 : size === 'md' ? 54 : 72;
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const taglineSize = size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs';

  const jainTextColor = variant === 'dark' ? 'text-[#FFF9F1]' : 'text-[#6E1231]';
  const saathiTextColor = 'text-[#D6A24A]';
  const taglineColor = variant === 'dark' ? 'text-[#F3D59B]' : 'text-[#9E183A]';

  return (
    <div className="inline-flex items-center gap-3 cursor-pointer select-none">
      {/* Official JainSaathi Emblem: Ahimsa Hand, Couple Silhouettes & Gold Lotus */}
      <svg
        height={logoHeight}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105 shrink-0"
      >
        {/* Outer Gold Halo Circle */}
        <circle cx="80" cy="55" r="38" stroke="#D6A24A" strokeWidth="2" strokeDasharray="3 2" />

        {/* Ahimsa Hand Top Symbol */}
        <path
          d="M80 18 C78 18 76 20 76 23 V36 C76 38 78 40 80 40 C82 40 84 38 84 36 V23 C84 20 82 18 80 18 Z"
          fill="#D6A24A"
        />
        <circle cx="80" cy="30" r="4" fill="none" stroke="#6E1231" strokeWidth="1.5" />
        <path d="M78 30 H82 M80 28 V32" stroke="#6E1231" strokeWidth="1" />

        {/* Groom & Bride Lotus Silhouettes */}
        <path
          d="M45 105 C45 80 65 65 76 65 C76 75 70 90 55 105 Z"
          fill="url(#lotus_burgundy)"
        />
        <path
          d="M115 105 C115 80 95 65 84 65 C84 75 90 90 105 105 Z"
          fill="url(#lotus_burgundy)"
        />

        {/* Groom Silhouette (Left) */}
        <path
          d="M58 75 C62 70 68 72 70 78 C72 85 68 95 60 100 C55 92 54 82 58 75 Z"
          fill="#FFF9F1"
          opacity="0.9"
        />

        {/* Bride Silhouette (Right) */}
        <path
          d="M102 75 C98 70 92 72 90 78 C88 85 92 95 100 100 C105 92 106 82 102 75 Z"
          fill="#F3D59B"
          opacity="0.9"
        />

        {/* Bottom Lotus Petals Base */}
        <path
          d="M30 100 C50 125 110 125 130 100 C120 135 40 135 30 100 Z"
          fill="url(#lotus_gold_base)"
        />
        <path
          d="M70 105 L80 90 L90 105 L80 120 Z"
          fill="#9E183A"
          stroke="#D6A24A"
          strokeWidth="1.5"
        />

        <defs>
          <linearGradient id="lotus_burgundy" x1="45" y1="65" x2="115" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9E183A" />
            <stop offset="1" stopColor="#6E1231" />
          </linearGradient>
          <linearGradient id="lotus_gold_base" x1="30" y1="100" x2="130" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3D59B" />
            <stop offset="0.5" stopColor="#D6A24A" />
            <stop offset="1" stopColor="#9E183A" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Text Stack */}
      <div className="flex flex-col leading-tight">
        <div className={`font-serif font-bold tracking-tight ${textSize}`}>
          <span className={jainTextColor}>Jain</span>
          <span className={saathiTextColor}>Saathi</span>
        </div>
        <div className={`font-sans font-semibold tracking-widest uppercase ${taglineSize} ${taglineColor} flex items-center gap-1 mt-0.5`}>
          <span>♦</span>
          <span>FIND YOUR JAIN SAATHI</span>
          <span>♦</span>
        </div>
      </div>
    </div>
  );
};
