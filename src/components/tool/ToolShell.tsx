import Link from 'next/link';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { getCategory, getRelatedTools, toolPath, type Tool } from '@/lib/tools/registry';
import UplinkMeter from '@/components/layout/UplinkMeter';
import AdSenseBanner from '@/components/ads/AdSenseBanner';

export interface ToolFaq {
  question: string;
  answer: string;
}

interface ToolShellProps {
  tool: Tool;
  /** The interactive part of the page. */
  children: React.ReactNode;
  /** Ordered steps, shown as a numbered list because the order genuinely matters. */
  steps?: string[];
  faq?: ToolFaq[];
  /** Overrides the default note about where processing happens. */
  privacyNote?: string;
}

export default function ToolShell({ tool, children, steps, faq, privacyNote }: ToolShellProps) {
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const Icon = tool.icon;

  return (
    <div className="shell py-8 md:py-12">
      {/* ------------------------------------------------------- breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-[var(--text-subtle)]">
          <li>
            <Link href="/" className="transition-colors hover:text-[var(--text)]">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li>
            <Link href={`/tools/category/${category.id}`} className="transition-colors hover:text-[var(--text)]">
              {category.label}
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-[var(--text)]">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* ------------------------------------------------------------ header */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--signal)] shadow-[var(--shadow-card)]">
            <Icon className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 max-w-2xl text-[15px] text-[var(--text-muted)]">{tool.description}</p>
          </div>
        </div>
        <div className="shrink-0 md:pt-2">
          <UplinkMeter />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <section className="panel p-4 shadow-[var(--shadow-card)] sm:p-6">{children}</section>

          {/* ------------------------------------------------------ how it works */}
          {steps && steps.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold">How to use {tool.name}</h2>
              {/* Numbered because these are sequential: step two needs step one done. */}
              <ol className="mt-4 flex flex-col gap-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* --------------------------------------------------------------- faq */}
          {faq && faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold">Questions</h2>
              <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {faq.map((entry) => (
                  <details key={entry.question} className="group py-3">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-[var(--text)] marker:content-['']">
                      {entry.question}
                      <ChevronRight className="size-4 shrink-0 text-[var(--text-subtle)] transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{entry.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ---------------------------------------------------------- sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="panel p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-[var(--live)]" />
              {tool.usesNetwork ? 'What gets sent' : 'Runs on your machine'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {privacyNote ??
                (tool.usesNetwork
                  ? 'This tool asks our server to fetch a public page for you, because browsers block cross-site requests. Only the address you type is sent.'
                  : 'Your file is opened and processed by your own browser. It is never uploaded, so there is nothing for us to store, see or delete.')}
            </p>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="eyebrow mb-3">Related tools</h2>
              <ul className="flex flex-col gap-1">
                {related.map((item) => {
                  const RelatedIcon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        href={toolPath(item)}
                        className="group flex items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-2 transition-colors hover:bg-[var(--surface-2)]"
                      >
                        <RelatedIcon className="size-4 shrink-0 text-[var(--text-subtle)] transition-colors group-hover:text-[var(--signal)]" />
                        <span className="text-sm text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <AdSenseBanner
            dataAdSlot="TOOL_SIDEBAR"
            className="hidden h-[600px] rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] lg:block"
          />
        </aside>
      </div>
    </div>
  );
}
