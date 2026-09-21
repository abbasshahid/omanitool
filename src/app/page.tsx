import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, CloudOff, HardDrive, ShieldCheck, WifiOff } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import {
  countToolsInCategory,
  getActiveCategories,
  getGroupedTools,
  POPULAR_TOOLS,
  TOOLS,
} from '@/lib/tools/registry';
import ToolCard from '@/components/ui/ToolCard';
import ToolSearch from '@/components/layout/ToolSearch';
import UplinkMeter from '@/components/layout/UplinkMeter';
import AdSlot from '@/components/ads/AdSlot';

export const metadata = constructMetadata({
  title: `${TOOLS.length} free file tools that never upload your files — OmniTool`,
  description:
    'Merge PDFs, convert images and more, without your files ever leaving your computer. No upload, no server, no account. Watch the byte counter stay at zero.',
  canonical: '/',
});

export default function Home() {
  const categories = getActiveCategories();

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
              Your files never
              <br />
              leave your computer.
            </h1>

            <p className="animate-rise mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              {TOOLS.length} tools for PDFs, images and text — and not one of them uploads
              anything. There is no server to send your files to, which is why the counter above
              reads zero, and keeps reading zero while you work.
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

      {/* ------------------------------------------------- the privacy case */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="shell py-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Claim
              icon={CloudOff}
              title="Nothing is uploaded"
              body="Your browser opens the file straight from your disk. It is never sent to us, because there is nowhere to send it."
            />
            <Claim
              icon={HardDrive}
              title="Nothing is stored"
              body="We run no database and no file storage. There is no copy of your document to leak, hand over, or forget to delete."
            />
            <Claim
              icon={WifiOff}
              title="Works offline"
              body="Open a tool, switch off your Wi-Fi, and it still works. That is the plainest proof the work happens on your side."
            />
            <Claim
              icon={ShieldCheck}
              title="Check it yourself"
              body="Open your browser's network tab while you work. The meter at the top measures the same thing, live: bytes sent."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- categories */}
      <div className="shell py-10 md:py-12">
        <div className="flex flex-col gap-10">
          {categories.map((category, categoryIndex) => {
            const groups = getGroupedTools(category.id);
            const count = countToolsInCategory(category.id);

            return (
              <Fragment key={category.id}>
                {/* One in-feed unit, placed between two sections rather than
                    inside either, so it never separates a heading from its grid. */}
                {categoryIndex === 2 && <AdSlot placement="inFeed" className="my-2" />}

                <section id={category.id} className="scroll-mt-20">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] pb-2.5">
                    <div className="flex items-baseline gap-3">
                      <h2 className="font-display text-xl font-bold tracking-tight">
                        {category.label}
                      </h2>
                      {/* The count is real information: how much is in this section. */}
                      <span className="font-mono text-xs text-[var(--text-subtle)]">
                        {String(count).padStart(2, '0')} tools
                      </span>
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
              </Fragment>
            );
          })}
        </div>

        <AdSlot placement="footer" className="mt-12" />
      </div>
    </>
  );
}

function Claim({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof CloudOff;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-[var(--live)]">
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-[13px] font-bold">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{body}</p>
      </div>
    </div>
  );
}
