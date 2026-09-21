import { ImageResponse } from 'next/og';
import { TOOLS } from '@/lib/tools/registry';

export const alt = 'OmniTool — file tools that run in your browser';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated at build time by Next, so there is no binary to keep in the repo
 * and no image service to pay for. The card leads with the uplink meter,
 * because "nothing is uploaded" is the thing worth saying in a share preview.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b121b',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#e8edf2',
              padding: 8,
              gap: 4,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#f2a71b' }} />
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#0b121b', opacity: 0.45 }} />
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#0b121b', opacity: 0.45 }} />
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#0b121b', opacity: 0.8 }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#e8edf2', letterSpacing: -1 }}>
            OmniTool
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: '#e8edf2',
              letterSpacing: -2.5,
              lineHeight: 1.05,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>{TOOLS.length} tools that run on</span>
            <span>your machine, not ours.</span>
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: '#94a4b5' }}>
            PDF · Image · Text · Developer utilities
          </div>
        </div>

        {/* The signature reading, rendered as the instrument it is. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '2px solid #23303e',
              borderRadius: 999,
              padding: '12px 24px',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: '#34d39e' }} />
            <div style={{ fontSize: 26, color: '#e8edf2', fontWeight: 600 }}>0 B</div>
            <div style={{ fontSize: 26, color: '#6b7d8f', letterSpacing: 3 }}>UPLOADED</div>
          </div>
          <div style={{ fontSize: 24, color: '#6b7d8f' }}>Free · No account · No limits</div>
        </div>
      </div>
    ),
    size,
  );
}
