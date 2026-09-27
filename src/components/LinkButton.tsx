'use client';

import { type ReactNode } from 'react';
import { trackLinkClick, type TrafficSource } from '@/lib/tracking';

interface LinkButtonProps {
  href: string;
  linkId: string;
  source: TrafficSource;
  icon: ReactNode;
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  showArrow?: boolean;
  external?: boolean;
}

export default function LinkButton({
  href,
  linkId,
  source,
  icon,
  title,
  description,
  variant = 'secondary',
  showArrow = false,
  external = true,
}: LinkButtonProps) {
  const handleClick = () => {
    trackLinkClick(source, linkId, href);
  };

  const baseClasses =
    'group relative flex items-center gap-4 w-full px-5 py-4 rounded-lg transition-all duration-200 ease-out text-start rtl:text-right focus-visible:outline-2 focus-visible:outline-brand-red';

  const variantClasses = {
    primary:
      'bg-brand-red hover:bg-accent-hover text-white shadow-sm hover:shadow-md hover:shadow-brand-red/10 active:scale-[0.98]',
    secondary:
      'bg-surface-elevated border border-surface-border hover:border-brand-red/20 text-foreground hover:bg-surface hover:shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-foreground active:scale-[0.98]',
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...(external && !href.startsWith('tel:') && !href.startsWith('mailto:')
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {/* Icon */}
      <span
        className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-md transition-colors duration-200 ${
          variant === 'primary' ? 'bg-white/15' : ''
        }`}
      >
        {icon}
      </span>

      {/* Text */}
      <span className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium leading-tight truncate">{title}</span>
        {description && (
          <span
            className={`text-xs mt-0.5 truncate ${
              variant === 'primary' ? 'text-white' : 'text-text-tertiary'
            }`}
          >
            {description}
          </span>
        )}
      </span>

      {/* Arrow */}
      {showArrow && (
        <span
          className={`shrink-0 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 ${
            variant === 'primary' ? 'text-white' : 'text-text-tertiary'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </a>
  );
}
