/**
 * Consent state, shared by the cookie banner and every ad slot.
 *
 * The previous banner recorded a choice and reloaded, but the AdSense script
 * was loaded unconditionally in the document head — so declining changed
 * nothing. Here the stored choice is the single gate: the script is only
 * injected once advertising consent exists, and revoking it stops future
 * loads. Google Consent Mode v2 signals are sent alongside, defaulting to
 * denied before any choice is made.
 */

export const CONSENT_KEY = 'omnitool-gdpr-consent';

export interface ConsentState {
  essential: true;
  analytics: boolean;
  advertising: boolean;
}

export const DENIED: ConsentState = { essential: true, analytics: false, advertising: false };
export const GRANTED: ConsentState = { essential: true, analytics: true, advertising: true };

type Listener = (state: ConsentState | null) => void;
const listeners = new Set<Listener>();

/*
 * The snapshot is cached against the raw stored string. useSyncExternalStore
 * compares snapshots by identity, so handing it a freshly parsed object on
 * every read would re-render forever.
 */
let cachedRaw: string | null = null;
let cachedState: ConsentState | null = null;

/** null means the visitor has not chosen yet, which is not the same as denial. */
export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw === cachedRaw) return cachedState;

    cachedRaw = raw;
    if (!raw) {
      cachedState = null;
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    cachedState = {
      essential: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
    };
    return cachedState;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  pushConsentMode(state);
  for (const listener of listeners) listener(state);
}

export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // As above.
  }
  for (const listener of listeners) listener(null);
}

export function subscribeToConsent(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const adsAllowed = (state: ConsentState | null) => state?.advertising === true;

/* ------------------------------------------------------------------ gtag */

type GtagArgs = [string, string, Record<string, string | number>];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Runs before any Google tag, denying every storage type until the visitor
 * chooses. Injected in the document head so it beats the AdSense loader.
 */
export const consentModeBootScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{
  var s=localStorage.getItem('${CONSENT_KEY}');
  if(s){
    var c=JSON.parse(s);
    gtag('consent','update',{
      ad_storage:c.advertising?'granted':'denied',
      ad_user_data:c.advertising?'granted':'denied',
      ad_personalization:c.advertising?'granted':'denied',
      analytics_storage:c.analytics?'granted':'denied'
    });
  }
}catch(e){}
`.trim();

function pushConsentMode(state: ConsentState) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const ads = state.advertising ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: state.analytics ? 'granted' : 'denied',
  });
}
