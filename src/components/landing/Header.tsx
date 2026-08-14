import React from 'react';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  currentLang?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onRegisterClick,
  currentLang = 'en',
  onLanguageChange,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#100A18]/85 backdrop-blur-md border-b border-[#D6A24A]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <JainSaathiLogo variant="dark" size="md" />

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-[13px] font-semibold text-[#FFF9F1]/80">
          <a href="#home" className="text-[#F3D59B] border-b-2 border-[#D6A24A] pb-1">Home</a>
          <a href="#howitworks" className="hover:text-[#F3D59B] transition-colors">How It Works</a>
          <a href="#whyjainsaathi" className="hover:text-[#F3D59B] transition-colors">Why JainSaathi</a>
          <a href="#matches" className="hover:text-[#F3D59B] transition-colors">Matches</a>
          <a href="#stories" className="hover:text-[#F3D59B] transition-colors">Success Stories</a>
          <a href="#pricing" className="hover:text-[#F3D59B] transition-colors">Pricing</a>
          <a href="#safety" className="hover:text-[#F3D59B] transition-colors">Safety</a>
        </nav>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onLoginClick}
            className="text-[13px] font-semibold text-[#F3D59B] hover:text-[#FFF9F1] transition-colors"
          >
            Login
          </button>
          
          <button
            onClick={onRegisterClick}
            className="bg-[#9E183A] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full border border-[#D6A24A]/40 shadow-md hover:bg-[#80122E] transition-all"
          >
            Create Profile
          </button>
        </div>
      </div>
    </header>
  );
};
