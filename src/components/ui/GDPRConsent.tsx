'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Settings, X, Check, AlertCircle } from 'lucide-react';

export default function GDPRConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    advertising: true,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('omnitool-gdpr-consent');
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem('omnitool-gdpr-consent', JSON.stringify(prefs));
    setIsVisible(false);
    setShowManage(false);
    // Reload to apply preferences choice to scripts if needed
    window.location.reload();
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, advertising: true });
  };

  const handleDeclineAll = () => {
    saveConsent({ essential: true, analytics: false, advertising: false });
  };

  const handleSaveSelected = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center p-4 sm:p-6 lg:p-8 pointer-events-none">
      <div className="w-full max-w-4xl bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto backdrop-blur-2xl bg-opacity-95 animate-in slide-in-from-bottom-10 duration-500">
        {!showManage ? (
          /* Main Consent View */
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">GDPR & Cookie Compliance</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                  We value your privacy. OmniTool uses cookies and external scripts to improve your experience, analyze site usage, and serve personalized content. Please choose how you want us to handle your data. Read our <Link href="/privacy" className="text-indigo-500 hover:text-indigo-400 font-semibold underline underline-offset-4">Privacy Policy</Link> for full transparency.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-base)]">
               <button 
                onClick={() => setShowManage(true)}
                className="w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all flex items-center justify-center gap-2 hover:bg-gray-800/50"
              >
                <Settings className="w-4 h-4" />
                Manage Options
              </button>
              <button 
                onClick={handleDeclineAll}
                className="w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all border border-[var(--color-border-base)] hover:bg-red-500/5 hover:border-red-500/20"
              >
                Do Not Consent
              </button>
              <button 
                onClick={handleAcceptAll}
                className="w-full md:w-auto px-10 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Consent All
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Settings View */
          <div className="p-6 md:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">Preference Management</h3>
              </div>
              <button onClick={() => setShowManage(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-4 rounded-2xl bg-gray-800/20 border border-[var(--color-border-base)] flex items-center justify-between opacity-80">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[var(--color-text-main)]">Essential (Strictly Necessary)</span>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Required for the site to function and store your logic.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-gray-700 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Always Active</div>
              </div>

              {/* Analytics */}
              <label className="p-4 rounded-2xl bg-gray-800/20 border border-[var(--color-border-base)] flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[var(--color-text-main)]">Performance & Analytics</span>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Helps us understand how visitors use OmniTool.</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                />
              </label>

              {/* Advertising */}
              <label className="p-4 rounded-2xl bg-gray-800/20 border border-[var(--color-border-base)] flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[var(--color-text-main)]">Advertising & Personalization</span>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Used to provide relevant content and support free tools.</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                  checked={preferences.advertising}
                  onChange={(e) => setPreferences({...preferences, advertising: e.target.checked})}
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border-base)]">
              <div className="flex items-center gap-2 text-amber-500 text-xs">
                <AlertCircle className="w-4 h-4" />
                Reloading applies settings
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowManage(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSelected}
                  className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Choices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
