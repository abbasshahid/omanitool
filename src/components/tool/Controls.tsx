'use client';

import type { ReactNode } from 'react';

/** Lays option controls out in a responsive grid so every tool panel matches. */
export function OptionGrid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const columns = cols === 1 ? '' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  return <div className={`grid gap-4 ${columns}`}>{children}</div>;
}

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--text-subtle)]">{hint}</p>}
    </div>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  id,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="field cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  id,
  type = 'text',
  mono,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  type?: 'text' | 'password' | 'url' | 'search';
  mono?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={mono ? 'field-mono' : 'field'}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  id,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const next = event.target.valueAsNumber;
          if (Number.isNaN(next)) return;
          onChange(next);
        }}
        className={`field tabular-nums ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--text-subtle)]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  id,
  format,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  id?: string;
  format?: (value: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.valueAsNumber)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-3)] accent-[var(--signal)]"
      />
      <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--text-muted)]">
        {format ? format(value) : value}
      </span>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
          checked ? 'bg-[var(--signal)]' : 'bg-[var(--surface-3)]'
        }`}
      >
        <span
          className={`block size-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--text)]">{label}</span>
        {hint && <span className="block text-xs text-[var(--text-subtle)]">{hint}</span>}
      </span>
    </label>
  );
}

/** Mutually exclusive choices shown as a segmented control. */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-0.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-[calc(var(--radius-md)-2px)] px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-card)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** A labelled readout, for tools that report measurements rather than files. */
export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: 'signal' | 'live' }) {
  const color =
    tone === 'signal' ? 'text-[var(--signal)]' : tone === 'live' ? 'text-[var(--live)]' : 'text-[var(--text)]';
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
      <div className={`font-mono text-xl font-semibold tabular-nums ${color}`}>{value}</div>
      <div className="mt-0.5 text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  );
}
