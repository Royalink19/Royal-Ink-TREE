'use client';

import React, { useEffect, useState } from 'react';
import PrintingLoader from '@/components/PrintingLoader';

interface SplashLoaderProps {
  /**
   * Time in milliseconds before the splash loader begins fading out. Default 1200ms.
   */
  minDuration?: number;
  /**
   * Optional custom GIF path (e.g. '/loading.gif')
   */
  gifSrc?: string;
}

export default function SplashLoader({ minDuration = 1200, gifSrc }: SplashLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 600); // 600ms fade transition
      return () => clearTimeout(removeTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity duration-600 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={fading}
    >
      <PrintingLoader gifSrc={gifSrc} />
    </div>
  );
}
