'use client';

import { useEffect, useState } from 'react';
import { formatBytes, installUplinkMeter, subscribeToUplink } from '@/lib/uplink';

/**
 * Reports how many bytes this page has actually sent. It reads zero because the
 * tools run locally — see `src/lib/uplink.ts` for how the figure is measured.
 */
export default function UplinkMeter({ compact = false }: { compact?: boolean }) {
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    installUplinkMeter();
    return subscribeToUplink(setBytes);
  }, []);

  const clean = bytes === 0;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono ${
        compact ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'
      }`}
      title={
        clean
          ? 'Measured live: this page has sent zero bytes. Your files are processed on your own machine.'
          : 'Bytes sent by this page so far.'
      }
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${clean ? 'bg-[var(--live)] animate-breathe' : 'bg-[var(--signal)]'}`}
      />
      <span className="font-medium tabular-nums tracking-tight text-[var(--text)]">
        {formatBytes(bytes)}
      </span>
      <span className="uppercase tracking-[0.14em] text-[var(--text-subtle)]">uploaded</span>
    </span>
  );
}
