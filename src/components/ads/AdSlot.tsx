'use client';

import { useEffect, useRef } from 'react';
import {
  ADSENSE_CLIENT,
  AD_SIZES,
  AD_SLOTS,
  slotConfigured,
  type AdPlacement,
} from '@/lib/ads/config';
import { adsAllowed } from '@/lib/ads/consent';
import { useConsent } from '@/lib/ads/useConsent';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  /** Hidden below `lg`; used for the tool-page sidebar. */
  desktopOnly?: boolean;
}

/**
 * One ad unit.
 *
 * Renders nothing at all unless a publisher id, a slot id and advertising
 * consent are all present — so an unconfigured or declining visitor sees clean
 * page, not a placeholder box. The reserved height is applied before the ad
 * arrives so surrounding content never jumps.
 */
export default function AdSlot({ placement, className = '', desktopOnly = false }: AdSlotProps) {
  const consent = useConsent();
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const active = slotConfigured(placement) && adsAllowed(consent);

  useEffect(() => {
    if (!active || pushed.current || !insRef.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // A blocked or not-yet-loaded library must never break the page.
    }
  }, [active]);

  if (!active) return null;

  const size = AD_SIZES[placement];

  return (
    <aside
      // Announced as an advert to assistive technology, and skippable.
      aria-label="Advertisement"
      className={`${desktopOnly ? 'hidden lg:block' : ''} ${className}`}
    >
      <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
        Advertisement
      </p>
      <div
        className="mx-auto overflow-hidden"
        // Height is reserved up front to keep Cumulative Layout Shift at zero.
        style={{ minHeight: size.desktop, ['--ad-h-mobile' as string]: `${size.mobile}px` }}
      >
        <ins
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={AD_SLOTS[placement]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
