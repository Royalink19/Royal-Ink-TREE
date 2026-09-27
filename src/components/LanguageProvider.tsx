'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/i18n';

export type { Language, Translations };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Arabic is the default language
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('royal-ink-lang') as Language | null;
      if (stored === 'ar' || stored === 'fr' || stored === 'en') {
        setLanguageState(stored);
        document.documentElement.setAttribute('lang', stored);
        document.documentElement.setAttribute('dir', stored === 'ar' ? 'rtl' : 'ltr');
      } else {
        // Default to Arabic
        setLanguageState('ar');
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
      }
    } catch {
      setLanguageState('ar');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('royal-ink-lang', lang);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    } catch {
      // ignore
    }
  };

  const t = translations[language];
  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
