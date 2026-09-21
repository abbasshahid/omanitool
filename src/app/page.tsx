import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import { CATEGORIES, getGroupedTools, POPULAR_TOOLS, TOOLS } from '@/lib/tools/registry';
import ToolCard from '@/components/ui/ToolCard';
import ToolSearch from '@/components/layout/ToolSearch';
import UplinkMeter from '@/components/layout/UplinkMeter';
import AdSenseBanner from '@/components/ads/AdSenseBanner';

export const metadata = constructMetadata({
  title: `OmniTool — ${TOOLS.length} free file tools that run in your browser`,
  description:
    'Merge PDFs, convert images, format JSON and more. Every tool runs on your own machine, so your files are never uploaded. Free, no account, no limits.',
  canonical: '/',
});

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="blueprint pointer-events-none absolute inset-0" aria-hidden />

        <div className="shell relative py-12 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-rise mb-5 flex justify-center">
              <UplinkMeter />
            </div>

            <h1 className="animate-rise font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
              {TOOLS.length} tools that run on
              <br />
              your machine, not ours.
            </h1>

            <p className="animate-rise mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              PDFs, images, text and code utilities. Your files are opened by your own browser and
              never uploaded — which is why the counter above reads zero.
            </p>

            <div className="animate-rise mx-auto mt-6 max-w-lg">
              <ToolSearch />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
              <span className="text-[var(--text-subtle)]">Popular:</span>
              {POPULAR_TOOLS.slice(0, 5).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] text-[var(--text-muted)] transition-colors hover:border-[var(--signal)] hover:text-[var(--text)]"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- categories */}
      <div className="shell py-10 md:py-12">
        <div className="flex flex-col gap-10">
          {CATEGORIES.map((category) => {
            const groups = getGroupedTools(category.id);
            const count = groups.reduce((total, group) => total + group.tools.length, 0);

            return (
              <section key={category.id} id={category.id} className="scroll-mt-20">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-2.5">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h2 className="font-display text-xl font-bold tracking-tight">
                        {category.label}
                      </h2>
                      {/* The count is real information: how much is in this section. */}
                      <span className="font-mono text-xs text-[var(--text-subtle)]">
                        {String(count).padStart(2, '0')} tools
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{category.blurb}</p>
                  </div>

                  <Link
                    href={`/tools/category/${category.id}`}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--signal)]"
                  >
                    Browse all
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {groups
                    .flatMap((group) => group.tools)
                    .slice(0, 8)
                    .map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
              </section>
            );
          })}
        </div>

        <AdSenseBanner
          dataAdSlot="HOMEPAGE_FOOTER"
          className="mt-16 h-[250px] rounded-[var(--radius-lg)] border border-dashed border-[var(--border)]"
        />
      </div>
    </>
  );
}
