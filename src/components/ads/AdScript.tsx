'use client';

import Script from 'next/script';
import { ADSENSE_CLIENT, adsConfigured } from '@/lib/ads/config';
import { adsAllowed } from '@/lib/ads/consent';
import { useConsent } from '@/lib/ads/useConsent';

/**
 * Loads the AdSense library, and only once the visitor has agreed to
 * advertising. Keeping the loader here rather than in the document head is
 * what makes "Do not consent" mean something: decline and the script is never
 * requested, so no ad cookie is ever set.
 */
export default function AdScript() {
  const consent = useConsent();

  if (!adsConfigured() || !adsAllowed(consent)) return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
