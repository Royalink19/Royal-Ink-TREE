'use client';

import Image from 'next/image';
import { ShoppingBag, MapPin, Printer, ArrowUpRight } from 'lucide-react';
import { getLinksByCategory } from '@/lib/links';
import LinkButton from '@/components/LinkButton';
import { trackLinkClick, type TrafficSource } from '@/lib/tracking';
import { useLanguage } from '@/components/LanguageProvider';

interface WebsiteLinksProps {
  source: TrafficSource;
}

export default function WebsiteLinks({ source }: WebsiteLinksProps) {
  const { t } = useLanguage();
  const websiteLinks = getLinksByCategory('website');

  const mainWebsite = websiteLinks.find((l) => l.id === 'website');
  const findUs = websiteLinks.find((l) => l.id === 'find-us');
  const compatibility = websiteLinks.find((l) => l.id === 'compatibility');
  const otherWebsiteLinks = websiteLinks.filter(
    (l) => l.id !== 'website' && l.id !== 'find-us' && l.id !== 'compatibility'
  );

  const FaviconIcon = (
    <Image
      src="/ri-favicon.png"
      alt="Royal Ink"
      width={24}
      height={24}
      className="w-6 h-6 object-contain rounded-sm"
      unoptimized
    />
  );

  const iconMap: Record<string, React.ReactNode> = {
    globe: FaviconIcon,
    favicon: FaviconIcon,
    'shopping-bag': <ShoppingBag className="w-5 h-5 text-brand-red" />,
    'map-pin': <MapPin className="w-5 h-5 text-brand-red" />,
    printer: <Printer className="w-5 h-5 text-brand-red" />,
  };

  return (
    <section aria-labelledby="websites-heading" className="space-y-3">
      <h2
        id="websites-heading"
        className="text-[11px] font-semibold tracking-[0.2em] rtl:tracking-normal uppercase rtl:normal-case text-text-tertiary mb-4"
      >
        {t.websites.heading}
      </h2>

      <div className="space-y-2.5">
        {/* Main Official Website Featured Card with Cinematic Image Background */}
        {mainWebsite && (
          <a
            href={mainWebsite.url}
            onClick={() => trackLinkClick(source, mainWebsite.id, mainWebsite.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-xl border border-surface-border/80 hover:border-brand-red/50 shadow-md hover:shadow-xl hover:shadow-brand-red/10 transition-all duration-300 active:scale-[0.98] overflow-hidden focus-visible:outline-2 focus-visible:outline-brand-red text-start rtl:text-right"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/website-bg.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                unoptimized
              />
              {/* Dark base scrim */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
              {/* Directional gradient to guarantee text readability in both RTL & LTR */}
              <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-black/90 via-black/75 to-black/30" />
              {/* Subtle red accent glow on hover */}
              <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/10 transition-colors duration-300" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex items-center gap-3.5 min-w-0 flex-1">
              {/* Glass Frosted Favicon Icon */}
              <div className="w-11 h-11 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-xs group-hover:border-brand-red/40 group-hover:bg-white/15 transition-all duration-300">
                <Image
                  src="/ri-favicon.png"
                  alt="Royal Ink"
                  width={26}
                  height={26}
                  className="w-6.5 h-6.5 object-contain rounded-xs"
                  unoptimized
                />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <span className="block text-sm sm:text-base font-bold text-white tracking-tight leading-tight drop-shadow-xs">
                  {t.websites.officialWebsite.title}
                </span>
                <span className="block text-[11px] sm:text-xs text-white/80 font-normal mt-0.5 leading-snug line-clamp-1 drop-shadow-xs">
                  {t.websites.officialWebsite.description}
                </span>
              </div>
            </div>

            {/* Action Arrow in Frosted Glass Pill */}
            <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 ml-3 rtl:ml-0 rtl:mr-3 group-hover:bg-brand-red group-hover:border-brand-red text-white transition-all duration-300 group-hover:scale-105 shadow-sm">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:scale-x-[-1] rtl:group-hover:-translate-x-0.5" />
            </div>
          </a>
        )}

        {/* Feature Buttons: Points of Sale & Compatibility side by side */}
        {(findUs || compatibility) && (
          <div className="grid grid-cols-2 gap-2.5">
            {findUs && (
              <a
                href={findUs.url}
                onClick={() => trackLinkClick(source, findUs.id, findUs.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between p-4 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-red/20 hover:bg-surface transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-brand-red text-start rtl:text-right"
              >
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-5 h-5 text-brand-red transition-transform duration-200 group-hover:scale-110" />
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-foreground transition-colors duration-200 rtl:scale-x-[-1]" />
                </div>
                <div>
                  <span className="block text-sm font-semibold leading-tight text-foreground group-hover:text-brand-red transition-colors duration-200">
                    {t.websites.findUs.title}
                  </span>
                  <span className="block text-[11px] text-text-tertiary mt-1 leading-snug line-clamp-1">
                    {t.websites.findUs.description}
                  </span>
                </div>
              </a>
            )}

            {compatibility && (
              <a
                href={compatibility.url}
                onClick={() => trackLinkClick(source, compatibility.id, compatibility.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between p-4 rounded-lg bg-surface-elevated border border-surface-border hover:border-brand-red/20 hover:bg-surface transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-brand-red text-start rtl:text-right"
              >
                <div className="flex items-center justify-between mb-3">
                  <Printer className="w-5 h-5 text-brand-red transition-transform duration-200 group-hover:scale-110" />
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-foreground transition-colors duration-200 rtl:scale-x-[-1]" />
                </div>
                <div>
                  <span className="block text-sm font-semibold leading-tight text-foreground group-hover:text-brand-red transition-colors duration-200">
                    {t.websites.compatibility.title}
                  </span>
                  <span className="block text-[11px] text-text-tertiary mt-1 leading-snug line-clamp-1">
                    {t.websites.compatibility.description}
                  </span>
                </div>
              </a>
            )}
          </div>
        )}

        {/* Other Website Links (e.g. Online Store) */}
        {otherWebsiteLinks.map((link) => (
          <LinkButton
            key={link.id}
            href={link.url}
            linkId={link.id}
            source={source}
            icon={iconMap[link.icon || ''] || FaviconIcon}
            title={link.title}
            description={link.description}
            variant="secondary"
            showArrow
          />
        ))}
      </div>
    </section>
  );
}
