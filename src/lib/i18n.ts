/**
 * Royal Ink Connect Hub — Internationalization (i18n)
 * ========================================================
 * Supports Arabic (Default), French, and English.
 */

export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  header: {
    connectWithUs: string;
    tagline: string;
  };
  websites: {
    heading: string;
    officialWebsite: {
      title: string;
      description: string;
    };
    findUs: {
      title: string;
      description: string;
    };
    compatibility: {
      title: string;
      description: string;
    };
  };
  shop: {
    heading: string;
    officialStore: {
      title: string;
      description: string;
    };
    ouedkniss: {
      title: string;
      description: string;
    };
    asbbab: {
      title: string;
      description: string;
    };
  };
  social: {
    heading: string;
  };
  contact: {
    heading: string;
    emailUs: string;
    visitStore: string;
    openInMaps: string;
    address: string;
    persons: {
      ammar: string;
      fstouh: string;
    };
    whatsappMessage: string;
  };
  about: {
    heading: string;
    description: string;
  };
  footer: {
    rightsReserved: string;
    privacyPolicy: string;
    terms: string;
  };
  loading: {
    text: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    header: {
      connectWithUs: 'تواصل معنا',
      tagline: 'روايال إنك شريكك في توفير مستلزمات طباعة عالية الجودة ومتوافقة مع أبرز الطابعات العالمية.',
    },
    websites: {
      heading: 'الموقع الرسمي',
      officialWebsite: {
        title: 'الموقع الرسمي',
        description: 'اكتشف روايال إنك ومنتجاتنا',
      },
      findUs: {
        title: 'نقاط البيع',
        description: 'خريطة الموزعين المعتمدين',
      },
      compatibility: {
        title: 'توافق الطابعات',
        description: 'ابحث عن الحبر المناسب لطابعتك',
      },
    },
    shop: {
      heading: 'تسوق معنا',
      officialStore: {
        title: 'المتجر الإلكتروني الرسمي',
        description: 'تسوق مباشرة من متجرنا الرسمي',
      },
      ouedkniss: {
        title: 'متجر واد كنيس',
        description: 'تصفح متجرنا المعتمد على واد كنيس',
      },
      asbbab: {
        title: 'سوق أسباب',
        description: 'تسوق عبر منصة الجملة والتجزئة الجزائرية',
      },
    },
    social: {
      heading: 'تابعنا',
    },
    contact: {
      heading: 'معلومات الاتصال',
      emailUs: 'راسلنا عبر البريد الإلكتروني',
      visitStore: 'زيارة مقرنا',
      openInMaps: 'خرائط جوجل',
      address: 'سوق دبي، العلمة 19600، ولاية سطيف، الجزائر',
      persons: {
        ammar: 'السيد عمار',
        fstouh: 'السيد فتوح',
      },
      whatsappMessage: 'مرحباً، أتواصل معكم عبر صفحة روايال إنك.',
    },
    about: {
      heading: 'من نحن',
      description:
        'روايال إنك علامة جزائرية رائدة في مجال مستلزمات الطباعة، خراطيش الحبر والتونر، وحلول الطباعة المتقدمة. نحرص على تقديم أعلى معايير الجودة والابتكار لتلبية جميع احتياجاتكم عبر شبكة توزيع واسعة في كافة ولايات الوطن.',
    },
    footer: {
      rightsReserved: 'جميع الحقوق محفوظة.',
      privacyPolicy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
    loading: {
      text: 'جاري التحميل...',
    },
  },

  fr: {
    header: {
      connectWithUs: 'Connectez-vous avec nous',
      tagline: 'Votre partenaire pour des consommables d\'impression de haute qualité, compatibles avec les plus grandes marques.',
    },
    websites: {
      heading: 'Site Officiel',
      officialWebsite: {
        title: 'Site Officiel',
        description: 'Découvrez Royal Ink et nos solutions',
      },
      findUs: {
        title: 'Points de Vente',
        description: 'Carte des distributeurs agréés',
      },
      compatibility: {
        title: 'Compatibilité',
        description: 'Trouvez le toner & encre pour votre imprimante',
      },
    },
    shop: {
      heading: 'Achetez Chez Nous',
      officialStore: {
        title: 'Boutique Officielle',
        description: 'Commandez directement sur notre boutique',
      },
      ouedkniss: {
        title: 'Boutique Ouedkniss',
        description: 'Visitez notre boutique sur Ouedkniss',
      },
      asbbab: {
        title: 'Marketplace ASBBAB',
        description: 'Vente en gros et détail sur ASBBAB',
      },
    },
    social: {
      heading: 'Suivez-nous',
    },
    contact: {
      heading: 'Coordonnées de Contact',
      emailUs: 'Contactez-nous par e-mail',
      visitStore: 'Visitez Notre Magasin',
      openInMaps: 'Google Maps',
      address: 'MARKET Dubaï, El-Eulma 19600, W. Sétif, Algérie',
      persons: {
        ammar: 'M. Ammar',
        fstouh: 'M. Fstouh',
      },
      whatsappMessage: 'Bonjour, je vous contacte via Royal Ink Connect Hub.',
    },
    about: {
      heading: 'À Propos de Nous',
      description:
        'Royal Ink est une marque algérienne de référence dans le domaine des consommables d\'impression, cartouches de toner et encres. Nous nous engageons à offrir une qualité supérieure et un service d\'excellence à travers notre réseau national.',
    },
    footer: {
      rightsReserved: 'Tous droits réservés.',
      privacyPolicy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
    },
    loading: {
      text: 'Chargement en cours...',
    },
  },

  en: {
    header: {
      connectWithUs: 'Connect With Us',
      tagline: 'Your partner for premium printing supplies, fully compatible with the world\'s leading printer brands.',
    },
    websites: {
      heading: 'Official Website',
      officialWebsite: {
        title: 'Official Website',
        description: 'Discover Royal Ink',
      },
      findUs: {
        title: 'Points of Sale',
        description: 'Store locator & map',
      },
      compatibility: {
        title: 'Compatibility',
        description: 'Find compatible toner, printer, or ink',
      },
    },
    shop: {
      heading: 'Shop From Us',
      officialStore: {
        title: 'Official Online Store',
        description: 'Shop directly from our official store',
      },
      ouedkniss: {
        title: 'Ouedkniss Store',
        description: 'Browse our official store on Ouedkniss',
      },
      asbbab: {
        title: 'ASBBAB Marketplace',
        description: "Shop via Algeria's wholesale & retail marketplace",
      },
    },
    social: {
      heading: 'Follow Us',
    },
    contact: {
      heading: 'Contact Information',
      emailUs: 'Email Us',
      visitStore: 'Visit Our Store',
      openInMaps: 'Google Maps',
      address: 'MARKET Dubai, El-Eulma 19600, W. Sétif, Algeria',
      persons: {
        ammar: 'Mr Ammar',
        fstouh: 'Mr Fstouh',
      },
      whatsappMessage: 'Hello, I am contacting you via Royal Ink Connect Hub.',
    },
    about: {
      heading: 'About Us',
      description:
        'Royal Ink is a leading Algerian brand specializing in printing consumables, toner cartridges, and printer solutions. We are committed to delivering top-tier quality and excellence across our nationwide distribution network.',
    },
    footer: {
      rightsReserved: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    loading: {
      text: 'Loading...',
    },
  },
};
