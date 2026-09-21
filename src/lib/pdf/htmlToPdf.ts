
/**
 * Lays HTML out as flowing text in a PDF.
 *
 * The obvious alternative is html2canvas, which screenshots the DOM. That gives
 * pixel fidelity but produces a PDF of images: unsearchable, unselectable, and
 * many times larger. Documents converted here are mostly prose, so drawing real
 * text is the better trade — the output stays selectable and a few hundred
 * kilobytes rather than several megabytes.
 */

export interface PageSetup {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  /** Page margin in millimetres. */
  margin: number;
}

export const DEFAULT_PAGE_SETUP: PageSetup = {
  format: 'a4',
  orientation: 'portrait',
  margin: 20,
};

interface Run {
  text: string;
  bold: boolean;
  italic: boolean;
}

interface Block {
  kind: 'heading' | 'paragraph' | 'listItem' | 'quote' | 'code' | 'rule' | 'table';
  runs: Run[];
  level?: number;
  /** Marker for list items, e.g. "•" or "3.". */
  marker?: string;
  rows?: string[][];
}

const HEADING_SIZES: Record<number, number> = { 1: 20, 2: 16, 3: 14, 4: 12, 5: 11, 6: 10 };
const BODY_SIZE = 11;
const LINE_FACTOR = 1.45;

/** Walks an element's inline content into styled runs. */
function collectRuns(node: Node, inherited: { bold: boolean; italic: boolean }): Run[] {
  const runs: Run[] = [];

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = (child.textContent ?? '').replace(/\s+/g, ' ');
      if (text) runs.push({ text, ...inherited });
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const element = child as Element;
    const tag = element.tagName.toLowerCase();
    if (tag === 'br') {
      runs.push({ text: '\n', ...inherited });
      continue;
    }

    runs.push(
      ...collectRuns(element, {
        bold: inherited.bold || tag === 'b' || tag === 'strong' || /^h[1-6]$/.test(tag),
        italic: inherited.italic || tag === 'i' || tag === 'em',
      }),
    );
  }

  return runs;
}

function tableRows(table: Element): string[][] {
  return Array.from(table.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('th,td')).map((cell) =>
      (cell.textContent ?? '').replace(/\s+/g, ' ').trim(),
    ),
  );
}

/** Flattens an HTML document into the block sequence the renderer draws. */
export function parseBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks: Block[] = [];

  function walk(node: Element) {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        blocks.push({
          kind: 'heading',
          level: Number(tag[1]),
          runs: collectRuns(child, { bold: true, italic: false }),
        });
      } else if (tag === 'p') {
        const runs = collectRuns(child, { bold: false, italic: false });
        if (runs.some((run) => run.text.trim())) blocks.push({ kind: 'paragraph', runs });
      } else if (tag === 'ul' || tag === 'ol') {
        const ordered = tag === 'ol';
        Array.from(child.children).forEach((item, index) => {
          if (item.tagName.toLowerCase() !== 'li') return;
          blocks.push({
            kind: 'listItem',
            marker: ordered ? `${index + 1}.` : '•',
            runs: collectRuns(item, { bold: false, italic: false }),
          });
        });
      } else if (tag === 'blockquote') {
        blocks.push({ kind: 'quote', runs: collectRuns(child, { bold: false, italic: true }) });
      } else if (tag === 'pre') {
        blocks.push({
          kind: 'code',
          runs: [{ text: child.textContent ?? '', bold: false, italic: false }],
        });
      } else if (tag === 'hr') {
        blocks.push({ kind: 'rule', runs: [] });
      } else if (tag === 'table') {
        blocks.push({ kind: 'table', runs: [], rows: tableRows(child) });
      } else if (tag === 'img' || tag === 'script' || tag === 'style') {
        // Images are skipped: embedding them would mean rasterising, which is
        // the trade this renderer exists to avoid.
        continue;
      } else {
        walk(child);
      }
    }
  }

  walk(doc.body);
  return blocks;
}

/** Splits runs into words, keeping each word's style, for wrapping. */
function runsToWords(runs: Run[]): Run[] {
  const words: Run[] = [];
  for (const run of runs) {
    for (const piece of run.text.split(/(\n)/)) {
      if (piece === '\n') {
        words.push({ text: '\n', bold: run.bold, italic: run.italic });
        continue;
      }
      for (const word of piece.split(' ')) {
        if (word) words.push({ text: word, bold: run.bold, italic: run.italic });
      }
    }
  }
  return words;
}

