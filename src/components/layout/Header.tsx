'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, ShieldCheck, X } from 'lucide-react';
import {
  getActiveCategories,
  getGroupedTools,
  toolPath,
  type ToolCategory,
} from '@/lib/tools/registry';
import ToolSearch from './ToolSearch';
import ThemeToggle from './ThemeToggle';

/**
 * Leaving the trigger does not close the menu immediately. Between the nav row
 * and the panel there is a strip of header that belongs to neither, and
 * closing the instant the pointer crosses it makes the menu impossible to
 * reach. A short grace period, cancelled on re-entry, fixes that.
 */
const CLOSE_DELAY_MS = 220;

export default function Header() {
  const pathname = usePathname();
  const categories = getActiveCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<ToolCategory | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const open = useCallback(
    (category: ToolCategory) => {
      cancelClose();
      setOpenCategory(category);
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenCategory(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpenCategory(null);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Route changes close whatever was open. Adjusting during render rather than
  // in an effect avoids a frame where the new page shows behind an open menu.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMobileOpen(false);
    setOpenCategory(null);
  }

  // The mobile sheet owns the viewport while it is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setOpenCategory(null);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpenCategory(null);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md"
    >
      <div className="shell">
        <div className="flex h-14 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="OmniTool home">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">OmniTool</span>
          </Link>

          {/* ------------------------------------------------- desktop nav */}
          <nav className="hidden lg:flex" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
            <ul className="flex items-center">
              {categories.map((category) => {
                const isOpen = openCategory === category.id;
                return (
                  <li key={category.id}>
                    {/*
                     * A link, not a button: pressing a category name goes to
                     * its full listing. Hover and keyboard focus open the menu.
                     */}
                    <Link
                      href={`/tools/category/${category.id}`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onMouseEnter={() => open(category.id)}
                      onFocus={() => open(category.id)}
                      onClick={closeNow}
                      className={`flex items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
                        isOpen
                          ? 'bg-[var(--surface-2)] text-[var(--text)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {category.label}
                      <ChevronDown
                        className={`size-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {openCategory && (
              <MegaMenu
                category={openCategory}
                onNavigate={closeNow}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              />
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden w-56 xl:block">
              <ToolSearch size="compact" />
            </div>

            <ThemeToggle />

            <Link
              href="/donate"
              className="hidden items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:inline-flex"
            >
              <Heart className="size-4" />
              Donate
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="btn-secondary size-9 p-0 lg:hidden"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && <MobileMenu onNavigate={() => setMobileOpen(false)} />}
    </header>
  );
}

function Logo() {
  return (
    <span className="grid size-8 place-items-center rounded-[var(--radius-md)] bg-[var(--text)]">
      {/* Four quadrants: the toolbox, reduced to its simplest mark. */}
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="var(--signal)" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.55" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.55" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="var(--bg)" opacity="0.85" />
      </svg>
    </span>
  );
}

function MegaMenu({
  category,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  category: ToolCategory;
  onNavigate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const groups = getGroupedTools(category);
  const meta = getActiveCategories().find((entry) => entry.id === category);
  if (!meta) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 right-0 top-full z-50"
    >
      <div className="shell pt-1">
        <div className="animate-rise overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-left shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-2.5">
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--live)]">
              <ShieldCheck className="size-3.5" />
              Every one of these runs on your device
            </p>
            <Link
              href={`/tools/category/${category}`}
              onClick={onNavigate}
              className="shrink-0 font-mono text-[11px] font-medium text-[var(--signal)] hover:underline"
            >
              All {meta.label.toLowerCase()} tools →
            </Link>
          </div>

          {/*
           * Capped to the space below the header and scrolled if it overflows.
           * The PDF category alone is 25 tools across six groups.
           */}
          <div className="scrollbar-thin max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="grid gap-x-5 gap-y-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groups.map(({ group, tools }) => (
                <div key={group}>
                  <h3 className="eyebrow mb-1.5">{group}</h3>
                  <ul className="flex flex-col">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <li key={tool.id}>
                          <Link
                            href={toolPath(tool)}
                            onClick={onNavigate}
                            className="group -mx-2 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 transition-colors hover:bg-[var(--surface-2)]"
                          >
                            <Icon className="size-3.5 shrink-0 text-[var(--text-subtle)] transition-colors group-hover:text-[var(--signal)]" />
                            <span className="truncate text-xs text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                              {tool.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const categories = getActiveCategories();
  const [expanded, setExpanded] = useState<ToolCategory | null>(categories[0]?.id ?? null);

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto overscroll-contain bg-[var(--bg)] lg:hidden">
      <div className="shell flex flex-col gap-5 py-5 pb-24">
        <ToolSearch size="compact" />

        {categories.map((category) => {
          const isOpen = expanded === category.id;
          const groups = getGroupedTools(category.id);
          return (
            <div key={category.id} className="border-b border-[var(--border)] pb-1 last:border-0">
              <div className="flex items-center justify-between">
                <Link
                  href={`/tools/category/${category.id}`}
                  onClick={onNavigate}
                  className="py-3 font-display text-base font-bold"
                >
                  {category.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${category.label}`}
                  onClick={() => setExpanded(isOpen ? null : category.id)}
                  className="btn-ghost size-9 p-0"
                >
                  <ChevronDown
                    className={`size-4 text-[var(--text-subtle)] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {isOpen && (
                <div className="flex flex-col gap-4 pb-3">
                  {groups.map(({ group, tools }) => (
                    <div key={group}>
                      <h3 className="eyebrow mb-1.5">{group}</h3>
                      <ul className="grid grid-cols-2 gap-x-3">
                        {tools.map((tool) => (
                          <li key={tool.id}>
                            <Link
                              href={toolPath(tool)}
                              onClick={onNavigate}
                              className="block py-2 text-[13px] text-[var(--text-muted)]"
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <Link href="/donate" onClick={onNavigate} className="btn-primary btn-lg">
          <Heart className="size-4" />
          Support OmniTool
        </Link>
      </div>
    </div>
  );
}
