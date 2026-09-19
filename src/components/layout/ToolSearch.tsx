'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CornerDownLeft, Search, X } from 'lucide-react';
import { POPULAR_TOOLS, searchTools, toolPath, TOOLS } from '@/lib/tools/registry';

/**
 * Search is the primary way into 55 tools, so it is the hero on the homepage and
 * is reachable from anywhere with "/". Results are computed locally — the whole
 * registry is already in the bundle, so there is nothing to ask a server for.
 */
export default function ToolSearch({
  size = 'large',
  autoFocus = false,
}: {
  size?: 'large' | 'compact';
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const found = searchTools(query);
    return (query.trim() ? found : POPULAR_TOOLS).slice(0, 7);
  }, [query]);

  useEffect(() => setActive(0), [query]);

  // "/" focuses search from anywhere, the way most developer tools behave.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || !results.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const tool = results[active];
      if (tool) {
        setOpen(false);
        setQuery('');
        router.push(toolPath(tool));
      }
    }
  }

  const large = size === 'large';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] ${
            large ? 'size-5' : 'size-4'
          }`}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={large ? 'Search 55 tools — try “merge pdf” or “json”' : 'Search tools'}
          aria-label="Search tools"
          aria-expanded={open}
          role="combobox"
          aria-controls="tool-search-results"
          className={`w-full rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-card)] transition-colors placeholder:text-[var(--text-subtle)] focus:border-[var(--signal)] focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
            large ? 'py-4 pl-12 pr-24 text-base' : 'py-2 pl-10 pr-4 text-sm'
          }`}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <X className="size-4" />
          </button>
        ) : (
          large && (
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border-strong)] bg-[var(--surface-2)] px-2 py-1 font-mono text-[11px] text-[var(--text-subtle)] sm:block">
              /
            </kbd>
          )
        )}
      </div>

      {open && (
        <div
          id="tool-search-results"
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]"
        >
          {!query.trim() && (
            <p className="eyebrow border-b border-[var(--border)] px-4 py-2.5">Most used</p>
          )}

          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                Nothing matches “{query}”.
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                Try a file type, like “pdf”, “png” or “json”.
              </p>
            </div>
          ) : (
            <ul className="max-h-[22rem] overflow-y-auto py-1">
              {results.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.id}>
                    <Link
                      href={toolPath(tool)}
                      role="option"
                      aria-selected={index === active}
                      onPointerEnter={() => setActive(index)}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        index === active ? 'bg-[var(--surface-2)]' : ''
                      }`}
                    >
                      <Icon className="size-4 shrink-0 text-[var(--text-subtle)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[var(--text)]">
                          {tool.name}
                        </span>
                        <span className="block truncate text-xs text-[var(--text-subtle)]">
                          {tool.tagline}
                        </span>
                      </span>
                      {index === active && (
                        <CornerDownLeft className="size-3.5 shrink-0 text-[var(--text-subtle)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export const TOOL_COUNT = TOOLS.length;
