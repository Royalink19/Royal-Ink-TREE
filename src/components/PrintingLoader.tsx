'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

interface PrintingLoaderProps {
  /**
   * Optional custom GIF path (e.g., '/loading.gif').
   * If provided, renders the GIF with a Royal Ink branded frame.
   */
  gifSrc?: string;
  /**
   * Optional text override. If not provided, uses localized i18n text.
   */
  text?: string;
  /**
   * If true, renders a more compact version suitable for inline loaders.
   */
  compact?: boolean;
  /**
   * Whether to display the text label beneath the animation.
   */
  showText?: boolean;
  className?: string;
}

export default function PrintingLoader({
  gifSrc,
  text,
  compact = false,
  showText = true,
  className = '',
}: PrintingLoaderProps) {
  const { t } = useLanguage();
  const loadingLabel = text || t.loading?.text || 'جاري التحميل...';

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      role="status"
      aria-live="polite"
      aria-label={loadingLabel}
    >
      {/* If a custom GIF is provided, render it inside a themed container */}
      {gifSrc ? (
        <div className="relative flex items-center justify-center p-3 rounded-2xl bg-surface-elevated/70 border border-surface-border backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 rounded-2xl bg-brand-red/10 blur-xl pointer-events-none" />
          <Image
            src={gifSrc}
            alt="Printing Loader"
            width={compact ? 90 : 160}
            height={compact ? 90 : 160}
            className="relative z-10 object-contain rounded-lg"
            unoptimized
          />
        </div>
      ) : (
        /* Royal Ink Signature Vector/CSS Animated Printer */
        <div className={`relative flex flex-col items-center justify-center ${compact ? 'scale-75' : ''}`}>
          {/* Ambient Royal Red Backdrop Glow */}
          <div
            className="absolute w-44 h-32 rounded-full blur-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(227, 11, 23, 0.28) 0%, transparent 70%)',
            }}
          />

          {/* Printer Assembly */}
          <div className="relative w-40 h-28 flex items-center justify-center">
            {/* Top Paper In-feed Sheet (Feeding into printer top) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-neutral-200/90 dark:bg-neutral-200 rounded-t-sm shadow-sm opacity-70 z-0">
              <div className="w-full h-1 bg-neutral-300 dark:bg-neutral-300 mt-1" />
            </div>

            {/* Printer Main Chassis */}
            <div className="relative z-10 w-36 h-20 bg-gradient-to-b from-[#242422] to-[#121211] rounded-2xl border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
              {/* Top Accent Trim & LED */}
              <div className="flex items-center justify-between px-3 pt-2">
                {/* Brand Indicator Light */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e30b17] animate-led-blink" />
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                </div>
                {/* Micro Brand Mark */}
                <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                  ROYAL INK
                </span>
              </div>

              {/* Printer Output Slot */}
              <div className="relative mt-2.5 mx-auto w-28 h-6 bg-[#090908] rounded-md border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Ejecting Printed Paper Sheet with Animation */}
                <div className="absolute w-20 bg-white rounded-b-sm shadow-md animate-paper-feed flex flex-col items-center py-1 px-1.5">
                  {/* Printed Red Ink Droplet Symbol */}
                  <div className="w-3.5 h-3.5 flex items-center justify-center my-0.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#e30b17] animate-ink-drop">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  {/* Faint printed line marks */}
                  <div className="w-12 h-0.5 bg-neutral-300 rounded mb-0.5" />
                  <div className="w-8 h-0.5 bg-neutral-200 rounded" />
                </div>

                {/* Laser / Printhead Scanning Beam */}
                <div
                  className="absolute inset-y-0 w-8 animate-laser-scan pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(227, 11, 23, 0.9), transparent)',
                    boxShadow: '0 0 12px rgba(227, 11, 23, 0.8)',
                  }}
                />
              </div>

              {/* Lower Bevel / Output Tray Lip */}
              <div className="mt-auto h-2 bg-[#171716] border-t border-white/5 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Bottom Output Tray Shelf */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-2.5 bg-[#1a1a19] rounded-b-lg border-b border-white/10 shadow-lg z-0" />
          </div>
        </div>
      )}

      {/* Progress & Label Section */}
      {showText && (
        <div className="mt-5 flex flex-col items-center gap-2.5">
          {/* Glowing Animated Loading Bar */}
          <div className="relative w-36 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 w-16 rounded-full animate-progress-indeterminate"
              style={{
                background: 'linear-gradient(90deg, transparent, #e30b17, #ff3b47, transparent)',
                boxShadow: '0 0 10px #e30b17',
              }}
            />
          </div>

          {/* Localized Loading Text with gentle pulse */}
          <span className="text-xs font-medium text-white/70 tracking-wide font-sans animate-pulse">
            {loadingLabel}
          </span>
        </div>
      )}
    </div>
  );
}
