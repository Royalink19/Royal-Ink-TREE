import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Royal Ink — Analytics & QR Studio',
  description: 'Private administration and analytics dashboard for Royal Ink touchpoints.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