function fontStyle(bold: boolean, italic: boolean) {
  if (bold && italic) return 'bolditalic';
  if (bold) return 'bold';
  if (italic) return 'italic';
  return 'normal';
}

export interface RenderOptions extends PageSetup {
  /** Base font family; jsPDF's built-in faces cover Latin text. */
  font?: 'helvetica' | 'times' | 'courier';
}

export async function renderHtmlToPdf(
  html: string,
  options: RenderOptions = { ...DEFAULT_PAGE_SETUP },
): Promise<Blob> {
  const { jsPDF: JsPDF } = await import('jspdf');
  const doc = new JsPDF({
    unit: 'mm',
    format: options.format,
    orientation: options.orientation,
  });

  const font = options.font ?? 'helvetica';
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { margin } = options;
  const contentWidth = pageWidth - margin * 2;

  let cursorY = margin;

  function ensureSpace(height: number) {
    if (cursorY + height <= pageHeight - margin) return;
    doc.addPage();
    cursorY = margin;
  }

  /** Draws wrapped, styled text and advances the cursor. */
  function drawRuns(runs: Run[], size: number, indent: number, marker?: string) {
    doc.setFontSize(size);
    const lineHeight = (size * LINE_FACTOR) / 2.835; // pt → mm
    const width = contentWidth - indent;
    const words = runsToWords(runs);

    let line: Run[] = [];
    let lineWidth = 0;
    let firstLine = true;

    const flush = () => {
      if (!line.length) return;
      ensureSpace(lineHeight);

      let x = margin + indent;
      if (marker && firstLine) {
        doc.setFont(font, 'normal');
        doc.text(marker, margin + indent - 6, cursorY + lineHeight * 0.75);
      }

      for (const word of line) {
        doc.setFont(font, fontStyle(word.bold, word.italic));
        doc.text(word.text, x, cursorY + lineHeight * 0.75);
        x += doc.getTextWidth(`${word.text} `);
      }

      cursorY += lineHeight;
      line = [];
      lineWidth = 0;
      firstLine = false;
    };

    for (const word of words) {
      if (word.text === '\n') {
        flush();
        continue;
      }
      doc.setFont(font, fontStyle(word.bold, word.italic));
      const wordWidth = doc.getTextWidth(`${word.text} `);
      if (lineWidth + wordWidth > width && line.length) flush();
      line.push(word);
      lineWidth += wordWidth;
    }
    flush();
  }

  for (const block of parseBlocks(html)) {
    switch (block.kind) {
      case 'heading': {
        const size = HEADING_SIZES[block.level ?? 2] ?? 14;
        cursorY += size / 6;
        drawRuns(block.runs, size, 0);
        cursorY += 1.5;
        break;
      }
      case 'paragraph':
        drawRuns(block.runs, BODY_SIZE, 0);
        cursorY += 2.5;
        break;
      case 'listItem':
        drawRuns(block.runs, BODY_SIZE, 8, block.marker);
        cursorY += 1;
        break;
      case 'quote':
        drawRuns(block.runs, BODY_SIZE, 8);
        cursorY += 2.5;
        break;
      case 'code': {
        const text = block.runs[0]?.text ?? '';
        doc.setFontSize(9.5);
        const lineHeight = (9.5 * 1.35) / 2.835;
        for (const rawLine of text.split('\n')) {
          for (const wrapped of doc.splitTextToSize(rawLine || ' ', contentWidth - 4) as string[]) {
            ensureSpace(lineHeight);
            doc.setFont('courier', 'normal');
            doc.text(wrapped, margin + 4, cursorY + lineHeight * 0.75);
            cursorY += lineHeight;
          }
        }
        cursorY += 2.5;
        break;
      }
      case 'rule':
        ensureSpace(4);
        doc.setDrawColor(200);
        doc.line(margin, cursorY + 2, pageWidth - margin, cursorY + 2);
        cursorY += 5;
        break;
      case 'table': {
        const rows = block.rows ?? [];
        if (!rows.length) break;
        const { default: autoTable } = await import('jspdf-autotable');
        autoTable(doc, {
          head: rows.length > 1 ? [rows[0]] : undefined,
          body: rows.length > 1 ? rows.slice(1) : rows,
          startY: cursorY,
          margin: { left: margin, right: margin },
          styles: { fontSize: 9, cellPadding: 2, font },
          headStyles: { fillColor: [232, 150, 17], textColor: [13, 27, 42] },
        });
        // autoTable tracks its own cursor on the document.
        const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
          ?.finalY;
        cursorY = (finalY ?? cursorY) + 4;
        break;
      }
    }
  }

  return doc.output('blob');
}
