'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Cookie, Settings2 } from 'lucide-react';
import { DENIED, GRANTED, writeConsent } from '@/lib/ads/consent';
import { useConsent } from '@/lib/ads/useConsent';
import { adsConfigured } from '@/lib/ads/config';

/**
 * Cookie choice.
 *
 * The banner is the real gate, not a formality: `AdScript` watches the stored
 * value and only then requests the AdSense library, so declining means no ad
 * script and no ad cookie. Saving no longer reloads the page — the choice
 * propagates through the consent store, so ads appear or vanish in place.
 *
 * Note for EEA traffic: serving personalised ads there also requires a Google-
 * certified CMP. This banner handles the technical gating correctly, but the
 * certified message should be switched on in AdSense under Privacy & messaging.
 */
export default function GDPRConsent() {
  const choice = useConsent();
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ analytics: true, advertising: true });

  // The banner is client-only: the server cannot know the stored choice, so
  // rendering it before hydration would flash it at visitors who already chose.
  // Read as an external store rather than set in an effect, which keeps the
  // server and first client render identical.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Nothing to ask until the client has read storage, and nothing to ask again
  // once a choice exists. Cookie settings in the footer reopen it.
  if (!hydrated || choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[200] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-pop)]">
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-[var(--text-muted)]">
              <Cookie className="size-4" />
            </span>
            <div className="min-w-0">
              <h2 id="consent-title" className="text-sm font-bold">
                Cookies keep these tools free
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-muted)]">
                Your files are never uploaded — that does not change either way. This is only about
                advertising and analytics cookies, which pay for the hosting. Decline and no ad
                script is loaded at all.{' '}
                <Link href="/privacy" className="font-medium text-[var(--signal)] hover:underline">
                  Privacy policy
                </Link>
                .
              </p>
            </div>
          </div>

          {expanded && (
            <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              <Row
                label="Essential"
                hint="Remembers your theme and this choice. Always on."
                checked
                disabled
              />
              <Row
                label="Analytics"
                hint="Anonymous page counts, so we know which tools to build next."
                checked={draft.analytics}
                onChange={(analytics) => setDraft((d) => ({ ...d, analytics }))}
              />
              {adsConfigured() && (
                <Row
                  label="Advertising"
                  hint="Lets Google show ads on the page. Off means the script never loads."
                  checked={draft.advertising}
                  onChange={(advertising) => setDraft((d) => ({ ...d, advertising }))}
                />
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            {!expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="btn-ghost text-[13px]"
              >
                <Settings2 className="size-3.5" />
                Choose
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  writeConsent({
                    essential: true,
                    analytics: draft.analytics,
                    advertising: draft.advertising,
                  })
                }
                className="btn-ghost text-[13px]"
              >
                Save choices
              </button>
            )}
            <button
              type="button"
              onClick={() => writeConsent(DENIED)}
              className="btn-secondary text-[13px]"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => writeConsent(GRANTED)}
              className="btn-primary text-[13px]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] px-3 py-2.5 ${
        disabled ? 'opacity-60' : 'cursor-pointer'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[var(--signal)]"
      />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-[var(--text)]">{label}</span>
        <span className="block text-xs text-[var(--text-muted)]">{hint}</span>
      </span>
    </label>
  );
}
