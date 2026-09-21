import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import {
  getActiveCategories,
  getCategory,
  getGroupedTools,
  type ToolCategory,
} from '@/lib/tools/registry';
import ToolCard from '@/components/ui/ToolCard';
import ToolSearch from '@/components/layout/ToolSearch';
import AdSlot from '@/components/ads/AdSlot';

// Only categories with at least one live tool get a page; an empty listing
// is a thin page, and Google treats those as low value.
const VALID = new Set(getActiveCategories().map((category) => category.id));

export function generateStaticParams() {
  return getActiveCategories().map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID.has(category as ToolCategory)) return constructMetadata({ noIndex: true });

  const meta = getCategory(category as ToolCategory);
  const count = getGroupedTools(meta.id).reduce((total, group) => total + group.tools.length, 0);

  return constructMetadata({
    title: `${count} free ${meta.label} tools — OmniTool`,
    description: `${meta.blurb} Every tool runs in your browser, so nothing is uploaded.`,
    canonical: `/tools/category/${meta.id}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID.has(category as ToolCategory)) notFound();

  const meta = getCategory(category as ToolCategory);
  const groups = getGroupedTools(meta.id);
  const count = groups.reduce((total, group) => total + group.tools.length, 0);

  return (
    <div className="shell py-6 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1 font-mono text-xs text-[var(--text-subtle)]">
          <li>
            <Link href="/" className="transition-colors hover:text-[var(--text)]">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-[var(--text)]">
            {meta.label}
          </li>
        </ol>
      </nav>

      <header className="mb-8 max-w-2xl">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {meta.label} tools
          </h1>
          <span className="font-mono text-xs text-[var(--text-subtle)]">
            {String(count).padStart(2, '0')}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">{meta.blurb}</p>
      </header>

      <div className="mb-10 max-w-xl">
        <ToolSearch size="compact" />
      </div>

      <div className="flex flex-col gap-8">
        {groups.map(({ group, tools }) => (
          <section key={group}>
            <h2 className="eyebrow mb-4 border-b border-[var(--border)] pb-2">{group}</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* --------------------------------------------- other categories */}
      <section className="mt-16 border-t border-[var(--border)] pt-8">
        <h2 className="eyebrow mb-4">Other categories</h2>
        <div className="flex flex-wrap gap-2">
          {getActiveCategories()
            .filter((entry) => entry.id !== meta.id)
            .map((entry) => (
            <Link
              key={entry.id}
              href={`/tools/category/${entry.id}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--signal)] hover:text-[var(--text)]"
            >
              {entry.label}
              </Link>
            ))}
        </div>
      </section>

      <AdSlot placement="footer" className="mt-12" />
    </div>
  );
}
