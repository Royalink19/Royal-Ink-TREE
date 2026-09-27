'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="about-heading" className="space-y-3">
      <h2
        id="about-heading"
        className="text-[11px] font-semibold tracking-[0.2em] rtl:tracking-normal uppercase rtl:normal-case text-text-tertiary"
      >
        {t.about.heading}
      </h2>

      <p className="text-sm text-text-secondary leading-relaxed">
        {t.about.description}
      </p>
    </section>
  );
}
