'use client';

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Check if google translate cookie exists
    const googtrans = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (googtrans && googtrans.includes('/hi')) {
      setLang('hi');
    } else {
      setLang('en');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    
    // Set cookie for both root and current domain to ensure Google Translate picks it up
    const domain = window.location.hostname;
    if (newLang === 'hi') {
      document.cookie = `googtrans=/en/hi; path=/`;
      document.cookie = `googtrans=/en/hi; path=/; domain=${domain}`;
    } else {
      document.cookie = `googtrans=/en/en; path=/`;
      document.cookie = `googtrans=/en/en; path=/; domain=${domain}`;
    }
    
    // Reload page to apply google translate
    window.location.reload();
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${className}`}
    >
      <Globe className="w-4 h-4" />
      <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
    </button>
  );
}
