import fs from 'fs';
import path from 'path';

export interface AnalyticsRecord {
  totalVisits: number;
  totalClicks: number;
  sources: Record<
    string,
    {
      label: string;
      category: 'stand' | 'glass' | 'nfc' | 'card' | 'social' | 'direct' | 'other';
      views: number;
      clicks: number;
      lastActive: string | null;
    }
  >;
  actions: Record<string, number>;
  recentEvents: Array<{
    id: string;
    type: 'page_view' | 'link_click';
    source: string;
    linkId?: string;
    timestamp: string;
  }>;
}

const DEFAULT_TOUCHPOINTS: AnalyticsRecord['sources'] = {
  stand_qr: {
    label: 'Store Stand (QR Code)',
    category: 'stand',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  stand_nfc: {
    label: 'Store Stand (NFC Tap)',
    category: 'nfc',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  glass_front: {
    label: 'Shopfront Glass Window (QR)',
    category: 'glass',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  card_ammar: {
    label: 'Business Card (Mr. Ammar)',
    category: 'card',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  card_fstouh: {
    label: 'Business Card (Mr. Fstouh)',
    category: 'card',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  instagram: {
    label: 'Instagram Bio',
    category: 'social',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  facebook: {
    label: 'Facebook Page',
    category: 'social',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  tiktok: {
    label: 'TikTok Bio',
    category: 'social',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
  direct: {
    label: 'Direct / Unknown',
    category: 'direct',
    views: 0,
    clicks: 0,
    lastActive: null,
  },
};

function getStoragePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {}
  }
  return path.join(dataDir, 'analytics.json');
}

// In-memory fallback if file system write is restricted
let inMemoryData: AnalyticsRecord | null = null;

function getInitialData(): AnalyticsRecord {
  return {
    totalVisits: 0,
    totalClicks: 0,
    sources: { ...DEFAULT_TOUCHPOINTS },
    actions: {},
    recentEvents: [],
  };
}

export function readAnalytics(): AnalyticsRecord {
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as AnalyticsRecord;
      // Merge with default sources in case new ones were added
      parsed.sources = { ...DEFAULT_TOUCHPOINTS, ...parsed.sources };
      inMemoryData = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading analytics file:', err);
  }

  if (!inMemoryData) {
    inMemoryData = getInitialData();
  }
  return inMemoryData;
}

export function writeAnalytics(data: AnalyticsRecord): void {
  inMemoryData = data;
  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing analytics file:', err);
  }
}

export function recordEvent(event: {
  type: 'page_view' | 'link_click';
  source: string;
  linkId?: string;
  timestamp?: string;
}): AnalyticsRecord {
  const data = readAnalytics();
  const rawSource = (event.source || 'direct').trim().toLowerCase();
  const timestamp = event.timestamp || new Date().toISOString();

  // Match or create source
  if (!data.sources[rawSource]) {
    let category: AnalyticsRecord['sources'][string]['category'] = 'other';
    if (rawSource.includes('stand')) category = rawSource.includes('nfc') ? 'nfc' : 'stand';
    else if (rawSource.includes('glass')) category = 'glass';
    else if (rawSource.includes('nfc')) category = 'nfc';
    else if (rawSource.includes('card')) category = 'card';
    else if (['instagram', 'facebook', 'tiktok'].some((s) => rawSource.includes(s))) category = 'social';

    data.sources[rawSource] = {
      label: rawSource.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      category,
      views: 0,
      clicks: 0,
      lastActive: timestamp,
    };
  }

  const currentSource = data.sources[rawSource];
  currentSource.lastActive = timestamp;

  if (event.type === 'page_view') {
    data.totalVisits += 1;
    currentSource.views += 1;
  } else if (event.type === 'link_click') {
    data.totalClicks += 1;
    currentSource.clicks += 1;
    if (event.linkId) {
      data.actions[event.linkId] = (data.actions[event.linkId] || 0) + 1;
    }
  }

  // Prepend to recent events (keep latest 40)
  data.recentEvents.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: event.type,
    source: rawSource,
    linkId: event.linkId,
    timestamp,
  });

  if (data.recentEvents.length > 40) {
    data.recentEvents = data.recentEvents.slice(0, 40);
  }

  writeAnalytics(data);
  return data;
}

export function resetAnalytics(): AnalyticsRecord {
  const fresh = getInitialData();
  writeAnalytics(fresh);
  return fresh;
}
