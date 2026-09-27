'use client';

import Image from 'next/image';
import { companyInfo } from '@/lib/links';
import { useLanguage } from '@/components/LanguageProvider';

export default function BrandHeader() {
  const { t } = useLanguage();

  return (
    <header className="relative flex flex-col items-center pt-4 pb-10 sm:pt-8 sm:pb-12">
      {/* Subtle red glow behind logo */}
      <div
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: 'var(--accent-glow)' }}
        aria-hidden="true"
      />

      {/* Company Logo */}
      <div className="relative z-10 w-[220px] sm:w-[260px] md:w-[300px]">
        <Image
          src="/logo.svg"
          alt={`${companyInfo.name} — ${companyInfo.tagline}`}
          width={300}
          height={72}
          className="w-full h-auto"
          priority
          loading="eager"
        />
      </div>

      {/* Section Label */}
      <div className="mt-8 flex items-center gap-3">
        <span
          className="h-px w-8 sm:w-12"
          style={{ background: 'var(--brand-red)' }}
          aria-hidden="true"
        />
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] rtl:tracking-normal uppercase rtl:normal-case text-text-secondary">
          {t.header.connectWithUs}
        </span>
        <span
          className="h-px w-8 sm:w-12"
          style={{ background: 'var(--brand-red)' }}
          aria-hidden="true"
        />
      </div>

      {/* Tagline */}
      <p className="mt-3.5 text-sm sm:text-[15px] text-text-tertiary font-normal tracking-normal leading-relaxed text-center max-w-sm sm:max-w-md px-2">
        {t.header.tagline}
      </p>
    </header>
  );
}
