import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Tajawal } from 'next/font/google';
import './globals.css';
import { companyInfo } from '@/lib/links';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const tajawal = Tajawal({
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${companyInfo.name} — Connect With Us`,
  description: `${companyInfo.description} Find all our contact details, social media, and links in one place.`,
  keywords: [companyInfo.name, 'connect', 'contact', 'links', 'social media'],
  authors: [{ name: companyInfo.name }],
  openGraph: {
    title: `${companyInfo.name} — Connect With Us`,
    description: `Everything you need to connect with ${companyInfo.name}, in one place.`,
    type: 'website',
    siteName: companyInfo.name,
  },
  twitter: {
    card: 'summary',
    title: `${companyInfo.name} — Connect With Us`,
    description: `Everything you need to connect with ${companyInfo.name}, in one place.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Inline script to prevent flash of wrong theme/language (FOUC).
 * Runs before React hydrates, reads localStorage or system preference,
 * and sets data-theme, lang, and dir on <html> immediately.
 */
const themeScript = `
(function() {
  try {
    var storedTheme = localStorage.getItem('royal-ink-theme');
    var theme = storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    var storedLang = localStorage.getItem('royal-ink-lang') || 'ar';
    document.documentElement.setAttribute('lang', storedLang);
    document.documentElement.setAttribute('dir', storedLang === 'ar' ? 'rtl' : 'ltr');
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${tajawal.variable} h-full antialiased`} data-theme="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
