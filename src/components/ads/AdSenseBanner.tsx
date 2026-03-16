'use client';

import { useEffect, useState } from 'react';

interface AdSenseBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
  className?: string;
}

export default function AdSenseBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true',
  className = '',
}: AdSenseBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Only load if not already loaded in development (strict mode double mount safety)
        if (!isLoaded) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      }
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, [isLoaded]);

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center relative ${className}`}>
      {/* Fallback/Placeholder while ad loads or in dev environment */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl text-[var(--color-text-muted)] text-sm">
          <span>Advertisement</span>
          <span className="text-xs opacity-50 text-center px-4 mt-1">Upgrade to Pro to remove ads</span>
        </div>
      )}
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}
