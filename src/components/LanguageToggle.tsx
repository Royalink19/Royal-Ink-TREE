'use client';

import { useLanguage, type Language } from '@/components/LanguageProvider';

const languages: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      dir="ltr"
      className="inline-flex items-center p-0.5 rounded-full bg-surface-elevated border border-surface-border text-xs shadow-xs"
    >
      {languages.map((lang) => {
        const isActive = language === lang.code;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-full transition-all duration-200 text-[11px] font-medium cursor-pointer ${
              isActive
                ? 'bg-brand-red text-white font-semibold shadow-xs'
                : 'text-text-tertiary hover:text-foreground'
            }`}
            aria-pressed={isActive}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
