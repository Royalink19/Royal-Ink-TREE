'use client';

import Image from 'next/image';
import { getLinksByCategory } from '@/lib/links';
import LinkButton from '@/components/LinkButton';
import type { TrafficSource } from '@/lib/tracking';
import { useLanguage } from '@/components/LanguageProvider';

interface ShopSectionProps {
  source: TrafficSource;
}

export default function ShopSection({ source }: ShopSectionProps) {
  const { t } = useLanguage();
  const shopLinks = getLinksByCategory('shop');

  const StoreIcon = (
    <Image
      src="/store-icon.png"
      alt="Royal Ink Store"
      width={24}
      height={24}
      className="w-6 h-6 object-contain rounded-xs"
      unoptimized
    />
  );

  const iconMap: Record<string, React.ReactNode> = {
    store: StoreIcon,
    'shopping-bag': StoreIcon,
    ouedkniss: (
      <Image
        src="/ouedkniss-icon.png"
        alt="Ouedkniss"
        width={38}
        height={21}
        className="w-7 h-5 object-contain"
        unoptimized
      />
    ),
    asbbab: (
      <Image
        src="/asbbab-icon.png"
        alt="ASBBAB"
        width={24}
        height={22}
        className="w-5 h-5 object-contain"
        unoptimized
      />
    ),
  };

  const getTranslatedContent = (id: string, defaultTitle: string, defaultDesc?: string) => {
    switch (id) {
      case 'store':
        return {
          title: t.shop.officialStore.title,
          description: t.shop.officialStore.description,
        };
      case 'ouedkniss':
        return {
          title: t.shop.ouedkniss.title,
          description: t.shop.ouedkniss.description,
        };
      case 'asbbab':
        return {
          title: t.shop.asbbab.title,
          description: t.shop.asbbab.description,
        };
      default:
        return { title: defaultTitle, description: defaultDesc };
    }
  };

  return (
    <section aria-labelledby="shop-heading" className="space-y-3">
      <h2
        id="shop-heading"
        className="text-[11px] font-semibold tracking-[0.2em] rtl:tracking-normal uppercase rtl:normal-case text-text-tertiary mb-4"
      >
        {t.shop.heading}
      </h2>

      <div className="space-y-2.5">
        {shopLinks.map((link) => {
          const content = getTranslatedContent(link.id, link.title, link.description);
          return (
            <LinkButton
              key={link.id}
              href={link.url}
              linkId={link.id}
              source={source}
              icon={iconMap[link.icon || ''] || StoreIcon}
              title={content.title}
              description={content.description}
              variant="secondary"
              showArrow
            />
          );
        })}
      </div>
    </section>
  );
}
