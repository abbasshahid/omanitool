import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  adsAllowed,
  clearConsent,
  CONSENT_KEY,
  consentModeBootScript,
  DENIED,
  GRANTED,
  readConsent,
  subscribeToConsent,
  writeConsent,
} from './consent';

/** Minimal localStorage, so these tests do not need a DOM environment. */
function installStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  };
  vi.stubGlobal('window', { localStorage });
  vi.stubGlobal('localStorage', localStorage);
  return store;
}

describe('consent store', () => {
  let store: Map<string, string>;

  beforeEach(() => {
    vi.unstubAllGlobals();
    store = installStorage();
  });

  it('reports no choice before the visitor answers', () => {
    // null is "not asked yet", which is different from a recorded refusal.
    expect(readConsent()).toBeNull();
  });

  it('does not allow ads before a choice is made', () => {
    expect(adsAllowed(readConsent())).toBe(false);
  });

  it('does not allow ads after a refusal', () => {
    writeConsent(DENIED);
    expect(adsAllowed(readConsent())).toBe(false);
  });

  it('allows ads only once advertising is granted', () => {
    writeConsent(GRANTED);
    expect(adsAllowed(readConsent())).toBe(true);
  });

  it('treats analytics and advertising separately', () => {
    writeConsent({ essential: true, analytics: true, advertising: false });
    const state = readConsent();
    expect(state?.analytics).toBe(true);
    expect(adsAllowed(state)).toBe(false);
  });

  it('returns a stable snapshot so useSyncExternalStore cannot loop', () => {
    writeConsent(GRANTED);
    expect(readConsent()).toBe(readConsent());
  });

  it('returns a new snapshot once the stored value changes', () => {
    writeConsent(GRANTED);
    const before = readConsent();
    writeConsent(DENIED);
    expect(readConsent()).not.toBe(before);
    expect(adsAllowed(readConsent())).toBe(false);
  });

  it('notifies subscribers, so ads appear without a reload', () => {
    const seen: (boolean | null)[] = [];
    const stop = subscribeToConsent((state) => seen.push(state && state.advertising));
    writeConsent(GRANTED);
    writeConsent(DENIED);
    stop();
    writeConsent(GRANTED);
    expect(seen).toEqual([true, false]);
  });

  it('clearing the choice reopens the question', () => {
    writeConsent(GRANTED);
    clearConsent();
    expect(readConsent()).toBeNull();
    expect(adsAllowed(readConsent())).toBe(false);
  });

  it('survives corrupt stored data without granting anything', () => {
    store.set(CONSENT_KEY, '{not json');
    expect(readConsent()).toBeNull();
  });

  it('never grants from a partial record', () => {
    store.set(CONSENT_KEY, JSON.stringify({ essential: true }));
    expect(adsAllowed(readConsent())).toBe(false);
  });
});

describe('consent mode bootstrap', () => {
  it('denies every storage type by default', () => {
    for (const signal of [
      'ad_storage',
      'ad_user_data',
      'ad_personalization',
      'analytics_storage',
    ]) {
      expect(consentModeBootScript).toContain(`${signal}:'denied'`);
    }
  });

  it('declares the defaults before anything can update them', () => {
    const defaults = consentModeBootScript.indexOf("'default'");
    const update = consentModeBootScript.indexOf("'update'");
    expect(defaults).toBeGreaterThan(-1);
    expect(defaults).toBeLessThan(update);
  });
});
