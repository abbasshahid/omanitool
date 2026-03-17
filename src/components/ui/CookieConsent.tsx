'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('omnitool-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('omnitool-cookie-consent', 'accepted');
    // Here we can trigger any logic that depends on consent, 
    // though modern AdSense and Analytics handle some of this automatically with 'consent mode'.
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('omnitool-cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] p-4 sm:p-6 lg:p-8 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-2xl shadow-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-opacity-95">
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-[var(--color-text-main)]">We value your privacy</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content and ads. By clicking "Accept All", you consent to our use of cookies. For more information, please read our <Link href="/privacy" className="text-indigo-500 hover:text-indigo-400 underline underline-offset-4">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleDecline}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors border border-[var(--color-border-base)] hover:bg-[var(--color-surface-base)]"
            >
              Reject Non-Essential
            </button>
            <button 
              onClick={handleAccept}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
