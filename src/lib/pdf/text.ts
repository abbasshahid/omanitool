/**
 * Text extraction built on pdf.js.
 *
 * Several tools need the words out of a PDF — PDF to Word, PDF to Excel and
 * Compare PDF — and each needs slightly different structure, so extraction
 * returns positioned items and the callers decide how to group them.
 */

export interface TextItem {
  text: string;
  /** Page coordinates, origin bottom-left, in PDF points. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageText {
  pageNumber: number;
  items: TextItem[];
  width: number;
  height: number;
}

/**
 * pdf.js ships as an ES module and needs its worker configured before use. The
 * worker file is served from /public, so this works offline and costs no
 * third-party request.
 */
export async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/lib/pdfjs/build/pdf.worker.mjs';
  return pdfjs;
}

export async function extractPages(
  data: ArrayBuffer,
  onProgress?: (done: number, total: number) => void,
): Promise<PageText[]> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const pages: PageText[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();

      const items: TextItem[] = [];
      for (const raw of content.items) {
        // pdf.js yields TextItem and TextMarkedContent; only the former has str.
        if (!('str' in raw) || !raw.str.trim()) continue;
        const transform = raw.transform as number[];
        items.push({
          text: raw.str,
          x: transform[4],
          y: transform[5],
          width: raw.width ?? 0,
          height: raw.height ?? Math.abs(transform[3]) ?? 0,
        });
      }

      pages.push({
        pageNumber,
        items,
        width: viewport.width,
        height: viewport.height,
      });

      page.cleanup();
      onProgress?.(pageNumber, doc.numPages);
    }
  } finally {
    await doc.destroy();
  }

  return pages;
}

/**
 * Groups items into visual lines by their baseline, then sorts each line
 * left-to-right. PDFs emit text in drawing order, which is often not reading
 * order, so this is what makes the output legible.
 */
export function groupIntoLines(items: TextItem[], tolerance = 2): TextItem[][] {
  if (!items.length) return [];

  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: TextItem[][] = [];
  let current: TextItem[] = [sorted[0]];
  let baseline = sorted[0].y;

  for (const item of sorted.slice(1)) {
    if (Math.abs(item.y - baseline) <= tolerance) {
      current.push(item);
    } else {
      lines.push(current.sort((a, b) => a.x - b.x));
      current = [item];
      baseline = item.y;
    }
  }
  lines.push(current.sort((a, b) => a.x - b.x));

  return lines;
}

/**
 * Joins a line's items, inserting a space only where the horizontal gap implies
 * one. Without this, PDFs that emit each glyph run separately come out as
 * "Th isi sat est".
 */
export function lineToString(line: TextItem[]): string {
  let out = '';
  for (let i = 0; i < line.length; i += 1) {
    const item = line[i];
    if (i > 0) {
      const previous = line[i - 1];
      const gap = item.x - (previous.x + previous.width);
      // A gap wider than a quarter of the font size reads as a space.
      const threshold = Math.max(1, previous.height * 0.25);
      if (gap > threshold && !out.endsWith(' ') && !item.text.startsWith(' ')) out += ' ';
    }
    out += item.text;
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Plain text of a page, one line per visual line. */
export function pageToText(page: PageText): string {
  return groupIntoLines(page.items)
    .map(lineToString)
    .filter(Boolean)
    .join('\n');
}

/** Plain text of a whole document. */
export function pagesToText(pages: PageText[]): string {
  return pages.map(pageToText).join('\n\n');
}

/**
 * Splits lines into columns by clustering the x positions used across the page.
 * Real PDFs have no table structure, so this infers one: a column boundary is a
 * horizontal position that many lines start a run at.
 */
export function linesToRows(lines: TextItem[][], columnTolerance = 12): string[][] {
  if (!lines.length) return [];

  // Collect every run start, then merge starts that sit within the tolerance.
  const starts: number[] = [];
  for (const line of lines) {
    for (const item of line) starts.push(item.x);
  }
  starts.sort((a, b) => a - b);

  const boundaries: number[] = [];
  for (const start of starts) {
    if (!boundaries.length || start - boundaries[boundaries.length - 1] > columnTolerance) {
      boundaries.push(start);
    }
  }

  return lines.map((line) => {
    const cells: string[] = new Array(boundaries.length).fill('');
    for (const item of line) {
      // Nearest boundary at or before this item.
      let index = 0;
      for (let i = 0; i < boundaries.length; i += 1) {
        if (item.x + columnTolerance >= boundaries[i]) index = i;
        else break;
      }
      cells[index] = cells[index] ? `${cells[index]} ${item.text}` : item.text;
    }
    return cells.map((cell) => cell.replace(/\s+/g, ' ').trim());
  });
}

/** Drops all-empty columns left behind by the clustering above. */
export function pruneEmptyColumns(rows: string[][]): string[][] {
  if (!rows.length) return rows;
  const width = Math.max(...rows.map((row) => row.length));
  const keep: number[] = [];
  for (let column = 0; column < width; column += 1) {
    if (rows.some((row) => (row[column] ?? '').length > 0)) keep.push(column);
  }
  return rows.map((row) => keep.map((column) => row[column] ?? ''));
}
