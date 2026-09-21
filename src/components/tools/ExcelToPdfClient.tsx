'use client';

import FileWorkbench from '@/components/tool/FileWorkbench';
import { useFileJob } from '@/components/tool/useFileJob';
import { Field, OptionGrid, Select, Toggle } from '@/components/tool/Controls';
import { parseCsv } from '@/lib/text/csv';

interface Options {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  headerRow: boolean;
  sheetPerPage: boolean;
}

/** Reads a worksheet into a rectangular array of display strings. */
function sheetToRows(worksheet: {
  rowCount: number;
  getRow: (index: number) => { getCell: (index: number) => { text?: string } };
  columnCount: number;
}): string[][] {
  const rows: string[][] = [];
  for (let r = 1; r <= worksheet.rowCount; r += 1) {
    const row = worksheet.getRow(r);
    const cells: string[] = [];
    for (let c = 1; c <= worksheet.columnCount; c += 1) {
      cells.push((row.getCell(c).text ?? '').trim());
    }
    if (cells.some((cell) => cell.length)) rows.push(cells);
  }
  return rows;
}

export default function ExcelToPdfClient() {
  const job = useFileJob<Options>({
    accept: '.xlsx,.xlsm,.csv,text/csv',
    multiple: true,
    initialOptions: {
      format: 'a4',
      orientation: 'landscape',
      headerRow: true,
      sheetPerPage: true,
    },
    run: async (files, options, context) => {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);

      const outputs = [];

      for (const [index, file] of files.entries()) {
        context.progress(index / files.length, `Reading ${file.name}`);

        const sheets: { name: string; rows: string[][] }[] = [];

        if (/\.csv$/i.test(file.name)) {
          sheets.push({ name: 'Sheet 1', rows: parseCsv(await file.text()) });
        } else {
          const ExcelJS = await import('exceljs');
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(await file.arrayBuffer());
          workbook.eachSheet((worksheet) => {
            const rows = sheetToRows(worksheet as never);
            if (rows.length) sheets.push({ name: worksheet.name, rows });
          });
        }

        if (!sheets.length) throw new Error(`${file.name} has no rows to convert.`);

        const doc = new jsPDF({
          unit: 'mm',
          format: options.format,
          orientation: options.orientation,
        });

        sheets.forEach((sheet, sheetIndex) => {
          if (sheetIndex > 0 && options.sheetPerPage) doc.addPage();

          const startY = options.sheetPerPage || sheetIndex === 0 ? 18 : undefined;
          doc.setFontSize(11);
          doc.text(sheet.name, 14, 12);

          autoTable(doc, {
            head: options.headerRow && sheet.rows.length > 1 ? [sheet.rows[0]] : undefined,
            body: options.headerRow && sheet.rows.length > 1 ? sheet.rows.slice(1) : sheet.rows,
            startY,
            styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' },
            headStyles: { fillColor: [232, 150, 17], textColor: [13, 27, 42], fontStyle: 'bold' },
            margin: { top: 18, left: 10, right: 10, bottom: 12 },
          });
        });

        outputs.push({
          name: file.name.replace(/\.(xlsx|xlsm|csv)$/i, '') + '.pdf',
          blob: doc.output('blob'),
          note: `${sheets.length} sheet${sheets.length === 1 ? '' : 's'}`,
        });
      }

      context.progress(1, 'Done');
      return outputs;
    },
  });

  return (
    <FileWorkbench
      job={job}
      actionLabel={job.files.length > 1 ? `Convert ${job.files.length} files` : 'Convert to PDF'}
      dropLabel="Drop spreadsheets here"
      dropHint=".xlsx or .csv · processed in your browser"
      options={
        <div className="flex flex-col gap-4">
          <OptionGrid cols={2}>
            <Field label="Page size">
              <Select
                value={job.options.format}
                onChange={(format) => job.setOptions({ format })}
                options={[
                  { value: 'a4', label: 'A4' },
                  { value: 'letter', label: 'Letter' },
                ]}
              />
            </Field>
            <Field label="Orientation" hint="Landscape fits more columns.">
              <Select
                value={job.options.orientation}
                onChange={(orientation) => job.setOptions({ orientation })}
                options={[
                  { value: 'landscape', label: 'Landscape' },
                  { value: 'portrait', label: 'Portrait' },
                ]}
              />
            </Field>
          </OptionGrid>
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4">
            <Toggle
              checked={job.options.headerRow}
              onChange={(headerRow) => job.setOptions({ headerRow })}
              label="First row is a header"
              hint="Repeats it at the top of every page."
            />
            <Toggle
              checked={job.options.sheetPerPage}
              onChange={(sheetPerPage) => job.setOptions({ sheetPerPage })}
              label="Start each worksheet on a new page"
            />
          </div>
        </div>
      }
    />
  );
}
