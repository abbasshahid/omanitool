'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, X } from 'lucide-react';
import { CATEGORIES, getGroupedTools, toolPath, type ToolCategory } from '@/lib/tools/registry';
import ToolSearch from './ToolSearch';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<ToolCategory | null>(null);

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
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="shell">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="OmniTool home">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">OmniTool</span>
          </Link>

          {/* ------------------------------------------------- desktop nav */}
          <nav className="hidden lg:flex" onMouseLeave={() => setOpenCategory(null)}>
            <ul className="flex items-center">
              {CATEGORIES.map((category) => {
                const open = openCategory === category.id;
                return (
                  <li key={category.id} className="relative">
                    <button
                      type="button"
                      aria-expanded={open}
                      onMouseEnter={() => setOpenCategory(category.id)}
                      onClick={() => setOpenCategory(open ? null : category.id)}
                      className={`flex items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
                        open
                          ? 'bg-[var(--surface-2)] text-[var(--text)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {category.label}
                      <ChevronDown
                        className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {openCategory && <MegaMenu category={openCategory} />}
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
              onClick={() => setMobileOpen((open) => !open)}
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

function MegaMenu({ category }: { category: ToolCategory }) {
  const groups = getGroupedTools(category);
  const meta = CATEGORIES.find((entry) => entry.id === category)!;

  return (
    <div className="absolute left-0 right-0 top-full z-50 pt-1">
      <div className="shell">
        <div className="animate-rise overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]">
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
            <p className="text-sm text-[var(--text-muted)]">{meta.blurb}</p>
            <Link
              href={`/tools/category/${category}`}
              className="shrink-0 font-mono text-xs font-medium text-[var(--signal)] hover:underline"
            >
              All {meta.label.toLowerCase()} tools →
            </Link>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map(({ group, tools }) => (
              <div key={group}>
                <h3 className="eyebrow mb-2">{group}</h3>
                <ul className="flex flex-col">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li key={tool.id}>
                        <Link
                          href={toolPath(tool)}
                          className="group flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 -mx-2 transition-colors hover:bg-[var(--surface-2)]"
                        >
                          <Icon className="size-3.5 shrink-0 text-[var(--text-subtle)] transition-colors group-hover:text-[var(--signal)]" />
                          <span className="text-[13px] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
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
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<ToolCategory | null>('pdf');

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto overscroll-contain bg-[var(--bg)] lg:hidden">
      <div className="shell flex flex-col gap-5 py-5 pb-24">
        <ToolSearch size="compact" />

        {CATEGORIES.map((category) => {
          const open = expanded === category.id;
          const groups = getGroupedTools(category.id);
          return (
            <div key={category.id} className="border-b border-[var(--border)] pb-1 last:border-0">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : category.id)}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="font-display text-base font-bold">{category.label}</span>
                <ChevronDown
                  className={`size-4 text-[var(--text-subtle)] transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {open && (
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
