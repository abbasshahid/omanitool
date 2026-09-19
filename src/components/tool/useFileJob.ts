'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface JobOutput {
  name: string;
  blob: Blob;
  /** Shown under the result, e.g. "1.2 MB · 34% smaller". */
  note?: string;
  /** Object URL for image previews; created and revoked by the hook's consumer. */
  previewUrl?: string;
}

export interface RunContext {
  signal: AbortSignal;
  /** `value` is 0-1. Pass a label to describe the current step. */
  progress: (value: number, label?: string) => void;
}

export type JobStatus = 'idle' | 'ready' | 'running' | 'done' | 'error';

interface UseFileJobArgs<TOptions> {
  /** `accept` attribute for the file input, e.g. "application/pdf". */
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  /** Per-file ceiling. Browsers hold the whole file in memory while working. */
  maxFileSizeMb?: number;
  initialOptions: TOptions;
  run: (files: File[], options: TOptions, context: RunContext) => Promise<JobOutput[]>;
}

export interface FileJob<TOptions> {
  files: File[];
  addFiles: (incoming: FileList | File[]) => void;
  removeFile: (index: number) => void;
  moveFile: (from: number, to: number) => void;
  clearFiles: () => void;
  options: TOptions;
  setOptions: (patch: Partial<TOptions>) => void;
  status: JobStatus;
  progress: number;
  progressLabel: string;
  error: string | null;
  outputs: JobOutput[];
  start: () => void;
  cancel: () => void;
  reset: () => void;
  accept: string;
  multiple: boolean;
}

function extensionsFromAccept(accept: string): string[] {
  return accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.startsWith('.'));
}

function isAccepted(file: File, accept: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((part) => part.trim().toLowerCase());
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return name.endsWith(pattern);
    if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
    return type === pattern;
  });
}

/**
 * Drives the shared upload → configure → run → download flow that most tools
 * need, so each tool only has to supply its options and its processing function.
 */
export function useFileJob<TOptions extends object>({
  accept,
  multiple = false,
  maxFiles,
  maxFileSizeMb = 200,
  initialOptions,
  run,
}: UseFileJobArgs<TOptions>): FileJob<TOptions> {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptionsState] = useState<TOptions>(initialOptions);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<JobOutput[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef(run);
  runRef.current = run;

  // Object URLs for finished outputs are owned here, so nothing leaks on reset.
  const urlsRef = useRef<string[]>([]);
  const releaseUrls = useCallback(() => {
    for (const url of urlsRef.current) URL.revokeObjectURL(url);
    urlsRef.current = [];
  }, []);
  useEffect(() => () => releaseUrls(), [releaseUrls]);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const candidates = Array.from(incoming);
      const rejected: string[] = [];

      const valid = candidates.filter((file) => {
        if (!isAccepted(file, accept)) {
          rejected.push(`${file.name} is not a supported file type`);
          return false;
        }
        if (file.size > maxFileSizeMb * 1024 * 1024) {
          rejected.push(`${file.name} is larger than ${maxFileSizeMb} MB`);
          return false;
        }
        if (file.size === 0) {
          rejected.push(`${file.name} is empty`);
          return false;
        }
        return true;
      });

      setError(rejected.length ? rejected.join('. ') : null);
      if (!valid.length) return;

      setFiles((current) => {
        const next = multiple ? [...current, ...valid] : valid.slice(0, 1);
        return maxFiles ? next.slice(0, maxFiles) : next;
      });
      setStatus('ready');
      setOutputs([]);
      releaseUrls();
    },
    [accept, maxFileSizeMb, maxFiles, multiple, releaseUrls],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((current) => {
      const next = current.filter((_, i) => i !== index);
      setStatus(next.length ? 'ready' : 'idle');
      return next;
    });
    setOutputs([]);
  }, []);

  const moveFile = useCallback((from: number, to: number) => {
    setFiles((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setOutputs([]);
    setStatus('idle');
    setError(null);
    releaseUrls();
  }, [releaseUrls]);

  const setOptions = useCallback((patch: Partial<TOptions>) => {
    setOptionsState((current) => ({ ...current, ...patch }));
    // Options changed, so any previous result is stale.
    setOutputs([]);
    setStatus((current) => (current === 'done' ? 'ready' : current));
  }, []);

  const start = useCallback(() => {
    if (!files.length) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('running');
    setError(null);
    setProgress(0);
    setProgressLabel('');
    releaseUrls();

    const context: RunContext = {
      signal: controller.signal,
      progress: (value, label) => {
        if (controller.signal.aborted) return;
        setProgress(Math.max(0, Math.min(1, value)));
        if (label !== undefined) setProgressLabel(label);
      },
    };

    runRef
      .current(files, options, context)
      .then((result) => {
        if (controller.signal.aborted) return;
        urlsRef.current = result.flatMap((item) => (item.previewUrl ? [item.previewUrl] : []));
        setOutputs(result);
        setProgress(1);
        setStatus('done');
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Something went wrong.');
        setStatus('error');
      });
  }, [files, options, releaseUrls]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus(files.length ? 'ready' : 'idle');
    setProgress(0);
    setProgressLabel('');
  }, [files.length]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    releaseUrls();
    setFiles([]);
    setOutputs([]);
    setStatus('idle');
    setError(null);
    setProgress(0);
    setProgressLabel('');
    setOptionsState(initialOptions);
  }, [initialOptions, releaseUrls]);

  return {
    files,
    addFiles,
    removeFile,
    moveFile,
    clearFiles,
    options,
    setOptions,
    status,
    progress,
    progressLabel,
    error,
    outputs,
    start,
    cancel,
    reset,
    accept,
    multiple,
  };
}

export { extensionsFromAccept };
