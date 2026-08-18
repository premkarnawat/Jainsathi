'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// In-memory cache for loaded dictionaries
const dictionaries: Record<string, Record<string, string>> = {};

export function TranslationProvider({ children, initialLang = 'en' }: { children: ReactNode, initialLang?: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [dict, setDict] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('jainsaathi_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLangState(savedLang);
    }
  }, []);

  useEffect(() => {
    const loadDict = async () => {
      if (dictionaries[lang]) {
        setDict(dictionaries[lang]);
        return;
      }
      try {
        const res = await import(`./dictionaries/${lang}.json`);
        dictionaries[lang] = res.default;
        setDict(res.default);
      } catch (err) {
        console.error(`Failed to load dictionary for ${lang}`, err);
      }
    };
    loadDict();
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('jainsaathi_lang', newLang);
  };

  const t = (key: string): string => {
    if (!dict) return key;
    const keys = key.split('.');
    let val: any = dict;
    for (const k of keys) {
      if (val[k] === undefined) return key; // Fallback to key
      val = val[k];
    }
    return typeof val === 'string' ? val : key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
