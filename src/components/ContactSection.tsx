'use client';

import { Phone, Mail, MapPin, User, ArrowUpRight } from 'lucide-react';
import { contactPersons, email, companyInfo } from '@/lib/links';
import LinkButton from '@/components/LinkButton';
import { trackLinkClick, type TrafficSource } from '@/lib/tracking';
import { useLanguage } from '@/components/LanguageProvider';

// Official full-color WhatsApp icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#25D366"
        d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.49 0 .16 5.33.16 11.89c0 2.09.55 4.14 1.59 5.95L0 24l6.3-1.65a11.88 11.88 0 0 0 5.75 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.43-8.43z"
      />
      <path
        fill="#FFFFFF"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.78-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
}

interface ContactSectionProps {
  source: TrafficSource;
}

export default function ContactSection({ source }: ContactSectionProps) {
  const { t } = useLanguage();
  const mapsUrl = companyInfo.mapsUrl || 'https://maps.app.goo.gl/qBg9QfCtsHPYpDuZ6';

  return (
    <section aria-labelledby="contact-heading" className="space-y-4">
      <h2
        id="contact-heading"
        className="text-[11px] font-semibold tracking-[0.2em] rtl:tracking-normal uppercase rtl:normal-case text-text-tertiary"
      >
        {t.contact.heading}
      </h2>

      <div className="space-y-2.5">
        {/* Contact Representatives: Clean VIP Contact Rows */}
        {contactPersons.map((person) => {
          const isAmmar = person.name.toLowerCase().includes('ammar');
          const isFstouh = person.name.toLowerCase().includes('fstouh');
          const displayName = isAmmar
            ? t.contact.persons.ammar
            : isFstouh
            ? t.contact.persons.fstouh
            : person.name;

          const callHref = `tel:${person.phoneRaw}`;
          const whatsappHref = `https://wa.me/${person.whatsappNumber}?text=${encodeURIComponent(
            `${t.contact.whatsappMessage} (${displayName})`
          )}`;
          const personId = person.name.toLowerCase().replace(/[^a-z0-9]/g, '');

          return (
            <div
              key={person.name}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg bg-surface-elevated border border-surface-border hover:border-surface-border/80 transition-all duration-200"
            >
              {/* User info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground leading-tight truncate">
                    {displayName}
                  </span>
                  <a
                    href={callHref}
                    dir="ltr"
                    onClick={() => trackLinkClick(source, `call-${personId}`, callHref)}
                    className="inline-block text-xs text-text-tertiary hover:text-foreground font-mono mt-0.5 tracking-tight transition-colors"
                  >
                    <bdi dir="ltr">&#x200E;{person.phoneDisplay}</bdi>
                  </a>
                </div>
              </div>

              {/* Logo-only Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                {/* Phone Call */}
                <a
                  href={callHref}
                  onClick={() => trackLinkClick(source, `call-${personId}`, callHref)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-surface-border hover:border-brand-red/40 hover:bg-brand-red hover:text-white text-brand-red transition-all duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-brand-red shadow-sm"
                  aria-label={`Call ${displayName}`}
                  title={`Call ${displayName}`}
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(source, `whatsapp-${personId}`, whatsappHref)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-surface-border hover:border-[#25D366]/40 hover:bg-[#25D366]/15 transition-all duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-brand-red shadow-sm"
                  aria-label={`WhatsApp ${displayName}`}
                  title={`WhatsApp ${displayName}`}
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          );
        })}

        {/* Email button */}
        <LinkButton
          href={`mailto:${email.primary}?subject=${encodeURIComponent(email.subject)}`}
          linkId="email"
          source={source}
          icon={<Mail className="w-5 h-5 text-brand-red" />}
          title={t.contact.emailUs}
          description={email.primary}
          variant="secondary"
          showArrow
        />

        {/* Store Location Card with Google Maps link */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLinkClick(source, 'store-location-map', mapsUrl)}
          className="group block p-4 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-red/20 hover:bg-surface transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-brand-red text-start rtl:text-right"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-red mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground group-hover:text-brand-red transition-colors duration-200">
                  {t.contact.visitStore}
                </span>
                <span className="text-[11px] font-medium text-brand-red flex items-center gap-0.5 group-hover:underline">
                  {t.contact.openInMaps}
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:scale-x-[-1]" />
                </span>
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed mt-1">
                {t.contact.address}
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
