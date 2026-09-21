'use client';

import FileWorkbench from '@/components/tool/FileWorkbench';
import { useFileJob } from '@/components/tool/useFileJob';
import { Field, OptionGrid, Select, Slider } from '@/components/tool/Controls';
import { extractPages, groupIntoLines, linesToRows, pruneEmptyColumns } from '@/lib/pdf/text';
import { toCsv } from '@/lib/text/csv';

interface Options {
  output: 'xlsx' | 'csv';
  columnTolerance: number;
  sheets: 'per-page' | 'single';
}

export default function PdfToExcelClient() {
  const job = useFileJob<Options>({
    accept: 'application/pdf,.pdf',
    multiple: false,
    initialOptions: { output: 'xlsx', columnTolerance: 12, sheets: 'per-page' },
    run: async (files, options, context) => {
      const file = files[0];
      context.progress(0.05, 'Reading document');

      const pages = await extractPages(await file.arrayBuffer(), (done, total) => {
        context.progress(0.05 + (done / total) * 0.7, `Reading page ${done} of ${total}`);
      });

      const perPage = pages.map((page) =>
        pruneEmptyColumns(linesToRows(groupIntoLines(page.items), options.columnTolerance)),
      );
      const totalRows = perPage.reduce((sum, rows) => sum + rows.length, 0);

      if (totalRows === 0) {
        throw new Error(
          'No text found. Scanned PDFs have no extractable text — run OCR PDF first.',
        );
      }

      context.progress(0.85, 'Building spreadsheet');
      const base = file.name.replace(/\.pdf$/i, '');

      if (options.output === 'csv') {
        const rows = options.sheets === 'single' ? perPage.flat() : perPage.flat();
        const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' });
        context.progress(1, 'Done');
        return [{ name: `${base}.csv`, blob, note: `${rows.length} rows` }];
      }

      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'OmniTool';

      if (options.sheets === 'single') {
        const sheet = workbook.addWorksheet('Extracted');
        for (const rows of perPage) for (const row of rows) sheet.addRow(row);
      } else {
        perPage.forEach((rows, index) => {
          if (!rows.length) return;
          const sheet = workbook.addWorksheet(`Page ${index + 1}`);
          for (const row of rows) sheet.addRow(row);
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      context.progress(1, 'Done');
      return [
        {
          name: `${base}.xlsx`,
          blob,
          note: `${totalRows} rows across ${pages.length} page${pages.length === 1 ? '' : 's'}`,
        },
      ];
    },
  });

  return (
    <FileWorkbench
      job={job}
      actionLabel="Extract to spreadsheet"
      dropLabel="Drop a PDF here"
      dropHint="PDF · tables are detected in your browser"
      options={
        <div className="flex flex-col gap-4">
          <OptionGrid cols={2}>
            <Field label="Output format">
              <Select
                value={job.options.output}
                onChange={(output) => job.setOptions({ output })}
                options={[
                  { value: 'xlsx', label: 'Excel (.xlsx)' },
                  { value: 'csv', label: 'CSV' },
                ]}
              />
            </Field>
            <Field label="Worksheets">
              <Select
                value={job.options.sheets}
                onChange={(sheets) => job.setOptions({ sheets })}
                options={[
                  { value: 'per-page', label: 'One per PDF page' },
                  { value: 'single', label: 'All in one sheet' },
                ]}
              />
            </Field>
          </OptionGrid>

          <Field
            label="Column sensitivity"
            hint="Lower splits columns more eagerly; raise it if one column is being cut in two."
          >
            <Slider
              value={job.options.columnTolerance}
              onChange={(columnTolerance) => job.setOptions({ columnTolerance })}
              min={4}
              max={40}
              format={(value) => `${value} pt`}
            />
          </Field>

          <p className="rounded-[var(--radius-md)] bg-[var(--surface-2)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
            PDFs do not store tables as tables — columns are inferred from where the text sits on
            the page. Clean, ruled tables convert well; dense or merged layouts may need the
            sensitivity adjusted.
          </p>
        </div>
      }
    />
  );
}
