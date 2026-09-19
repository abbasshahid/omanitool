'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'omnitool-theme';

/**
 * Runs before paint so the first frame is already the right theme. Kept in sync
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

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? 'system';
    setChoice(stored);
    setReady(true);

    // Follow the OS while the user is on "system".
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) === 'dark') return;
      applyTheme((localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? 'system');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function choose(next: ThemeChoice) {
    setChoice(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = ready && choice === value;
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
