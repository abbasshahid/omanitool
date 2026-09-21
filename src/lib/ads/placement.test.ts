import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { AD_SIZES, AD_SLOTS } from './config';

const read = (path: string) => readFileSync(path, 'utf8');

/** Every file under `dir` whose name matches, searched recursively. */
function findFiles(dir: string, matches: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...findFiles(path, matches));
    else if (matches(entry)) out.push(path);
  }
  return out;
}

const TOOL_CLIENTS = findFiles('src/components/tools', (n) => n.endsWith('.tsx'));
const PAGES = findFiles('src/app', (n) => n === 'page.tsx');

describe('ad configuration', () => {
  it('reserves a height for every placement, so nothing shifts on load', () => {
    for (const placement of Object.keys(AD_SLOTS) as (keyof typeof AD_SLOTS)[]) {
      const size = AD_SIZES[placement];
      expect(size, placement).toBeDefined();
      expect(size.desktop, placement).toBeGreaterThan(0);
    }
  });

  it('ships no hardcoded publisher or slot ids', () => {
    // Everything must come from the environment, so a fork cannot accidentally
    // serve ads against someone else's account.
    for (const file of [...TOOL_CLIENTS, ...PAGES, 'src/app/layout.tsx']) {
      const source = read(file);
      expect(source, `${file} hardcodes a publisher id`).not.toMatch(/ca-pub-\d/);
    }
  });
});

describe('ad placement policy', () => {
  it('loads no ad script outside the consent-gated loader', () => {
    for (const file of [...PAGES, 'src/app/layout.tsx']) {
      expect(read(file), `${file} loads adsbygoogle directly`).not.toContain(
        'pagead2.googlesyndication.com',
      );
    }
  });

  it('places no ad above a tool', () => {
    // An ad between the visitor and the tool pushes the tool below the fold.
    // Tool pages render their ads through ToolShell's sidebar and footer slots.
    for (const file of TOOL_CLIENTS) {
      const source = read(file);
      const firstAd = source.indexOf('<AdSlot');
      if (firstAd === -1) continue;

      const dropzone = Math.max(
        source.indexOf('type="file"'),
        source.indexOf('FileUploader'),
        source.indexOf('FileWorkbench'),
      );
      if (dropzone === -1) continue;
      expect(firstAd, `${file} renders an ad before its file input`).toBeGreaterThan(dropzone);
    }
  });

  it('keeps ads out of the panel holding the tool controls', () => {
    // Ads next to a download or convert button invite accidental clicks, which
    // AdSense treats as invalid traffic.
    for (const file of TOOL_CLIENTS) {
      const source = read(file);
      for (const match of source.matchAll(/<AdSlot[^>]*>/g)) {
        const before = source.slice(Math.max(0, match.index - 400), match.index);
        expect(before, `${file} places an ad beside an action button`).not.toMatch(
          /handleDownload|handleProcess|job\.start/,
        );
      }
    }
  });

  it('shows no ads on thin utility pages', () => {
    // Privacy, terms and 404 carry no publisher content worth monetising.
    for (const file of ['src/app/privacy/page.tsx', 'src/app/terms/page.tsx']) {
      expect(read(file), `${file} should not carry ads`).not.toContain('AdSlot');
    }
  });

  it('labels every ad as an advertisement', () => {
    expect(read('src/components/ads/AdSlot.tsx')).toContain('Advertisement');
  });
});
