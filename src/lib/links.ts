/**
 * Royal Ink Connect Hub — Centralized Link Configuration
 * ========================================================
 * All company links, contact details, and social media URLs
 * are defined here. Update these values to change them across
 * the entire application.
 *
 * PLACEHOLDER VALUES are marked with comments.
 * Replace them with actual company information before deployment.
 */

export interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  category: 'primary' | 'website' | 'shop' | 'social' | 'contact';
  /** Optional: override URL per traffic source */
  sourceUrls?: Record<string, string>;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  address?: string;
  city?: string;
  country?: string;
  mapsUrl?: string;
}

// ─── Company Information ────────────────────────────────────
export const companyInfo: CompanyInfo = {
  name: 'Royal Ink',
  tagline: 'Exceed Your Vision',
  description:
    'Premium printing consumables, toner cartridges, and printer solutions in Algeria. Quality and excellence for all your printing needs.',
  address: 'MARKET Dubai, El-Eulma 19600',
  city: 'W. Sétif',
  country: 'Algeria',
  mapsUrl: 'https://maps.app.goo.gl/qBg9QfCtsHPYpDuZ6',
};

// ─── Contact Persons ────────────────────────────────────────
export interface ContactPerson {
  name: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
}

export const contactPersons: ContactPerson[] = [
  {
    name: 'Mr. Ammar',
    phoneDisplay: '+213 550 89 94 84',
    phoneRaw: '+213550899484',
    whatsappNumber: '213550899484',
  },
  {
    name: 'Mr. Fstouh',
    phoneDisplay: '+213 666 50 99 41',
    phoneRaw: '+213666509941',
    whatsappNumber: '213666509941',
  },
];

// ─── Phone Numbers (backward compatibility) ─────────────────
export const phoneNumbers = {
  primary: '+213550899484',
  secondary: '+213666509941',
};

// ─── WhatsApp ───────────────────────────────────────────────
export const whatsapp = {
  number: '213550899484',
  message: 'Hello! I am contacting you via Royal Ink Connect Hub.',
  get url() {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(this.message)}`;
  },
};

// ─── Email ──────────────────────────────────────────────────
export const email = {
  primary: 'royalink.support@gmail.com',
  subject: 'Inquiry from Connect Hub',
};

// ─── Links Configuration ────────────────────────────────────
export const links: LinkItem[] = [
  // ── Primary Actions ──
  {
    id: 'call',
    title: 'Call Us',
    description: 'Speak with our team directly',
    url: `tel:${phoneNumbers.primary}`,
    icon: 'phone',
    category: 'primary',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Message us instantly',
    url: whatsapp.url,
    icon: 'whatsapp',
    category: 'primary',
  },

  // ── Websites ──
  {
    id: 'website',
    title: 'Official Website',
    description: 'Discover Royal Ink',
    url: 'https://royal-ink.netlify.app',
    icon: 'favicon',
    category: 'website',
  },
  {
    id: 'find-us',
    title: 'Points of Sale',
    description: 'Store locator & map',
    url: 'https://royal-ink.netlify.app/find-us',
    icon: 'map-pin',
    category: 'website',
  },
  {
    id: 'compatibility',
    title: 'Compatibility',
    description: 'Find toner & printer',
    url: 'https://royal-ink.netlify.app/compatibility',
    icon: 'printer',
    category: 'website',
  },
  // ── Shop From Us ──
  {
    id: 'store',
    title: 'Official Online Store',
    description: 'Shop directly from our official store',
    url: 'https://store.royalink.com', // PLACEHOLDER — replace with actual store URL
    icon: 'store',
    category: 'shop',
  },
  {
    id: 'ouedkniss',
    title: 'Ouedkniss Store',
    description: 'Browse our official store on Ouedkniss',
    url: 'https://www.ouedkniss.com/store/royal-ink', // PLACEHOLDER — replace with actual Ouedkniss store URL
    icon: 'ouedkniss',
    category: 'shop',
  },
  {
    id: 'asbbab',
    title: 'ASBBAB Marketplace',
    description: "Shop via Algeria's wholesale & retail marketplace",
    url: 'https://asbbab.com/fr',
    icon: 'asbbab',
    category: 'shop',
  },

  // ── Social Media ──
  {
    id: 'instagram',
    title: 'Instagram',
    description: '@royalink',
    url: 'https://instagram.com/royalink', // PLACEHOLDER — replace with actual Instagram URL
    icon: 'instagram',
    category: 'social',
  },
  {
    id: 'facebook',
    title: 'Facebook',
    description: 'Royal Ink',
    url: 'https://facebook.com/royalink', // PLACEHOLDER — replace with actual Facebook URL
    icon: 'facebook',
    category: 'social',
  },

  // ── Contact ──
  {
    id: 'email',
    title: 'Email Us',
    description: email.primary,
    url: `mailto:${email.primary}?subject=${encodeURIComponent(email.subject)}`,
    icon: 'mail',
    category: 'contact',
  },
  {
    id: 'location',
    title: 'Visit Our Store',
    description: `${companyInfo.address}, ${companyInfo.city}`,
    url: companyInfo.mapsUrl || 'https://maps.app.goo.gl/qBg9QfCtsHPYpDuZ6',
    icon: 'map-pin',
    category: 'contact',
  },
];

// ─── Helper Functions ───────────────────────────────────────

/** Get links filtered by category */
export function getLinksByCategory(category: LinkItem['category']): LinkItem[] {
  return links.filter((link) => link.category === category);
}

/** Get a specific link by ID */
export function getLinkById(id: string): LinkItem | undefined {
  return links.find((link) => link.id === id);
}

/** Get the URL for a link, optionally adjusted for a traffic source */
export function getLinkUrl(link: LinkItem, source?: string): string {
  if (source && link.sourceUrls?.[source]) {
    return link.sourceUrls[source];
  }
  return link.url;
}
