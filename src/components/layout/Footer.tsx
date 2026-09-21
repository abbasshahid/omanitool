'use client';

import Link from 'next/link';
import { getActiveCategories, POPULAR_TOOLS, toolPath, TOOLS } from '@/lib/tools/registry';
import { clearConsent } from '@/lib/ads/consent';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-3 flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-[var(--text)]">
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="var(--signal)" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.55" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.55" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.85" />
                </svg>
              </span>
              <span className="font-display text-base font-bold">OmniTool</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              {TOOLS.length} tools for files, images and text. Every one runs inside your
              browser — nothing you open is ever uploaded, stored or seen by us.
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Categories</h3>
            <ul className="flex flex-col gap-2">
              {getActiveCategories().map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/tools/category/${category.id}`}
                    className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Most used</h3>
            <ul className="flex flex-col gap-2">
              {POPULAR_TOOLS.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={toolPath(tool)}
                    className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-3">About</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Donate
                </Link>
              </li>
              <li>
                <a
                  href="mailto:admin@omanitool.tech"
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Terms
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={clearConsent}
                  className="text-left text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-[var(--text-subtle)]">
            © {new Date().getFullYear()} OmniTool
          </p>
          <p className="font-mono text-xs text-[var(--text-subtle)]">
            No accounts · No uploads · No tracking of your files
          </p>
        </div>
      </div>
    </footer>
  );
}
