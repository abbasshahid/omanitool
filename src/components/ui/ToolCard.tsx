import Link from 'next/link';
import { toolPath, type Tool } from '@/lib/tools/registry';

/**
 * Cards carry no per-tool colour. With 50+ tools on one page, colour-coding
 * each one turns the grid into noise; the accent is saved for hover and focus
 * so the eye can scan names instead. Kept deliberately dense — the job of this
 * grid is to be skimmed, not admired.
 */
export default function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const Icon = tool.icon;

  return (
    <Link
      href={toolPath(tool)}
      className="group relative flex flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--signal)] hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors group-hover:bg-[var(--signal-soft)] group-hover:text-[var(--signal)]">
          <Icon className="size-4" />
        </span>
        {tool.isNew && (
          <span className="rounded-full bg-[var(--signal-soft)] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--signal)]">
            New
          </span>
        )}
      </div>

      <h3 className="text-[13px] font-semibold leading-snug text-[var(--text)]">{tool.name}</h3>

      {!compact && (
        <p className="line-clamp-2 text-[11.5px] leading-snug text-[var(--text-muted)]">
          {tool.tagline}
        </p>
      )}
    </Link>
  );
}
