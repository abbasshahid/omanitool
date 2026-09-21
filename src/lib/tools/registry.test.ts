import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOGUE_ALL, CATEGORIES, getRelatedTools, searchTools, TOOLS } from './registry';

const pageFor = (id: string) => join(process.cwd(), 'src', 'app', 'tools', id, 'page.tsx');

describe('registry integrity', () => {
  it('has no duplicate ids', () => {
    const ids = TOOLS.map((tool) => tool.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses slug-safe ids', () => {
    for (const tool of TOOLS) {
      expect(tool.id, tool.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('places every tool in a group its category declares', () => {
    for (const tool of TOOLS) {
      const category = CATEGORIES.find((entry) => entry.id === tool.category);
      expect(category, `${tool.id} has unknown category ${tool.category}`).toBeDefined();
      expect(category!.groups, `${tool.id} has stray group ${tool.group}`).toContain(tool.group);
    }
  });

  it('gives every tool searchable keywords and copy', () => {
    for (const tool of TOOLS) {
      expect(tool.keywords.length, tool.id).toBeGreaterThan(0);
      expect(tool.tagline.length, tool.id).toBeGreaterThan(0);
      expect(tool.description.length, tool.id).toBeGreaterThan(20);
    }
  });

  // The registry drives the nav, the homepage, search and the sitemap. If it
  // lists a tool with no page, every one of those surfaces links to a 404.
  it('every listed tool has a page', () => {
    const missing = TOOLS.filter((tool) => !existsSync(pageFor(tool.id))).map((tool) => tool.id);
    expect(missing, 'listed but no page — mark them status: "planned"').toEqual([]);
  });

  it('every planned tool really is unbuilt', () => {
    const shipped = CATALOGUE_ALL.filter(
      (tool) => tool.status === 'planned' && existsSync(pageFor(tool.id)),
    ).map((tool) => tool.id);
    expect(shipped, 'page exists — remove status: "planned"').toEqual([]);
  });

  it('marks only the tools that genuinely need a server', () => {
    // The privacy claim rests on this: anything not flagged must be local-only.
    const networked = TOOLS.filter((tool) => tool.usesNetwork).map((tool) => tool.id);
    expect(networked).toEqual(['media-downloader']);
  });
});

describe('searchTools', () => {
  it('returns nothing for an empty query', () => {
    expect(searchTools('   ')).toEqual([]);
  });

  it('ranks an exact name first', () => {
    expect(searchTools('merge pdf')[0].id).toBe('pdf-merger');
  });

  it('prefers a name prefix over a keyword hit', () => {
    // "Compress PDF" starts with the term; "Compare PDF" also matches "com".
    expect(searchTools('compre')[0].id).toBe('compress-pdf');
  });

  it('finds tools by what people actually type', () => {
    expect(searchTools('shrink').map((tool) => tool.id)).toContain('compress-pdf');
    expect(searchTools('searchable').map((tool) => tool.id)).toContain('ocr-pdf');
    expect(searchTools('esign').map((tool) => tool.id)).toContain('sign-pdf');
  });

  it('never surfaces a tool that has no page', () => {
    const plannedIds = new Set(
      CATALOGUE_ALL.filter((tool) => tool.status === 'planned').map((tool) => tool.id),
    );
    for (const term of ['json', 'qr', 'password', 'convert', 'encode', 'a']) {
      for (const hit of searchTools(term)) {
        expect(plannedIds.has(hit.id), `${hit.id} surfaced for "${term}"`).toBe(false);
      }
    }
  });

  it('requires every term to match', () => {
    expect(searchTools('pdf zzzzz')).toEqual([]);
  });

  it('is case insensitive', () => {
    expect(searchTools('MERGE PDF')[0].id).toBe('pdf-merger');
  });
});

describe('getRelatedTools', () => {
  it('never suggests the tool you are already on', () => {
    for (const tool of TOOLS) {
      expect(getRelatedTools(tool).map((item) => item.id)).not.toContain(tool.id);
    }
  });

  it('puts same-group tools before the rest of the category', () => {
    const merge = TOOLS.find((tool) => tool.id === 'pdf-merger')!;
    const related = getRelatedTools(merge, 3);
    expect(related.every((tool) => tool.category === 'pdf')).toBe(true);
    expect(related[0].group).toBe(merge.group);
  });

  it('respects the limit', () => {
    expect(getRelatedTools(TOOLS[0], 2)).toHaveLength(2);
  });
});
