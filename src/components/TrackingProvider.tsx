'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTrafficSource, trackPageView } from '@/lib/tracking';

/**
 * Client component that reads the `?source=` query parameter
 * and triggers a page view tracking event.
 *
 * This component renders nothing — it exists solely for
 * analytics initialization.
 */
export default function TrackingProvider() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = getTrafficSource(searchParams);
    trackPageView(source);
  }, [searchParams]);

  return null;
}
