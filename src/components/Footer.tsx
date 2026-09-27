'use client';

import Image from 'next/image';
import { companyInfo } from '@/lib/links';
import { useLanguage } from '@/components/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-10 pb-8" role="contentinfo">
      {/* Separator */}
      <div className="h-px w-full bg-surface-border mb-8" aria-hidden="true" />

      <div className="flex flex-col items-center gap-4">
        {/* Small logo mark */}
        <div className="w-[120px] opacity-80 hover:opacity-100 transition-opacity duration-300">
          <Image
            src="/logo.svg"
            alt={companyInfo.name}
            width={120}
            height={29}
            className="w-full h-auto"
          />
        </div>

        {/* Copyright */}
        <p className="text-xs text-text-tertiary text-center">
          &copy; {currentYear} {companyInfo.name}. {t.footer.rightsReserved}
        </p>
      </div>
    </footer>
  );
}
