'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, Check, Copy, Download, Trash2, Upload } from 'lucide-react';

export function CopyButton({
  value,
  label = 'Copy',
  className = 'btn-secondary px-3 py-1.5 text-xs',
  disabled,
}: {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard permission denied; fall back to a hidden textarea.
      const scratch = document.createElement('textarea');
      scratch.value = value;
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand('copy');
      scratch.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" onClick={copy} className={className} disabled={disabled || !value}>
      {copied ? <Check className="size-3.5 text-[var(--live)]" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

export function downloadText(filename: string, contents: string, mime = 'text/plain') {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

interface PaneProps {
  label: string;
  /** Buttons rendered on the right of the pane header. */
  actions?: ReactNode;
  children: ReactNode;
  /** Shown beneath the pane, e.g. a live character count. */
  footer?: ReactNode;
}

export function Pane({ label, actions, children, footer }: PaneProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
        <span className="eyebrow">{label}</span>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      {children}
      {footer && <div className="mt-2 font-mono text-xs text-[var(--text-subtle)]">{footer}</div>}
    </div>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  readOnly,
  mono = true,
  rows = 14,
  invalid,
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  mono?: boolean;
  rows?: number;
  invalid?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      spellCheck={false}
      className={`scrollbar-thin w-full resize-y rounded-[var(--radius-md)] border bg-[var(--surface)] p-3 text-sm leading-relaxed text-[var(--text)] transition-colors placeholder:text-[var(--text-subtle)] focus:outline-none ${
        mono ? 'font-mono' : ''
      } ${
        invalid
          ? 'border-[var(--alert)] focus:border-[var(--alert)]'
          : 'border-[var(--border-strong)] focus:border-[var(--signal)]'
      } ${readOnly ? 'bg-[var(--surface-2)]' : ''}`}
    />
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--alert-soft)] px-3 py-2.5 text-sm text-[var(--alert)]"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

/** Loads a text file into a pane, for tools that accept pasted text or a file. */
export function LoadFileButton({
  accept,
  onLoad,
  label = 'Open file',
}: {
  accept: string;
  onLoad: (contents: string, file: File) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) onLoad(await file.text(), file);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        className="btn-secondary px-3 py-1.5 text-xs"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" />
        {label}
      </button>
    </>
  );
}

export function ClearButton({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClear}
      disabled={disabled}
      className="btn-ghost px-2.5 py-1.5 text-xs"
    >
      <Trash2 className="size-3.5" />
      Clear
    </button>
  );
}

export function DownloadButton({
  filename,
  contents,
  mime,
  label = 'Download',
  disabled,
}: {
  filename: string;
  contents: string;
  mime?: string;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadText(filename, contents, mime)}
      disabled={disabled || !contents}
      className="btn-secondary px-3 py-1.5 text-xs"
    >
      <Download className="size-3.5" />
      {label}
    </button>
  );
}

/** Two panes side by side on desktop, stacked on mobile. */
export function SplitPanes({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}
