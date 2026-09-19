'use client';

import { useCallback, useId, useRef, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  FileIcon,
  Loader2,
  Package,
  Plus,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';
import type { FileJob } from './useFileJob';
import { formatBytes } from '@/lib/uplink';

interface FileWorkbenchProps<TOptions extends object> {
  job: FileJob<TOptions>;
  /** Controls shown once at least one file is present. */
  options?: ReactNode;
  /** Label for the primary action, e.g. "Merge PDFs". */
  actionLabel: string;
  /** Copy inside the empty dropzone, e.g. "Drop PDFs here". */
  dropLabel?: string;
  /** Hint under the dropzone, e.g. "PDF up to 200 MB". */
  dropHint?: string;
  /** Let the user drag files into a specific order. */
  reorderable?: boolean;
  /** Replaces the default file list, for tools with their own preview. */
  filePreview?: ReactNode;
  /** Extra content between the file list and the action bar. */
  children?: ReactNode;
}

export default function FileWorkbench<TOptions extends object>({
  job,
  options,
  actionLabel,
  dropLabel,
  dropHint,
  reorderable = false,
  filePreview,
  children,
}: FileWorkbenchProps<TOptions>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      if (event.dataTransfer.files?.length) job.addFiles(event.dataTransfer.files);
    },
    [job],
  );

  const hasFiles = job.files.length > 0;
  const running = job.status === 'running';
  const done = job.status === 'done';

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={job.accept}
        multiple={job.multiple}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files?.length) job.addFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {/* ---------------------------------------------------------- dropzone */}
      {!hasFiles && (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-16 text-center transition-colors ${
            dragging
              ? 'border-[var(--signal)] bg-[var(--signal-soft)]'
              : 'border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--text-subtle)]'
          }`}
        >
          <span className="grid size-12 place-items-center rounded-full bg-[var(--surface)] text-[var(--text-muted)] shadow-[var(--shadow-card)]">
            <Upload className="size-5" />
          </span>
          <span className="text-base font-semibold text-[var(--text)]">
            {dropLabel ?? (job.multiple ? 'Drop your files here' : 'Drop your file here')}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            or <span className="font-semibold text-[var(--text)] underline underline-offset-2">choose from your device</span>
          </span>
          {dropHint && <span className="eyebrow mt-1">{dropHint}</span>}
        </label>
      )}

      {/* -------------------------------------------------------- file list */}
      {hasFiles && (filePreview ?? (
        <ul className="flex flex-col gap-2">
          {job.files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-muted)]">
                <FileIcon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--text)]">{file.name}</span>
                <span className="block font-mono text-xs text-[var(--text-subtle)]">{formatBytes(file.size)}</span>
              </span>

              {reorderable && job.files.length > 1 && (
                <span className="flex shrink-0 items-center">
                  <button
                    type="button"
                    className="btn-ghost size-8 rounded-[var(--radius-sm)] p-0 disabled:opacity-25"
                    onClick={() => job.moveFile(index, index - 1)}
                    disabled={index === 0 || running}
                    aria-label={`Move ${file.name} up`}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost size-8 rounded-[var(--radius-sm)] p-0 disabled:opacity-25"
                    onClick={() => job.moveFile(index, index + 1)}
                    disabled={index === job.files.length - 1 || running}
                    aria-label={`Move ${file.name} down`}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </span>
              )}

              <button
                type="button"
                className="btn-ghost size-8 shrink-0 rounded-[var(--radius-sm)] p-0"
                onClick={() => job.removeFile(index)}
                disabled={running}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}

          {job.multiple && (
            <li>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={running}
                className="btn-secondary w-full border-dashed"
              >
                <Plus className="size-4" />
                Add more files
              </button>
            </li>
          )}
        </ul>
      ))}

      {/* ---------------------------------------------------------- options */}
      {hasFiles && options && (
        <div className="panel p-4 sm:p-5">{options}</div>
      )}

      {children}

      {/* ------------------------------------------------------------ error */}
      {job.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--alert-soft)] px-3 py-2.5 text-sm text-[var(--alert)]"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{job.error}</span>
        </p>
      )}

      {/* ------------------------------------------------------------ action */}
      {hasFiles && !done && (
        <div className="flex flex-col gap-3">
          {running && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
                <span>{job.progressLabel || 'Working'}</span>
                <span className="tabular-nums">{Math.round(job.progress * 100)}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                <div
                  className="h-full rounded-full bg-[var(--signal)] transition-[width] duration-200"
                  style={{ width: `${Math.max(3, job.progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={running ? job.cancel : job.start}
              className={running ? 'btn-secondary btn-lg' : 'btn-primary btn-lg'}
            >
              {running ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Cancel
                </>
              ) : (
                actionLabel
              )}
            </button>
            {!running && (
              <button type="button" onClick={job.clearFiles} className="btn-ghost">
                Start over
              </button>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- results */}
      {done && job.outputs.length > 0 && <Results job={job} />}
    </div>
  );
}

function Results<TOptions extends object>({ job }: { job: FileJob<TOptions> }) {
  const [zipping, setZipping] = useState(false);
  const many = job.outputs.length > 1;

  function download(name: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    // Give the browser a moment to start the download before releasing the URL.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  async function downloadAll() {
    setZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (const output of job.outputs) zip.file(output.name, output.blob);
      const blob = await zip.generateAsync({ type: 'blob' });
      download('omnitool-results.zip', blob);
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="animate-rise flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--live)]/30 bg-[var(--surface)] p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
        <span className="grid size-6 place-items-center rounded-full bg-[var(--live)]/15 text-[var(--live)]">
          <Check className="size-3.5" />
        </span>
        {many ? `${job.outputs.length} files ready` : 'Ready to download'}
      </p>

      <ul className="flex flex-col gap-2">
        {job.outputs.slice(0, 40).map((output, index) => (
          <li
            key={`${output.name}-${index}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] px-3 py-2"
          >
            {output.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={output.previewUrl}
                alt=""
                className="size-9 shrink-0 rounded-[var(--radius-sm)] border border-[var(--border)] object-cover"
              />
            ) : (
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--text-muted)]">
                <FileIcon className="size-4" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[var(--text)]">{output.name}</span>
              <span className="block font-mono text-xs text-[var(--text-subtle)]">
                {output.note ?? formatBytes(output.blob.size)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => download(output.name, output.blob)}
              className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
            >
              <Download className="size-3.5" />
              Save
            </button>
          </li>
        ))}
      </ul>

      {job.outputs.length > 40 && (
        <p className="text-xs text-[var(--text-muted)]">
          Showing the first 40. Use “Download all” for the complete set.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {many && (
          <button type="button" onClick={downloadAll} disabled={zipping} className="btn-primary">
            {zipping ? <Loader2 className="size-4 animate-spin" /> : <Package className="size-4" />}
            {zipping ? 'Building ZIP' : 'Download all as ZIP'}
          </button>
        )}
        {!many && (
          <button
            type="button"
            onClick={() => download(job.outputs[0].name, job.outputs[0].blob)}
            className="btn-primary"
          >
            <Download className="size-4" />
            Download
          </button>
        )}
        <button type="button" onClick={job.reset} className="btn-secondary">
          <RotateCcw className="size-4" />
          Do another
        </button>
      </div>
    </div>
  );
}
