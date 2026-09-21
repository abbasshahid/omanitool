'use client';

import FileWorkbench from '@/components/tool/FileWorkbench';
import { useFileJob } from '@/components/tool/useFileJob';
import { Field, OptionGrid, Select, Toggle } from '@/components/tool/Controls';
import { extractPages, groupIntoLines, lineToString } from '@/lib/pdf/text';

interface Options {
  pageBreaks: boolean;
  detectHeadings: boolean;
  font: 'Calibri' | 'Times New Roman' | 'Arial';
}

export default function PdfToWordClient() {
  const job = useFileJob<Options>({
    accept: 'application/pdf,.pdf',
    multiple: false,
    initialOptions: { pageBreaks: true, detectHeadings: true, font: 'Calibri' },
    run: async (files, options, context) => {
      const file = files[0];
      context.progress(0.05, 'Reading document');

      const pages = await extractPages(await file.arrayBuffer(), (done, total) => {
        context.progress(0.05 + (done / total) * 0.7, `Reading page ${done} of ${total}`);
      });

      const totalItems = pages.reduce((sum, page) => sum + page.items.length, 0);
      if (totalItems === 0) {
        throw new Error(
          'No text found. This looks like a scanned PDF — run it through OCR PDF first, then convert.',
        );
      }

      context.progress(0.8, 'Building document');
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

      // Body text size is whatever height occurs most often; anything clearly
      // larger is treated as a heading.
      const heights = pages.flatMap((page) => page.items.map((item) => Math.round(item.height)));
      const frequency = new Map<number, number>();
      for (const height of heights) frequency.set(height, (frequency.get(height) ?? 0) + 1);
      const bodyHeight =
        [...frequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 11;

      const paragraphs: InstanceType<typeof Paragraph>[] = [];

      pages.forEach((page, pageIndex) => {
        for (const line of groupIntoLines(page.items)) {
          const text = lineToString(line);
          if (!text) continue;

          const lineHeight = Math.max(...line.map((item) => item.height));
          const isHeading = options.detectHeadings && lineHeight >= bodyHeight * 1.25;

          paragraphs.push(
            new Paragraph({
              heading: isHeading
                ? lineHeight >= bodyHeight * 1.6
                  ? HeadingLevel.HEADING_1
                  : HeadingLevel.HEADING_2
                : undefined,
              children: [
                new TextRun({
                  text,
                  font: options.font,
                  size: isHeading ? undefined : 22, // half-points: 22 = 11pt
                }),
              ],
            }),
          );
        }

        if (options.pageBreaks && pageIndex < pages.length - 1) {
          paragraphs.push(new Paragraph({ children: [], pageBreakBefore: true }));
        }
      });

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);

      context.progress(1, 'Done');
      return [
        {
          name: file.name.replace(/\.pdf$/i, '') + '.docx',
          blob,
          note: `${pages.length} page${pages.length === 1 ? '' : 's'} · ${paragraphs.length} paragraphs`,
        },
      ];
    },
  });

  return (
    <FileWorkbench
      job={job}
      actionLabel="Convert to Word"
      dropLabel="Drop a PDF here"
      dropHint="PDF · text is extracted in your browser"
      options={
        <div className="flex flex-col gap-4">
          <OptionGrid cols={1}>
            <Field label="Font in the Word file">
              <Select
                value={job.options.font}
                onChange={(font) => job.setOptions({ font })}
                options={[
                  { value: 'Calibri', label: 'Calibri' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Times New Roman', label: 'Times New Roman' },
                ]}
              />
            </Field>
          </OptionGrid>
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4">
            <Toggle
              checked={job.options.detectHeadings}
              onChange={(detectHeadings) => job.setOptions({ detectHeadings })}
              label="Detect headings"
              hint="Treats noticeably larger text as a heading."
            />
            <Toggle
              checked={job.options.pageBreaks}
              onChange={(pageBreaks) => job.setOptions({ pageBreaks })}
              label="Keep page breaks"
            />
          </div>
          <p className="rounded-[var(--radius-md)] bg-[var(--surface-2)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
            Text, headings and paragraph order are preserved. Columns, images and exact positioning
            are not — the result is an editable document, not a pixel copy.
          </p>
        </div>
      }
    />
  );
}
