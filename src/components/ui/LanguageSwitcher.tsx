import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang?: string;
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  variant?: 'dark' | 'light';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang = 'en',
  onLanguageChange,
  variant = 'dark',
}) => {
  const [lang, setLang] = useState<'en' | 'hi'>(currentLang as 'en' | 'hi');

  const handleToggle = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const textColor = variant === 'dark' ? 'text-[#F3D59B]' : 'text-[#6E1231]';

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D6A24A]/30 text-xs font-medium ${textColor} bg-black/20 backdrop-blur-sm select-none`}>
      <Globe className="w-3.5 h-3.5 text-[#D6A24A]" />
      <button
        onClick={() => handleToggle('en')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          lang === 'en' ? 'bg-[#D6A24A] text-[#100A18] font-bold' : 'hover:text-white'
        }`}
      >
        English
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => handleToggle('hi')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          lang === 'hi' ? 'bg-[#D6A24A] text-[#100A18] font-bold' : 'hover:text-white'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};
