import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** The four-quadrant toolbox mark, sized for an iOS home screen. */
export default function AppleIcon() {
  const tile = (background: string, opacity = 1) => (
    <div style={{ width: 54, height: 54, borderRadius: 14, background, opacity }} />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          gap: 10,
          background: '#0b121b',
          padding: 26,
        }}
      >
        {tile('#f2a71b')}
        {tile('#e8edf2', 0.45)}
        {tile('#e8edf2', 0.45)}
        {tile('#e8edf2', 0.85)}
      </div>
    ),
    size,
  );
}
