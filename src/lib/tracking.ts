/**
 * Royal Ink Connect Hub — Traffic Source Tracking Utility
 * ========================================================
 * Reads the `source` query parameter from the URL and provides
 * a clean API for analytics integration.
 *
 * Architecture is designed so that analytics providers
 * (Google Analytics, Plausible, Mixpanel, etc.) can be
 * plugged in later without modifying component code.
 */

// ─── Known Traffic Sources ─────────────────────────────────
export type TrafficSource =
  | 'stand_reception_qr'
  | 'stand_reception_nfc'
  | 'showroom_qr'
  | 'showroom_nfc'
  | 'glass_front_qr'
  | 'glass_front_nfc'
  | 'business_card_sales'
  | 'business_card'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'stand_qr'
  | 'stand_nfc'
  | 'stand'
  | 'glass'
  | 'nfc'
  | 'card'
  | 'qr'
  | 'direct'
  | string; // Allow custom sources

export interface TrackingEvent {
  /** The type of event */
  type: 'page_view' | 'link_click' | 'conversion';
  /** The traffic source that brought the user to the page */
  source: TrafficSource;
  /** The ID of the link that was clicked (for link_click events) */
  linkId?: string;
  /** The URL that was navigated to */
  url?: string;
  /** ISO timestamp of the event */
  timestamp: string;
  /** Any additional metadata */
  metadata?: Record<string, string>;
}

// ─── Source Extraction ──────────────────────────────────────

/**
 * Extracts the traffic source from a URL search params string.
 * Returns 'direct' if no source parameter is present.
 */
export function getTrafficSource(searchParams?: URLSearchParams | string): TrafficSource {
  if (!searchParams) return 'direct';

  const params =
    typeof searchParams === 'string' ? new URLSearchParams(searchParams) : searchParams;

  return params.get('source') || 'direct';
}

/**
 * Extracts the traffic source from the current page URL.
 * Safe to call on both server and client.
 */
export function getTrafficSourceFromUrl(url?: string): TrafficSource {
  if (!url) return 'direct';

  try {
    const parsedUrl = new URL(url, 'https://placeholder.com');
    return getTrafficSource(parsedUrl.searchParams);
  } catch {
    return 'direct';
  }
}

// ─── Event Tracking ─────────────────────────────────────────

/**
 * Creates a tracking event object.
 * This function does NOT send data anywhere — it prepares the event
 * for whatever analytics provider you integrate later.
 */
export function createTrackingEvent(
  type: TrackingEvent['type'],
  source: TrafficSource,
  options?: { linkId?: string; url?: string; metadata?: Record<string, string> }
): TrackingEvent {
  return {
    type,
    source,
    linkId: options?.linkId,
    url: options?.url,
    timestamp: new Date().toISOString(),
    metadata: options?.metadata,
  };
}

/**
 * Track a page view event.
 * INTEGRATION POINT: Replace the console.log with your analytics call.
 *
 * Example integrations:
 *   - Google Analytics: gtag('event', 'page_view', { source })
 *   - Plausible: plausible('pageview', { props: { source } })
 *   - Mixpanel: mixpanel.track('Page View', { source })
 */
export function trackPageView(source: TrafficSource): void {
  const event = createTrackingEvent('page_view', source);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Connect Hub] Page View:', event);
  }

  // Send to internal analytics API
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {});
    } catch {}
  }
}

/**
 * Track a link click event.
 */
export function trackLinkClick(source: TrafficSource, linkId: string, url: string): void {
  const event = createTrackingEvent('link_click', source, { linkId, url });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Connect Hub] Link Click:', event);
  }

  // Send to internal analytics API (sendBeacon ensures completion during navigation)
  if (typeof window !== 'undefined') {
    try {
      const payload = JSON.stringify(event);
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', payload);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }
}
