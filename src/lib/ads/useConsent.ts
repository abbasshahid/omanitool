'use client';

import { useSyncExternalStore } from 'react';
import { readConsent, subscribeToConsent, type ConsentState } from './consent';

function subscribe(onChange: () => void) {
  const unsubscribe = subscribeToConsent(onChange);
  // A choice made in another tab should take effect here too.
  window.addEventListener('storage', onChange);
  return () => {
    unsubscribe();
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;

/**
 * Consent as React state.
 *
 * The stored choice lives outside React, so it is read through
 * useSyncExternalStore rather than copied into state in an effect. That keeps
 * the server render and the first client render agreeing on "no choice yet",
 * which matters because ads must not render during hydration.
 */
export function useConsent(): ConsentState | null {
  return useSyncExternalStore(subscribe, readConsent, serverSnapshot);
}
