'use client';

import FileWorkbench from '@/components/tool/FileWorkbench';
import { useFileJob } from '@/components/tool/useFileJob';
import { Field, OptionGrid, Select, Slider } from '@/components/tool/Controls';
import { renderHtmlToPdf, type PageSetup } from '@/lib/pdf/htmlToPdf';

interface Options extends PageSetup {
  font: 'helvetica' | 'times';
}

export default function WordToPdfClient() {
  const job = useFileJob<Options>({
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    multiple: true,
    initialOptions: { format: 'a4', orientation: 'portrait', margin: 20, font: 'helvetica' },
    run: async (files, options, context) => {
      // mammoth is ~200 KB; loading it only when a conversion actually runs
      // keeps it off the initial page bundle.
      const mammoth = await import('mammoth');
      const outputs = [];

      for (const [index, file] of files.entries()) {
        context.progress(index / files.length, `Converting ${file.name}`);

        const arrayBuffer = await file.arrayBuffer();
        const { value: html, messages } = await mammoth.convertToHtml({ arrayBuffer });

        if (!html.trim()) {
          throw new Error(
            `${file.name} has no readable text. Legacy .doc files are not supported — re-save it as .docx first.`,
          );
        }

        const blob = await renderHtmlToPdf(html, options);
        const unsupported = messages.filter((message) => message.type === 'warning').length;

        outputs.push({
          name: file.name.replace(/\.docx?$/i, '') + '.pdf',
          blob,
          note: unsupported
            ? `${(blob.size / 1024).toFixed(0)} KB · ${unsupported} element${unsupported === 1 ? '' : 's'} simplified`
            : undefined,
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
      dropLabel="Drop Word documents here"
      dropHint=".docx · processed in your browser"
      options={
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
          <Field label="Orientation">
            <Select
              value={job.options.orientation}
              onChange={(orientation) => job.setOptions({ orientation })}
              options={[
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
              ]}
            />
          </Field>
          <Field label="Typeface">
            <Select
              value={job.options.font}
              onChange={(font) => job.setOptions({ font })}
              options={[
                { value: 'helvetica', label: 'Sans serif' },
                { value: 'times', label: 'Serif' },
              ]}
            />
          </Field>
          <Field label="Margin">
            <Slider
              value={job.options.margin}
              onChange={(margin) => job.setOptions({ margin })}
              min={10}
              max={40}
              format={(value) => `${value} mm`}
            />
          </Field>
        </OptionGrid>
      }
    />
  );
}
