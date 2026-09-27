import { Suspense } from 'react';
import BrandHeader from '@/components/BrandHeader';
import WebsiteLinks from '@/components/WebsiteLinks';
import ShopSection from '@/components/ShopSection';
import SocialLinks from '@/components/SocialLinks';
import ContactSection from '@/components/ContactSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import TrackingProvider from '@/components/TrackingProvider';
import SplashLoader from '@/components/SplashLoader';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { getTrafficSource, type TrafficSource } from '@/lib/tracking';

interface ConnectHubProps {
  searchParams?: Promise<{ source?: string }>;
}

export default async function ConnectHub({ searchParams }: ConnectHubProps) {
  const params = await searchParams;
  const source: TrafficSource = getTrafficSource(
    params?.source ? new URLSearchParams({ source: params.source }) : undefined
  );

  return (
    <>
      {/* Initial Printing Preloader */}
      <SplashLoader />

      {/* Tracking — client component, wrapped in Suspense for searchParams */}
      <Suspense fallback={null}>
        <TrackingProvider />
      </Suspense>

      <div className="relative min-h-screen flex flex-col">
        {/* Background decoration */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          {/* Subtle top gradient */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'var(--brand-red)', opacity: 'var(--glow-opacity)' }}
          />
          {/* Subtle bottom gradient */}
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full blur-[80px]"
            style={{ background: 'var(--brand-red)', opacity: 'var(--glow-opacity)' }}
          />
        </div>

        {/* Header Bar: Language Switcher & Theme Toggle — dir="ltr" anchors positions stably */}
        <div className="relative z-20 w-full max-w-md mx-auto px-5 sm:px-6" dir="ltr">
          <div className="flex items-center justify-between pt-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 flex-1 w-full max-w-md mx-auto px-5 sm:px-6">
          {/* Brand Header */}
          <BrandHeader />

          {/* Divider */}
          <div className="h-px w-full bg-surface-border mb-8" aria-hidden="true" />

          {/* Website Links */}
          <WebsiteLinks source={source} />

          {/* Spacing */}
          <div className="h-8" />

          {/* Shop From Us */}
          <ShopSection source={source} />

          {/* Spacing */}
          <div className="h-8" />

          {/* Social Media */}
          <SocialLinks source={source} />

          {/* Spacing */}
          <div className="h-8" />

          {/* Contact Information */}
          <ContactSection source={source} />

          {/* Spacing */}
          <div className="h-8" />

          {/* About */}
          <AboutSection />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </>
  );
}
