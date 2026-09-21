'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'omnitool-theme';

/**
 * Runs before paint so the first frame is already the right theme. Kept in step
 * with `applyTheme` below — both resolve "system" the same way.
 */
export const themeBootScript = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}')||'system';var d=c==='dark'||(c==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

function applyTheme(choice: ThemeChoice) {
  const dark =
    choice === 'dark' ||
    (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

/**
 * The stored choice is external state, not React state, so it is read through
 * useSyncExternalStore. That keeps the server render ("system") and the client
 * consistent, and lets a change in one tab update every other open tab.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onMediaChange = () => {
    if (read() === 'system') applyTheme('system');
  };
  media.addEventListener('change', onMediaChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
    media.removeEventListener('change', onMediaChange);
  };
}

function read(): ThemeChoice {
  try {
    return (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? 'system';
  } catch {
    // Private browsing or blocked storage: fall back to following the OS.
    return 'system';
  }
}

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

export default function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, read, () => 'system' as ThemeChoice);

  const choose = useCallback((next: ThemeChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable; the theme still applies for this page view.
    }
    applyTheme(next);
    for (const listener of listeners) listener();
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = choice === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => choose(value)}
            className={`grid size-7 place-items-center rounded-full transition-colors ${
              active
                ? 'bg-[var(--surface-3)] text-[var(--text)]'
                : 'text-[var(--text-subtle)] hover:text-[var(--text)]'
            }`}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
