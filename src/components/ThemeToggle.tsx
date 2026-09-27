'use client';

import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const label =
    language === 'ar'
      ? theme === 'dark'
        ? 'التبديل إلى الوضع الفاتح'
        : 'التبديل إلى الوضع الداكن'
      : language === 'fr'
      ? theme === 'dark'
        ? 'Passer au mode clair'
        : 'Passer au mode sombre'
      : `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-9 h-9 rounded-lg
                 bg-surface-elevated border border-surface-border
                 hover:border-brand-red/20 hover:bg-surface
                 transition-all duration-200 active:scale-95 cursor-pointer"
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-text-secondary group-hover:text-foreground transition-colors duration-200" />
      )}
    </button>
  );
}
