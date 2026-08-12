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
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#FFF9F1]/80">
          <a href="#home" className="text-[#F3D59B] border-b-2 border-[#D6A24A] pb-1 font-semibold">Home</a>
          <a href="#about" className="hover:text-[#F3D59B] transition-colors">About Us</a>
          <a href="#features" className="hover:text-[#F3D59B] transition-colors">Features</a>
          <a href="#stories" className="hover:text-[#F3D59B] transition-colors">Success Stories</a>
          <a href="#pricing" className="hover:text-[#F3D59B] transition-colors">Pricing</a>
          <a href="#help" className="hover:text-[#F3D59B] transition-colors">Help</a>
        </nav>

        {/* Right: Language Switcher & Auth Buttons */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} variant="dark" />
          
          <button
            onClick={onLoginClick}
            className="btn-ruby py-2 px-5 text-xs rounded-full shadow-lg"
          >
            Login / Register
          </button>
        </div>
      </div>
    </header>
  );
};
