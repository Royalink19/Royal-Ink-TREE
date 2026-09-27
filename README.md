# Royal Ink — Connect Hub (Link-in-Bio)

Official digital identity and Connect Hub for **Royal Ink (روايال إنك)**, a leading Algerian brand specializing in premium printing consumables, toner cartridges, and printer solutions.

---

## 🌟 Key Features

- **Branded Design System**: Cinematic dark theme with Royal Crimson (`#e30b17`) accents, obsidian surfaces, frosted glass, and light mode support.
- **Multilingual Support (i18n)**:
  - 🇸🇦 **Arabic (Default)** — with full RTL layout and typography powered by Google's **Tajawal** font.
  - 🇫🇷 **French** — complete LTR localization.
  - 🇬🇧 **English** — complete LTR localization.
  - Zero-flicker client-side language switching with `localStorage` persistence.
- **Custom Animated Printing Loader**:
  - High-precision SVG/CSS animated laser printer with paper feed and ink droplet emblem.
  - Next.js root loading boundary + splash preloader.
  - Support for custom printing GIFs.
- **Physical Touchpoint & Traffic Tracking**:
  - Architecture ready for Store Stands (QR & NFC), Shopfront Glass Stickers, Business Cards, and Social Media (Instagram, Facebook, TikTok).
  - Clean extraction of `?source=` query parameter without disrupting visitor UX.
- **Zero-Flicker Theme Engine**: Dark & Light mode toggle with immediate inline script evaluation to avoid flash of unstyled content (FOUC).
- **Production-Ready & Ultra-Fast**: Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Royalink19/Royal-Ink-TREE.git

# Navigate into project directory
cd Royal-Ink-TREE

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout, Google fonts (Tajawal + Geist), SEO metadata
│   ├── page.tsx               # Main entry point (ConnectHub)
│   ├── loading.tsx            # Next.js streaming loading screen (PrintingLoader)
│   ├── connect/page.tsx       # Canonical QR/NFC access route
│   └── globals.css            # Design tokens, color system, keyframe animations
├── components/
│   ├── BrandHeader.tsx        # Royal Ink official logo and localized tagline
│   ├── ConnectHub.tsx         # Main layout orchestrator
│   ├── ContactSection.tsx     # VIP contacts (Call & WhatsApp) + Store Google Maps
│   ├── LanguageProvider.tsx   # Multilingual context (ar, fr, en)
│   ├── LanguageToggle.tsx     # Language switcher
│   ├── LinkButton.tsx         # Reusable link card with hover micro-interactions
│   ├── PrintingLoader.tsx     # Animated SVG/CSS Royal Ink printing machine
│   ├── ShopSection.tsx        # Official Online Store, Ouedkniss, ASBBAB
│   ├── SocialLinks.tsx        # Instagram, Facebook, TikTok
│   ├── SplashLoader.tsx       # Initial page load splash screen
│   ├── ThemeProvider.tsx      # Dark / Light theme provider
│   ├── ThemeToggle.tsx        # Theme toggle button
│   ├── TrackingProvider.tsx   # Analytics & page view tracking
│   └── WebsiteLinks.tsx       # Cinematic Official Website hero card
├── lib/
│   ├── i18n.ts                # Translations dictionary (ar, fr, en)
│   ├── links.ts               # Centralized company data, links, contact info
│   └── tracking.ts            # Traffic source tracking & event dispatcher
public/
├── logo.svg                   # Royal Ink official brand logo
├── store-icon.png             # Official Royal Ink store emblem
├── website-bg.jpg             # Branded desk background for website card
├── asbbab-icon.png            # ASBBAB marketplace icon
└── ouedkniss-icon.png         # Ouedkniss marketplace icon
```

---

## 📍 Contact & Company Information

- **Brand**: Royal Ink (روايال إنك)
- **Address**: MARKET Dubai, El-Eulma 19600, W. Sétif, Algeria
- **Location**: [Google Maps](https://maps.app.goo.gl/qBg9QfCtsHPYpDuZ6)
- **Email**: royalink.support@gmail.com
- **Representatives**:
  - Mr. Ammar: `+213 550 89 94 84`
  - Mr. Fstouh: `+213 666 50 99 41`

---

## 📄 License

All rights reserved © Royal Ink.
