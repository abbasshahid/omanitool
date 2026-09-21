import { getTool, toolPath } from '@/lib/tools/registry';
import { constructMetadata } from '@/lib/seo';
import ToolShell from '@/components/tool/ToolShell';
import PdfToExcelClient from '@/components/tools/PdfToExcelClient';

const tool = getTool('pdf-to-excel')!;

export const metadata = constructMetadata({
  title: 'PDF to Excel — pull tables into a spreadsheet, free | OmniTool',
  description:
    'Detect rows and columns in a PDF and export them to .xlsx or CSV. Runs in your browser, so the PDF is never uploaded. Free, no sign-up.',
  canonical: toolPath(tool),
});

export default function PdfToExcelPage() {
  return (
    <ToolShell
      tool={tool}
      steps={[
        'Drop a PDF onto the box above.',
        'Choose Excel or CSV, and whether each page becomes its own worksheet.',
        'Adjust column sensitivity if the columns come out wrong, then export.',
      ]}
      faq={[
        {
          question: 'Why are my columns split incorrectly?',
          answer:
            'A PDF does not store tables as tables — it stores text at coordinates, and the columns are inferred from where that text sits. Raise the column sensitivity to merge columns that were wrongly split, or lower it to separate columns that were wrongly merged.',
        },
        {
          question: 'Which PDFs convert best?',
          answer:
            'Tables with consistent column alignment and one line per row. Merged cells, text that wraps inside a cell, and nested tables are where the inference struggles.',
        },
        {
          question: 'It found no text at all.',
          answer:
            'The PDF is a scan with no text layer. Run OCR PDF on it first, then come back here.',
        },
        {
          question: 'Is my PDF uploaded?',
          answer:
            'No. The text extraction and the spreadsheet are both produced in your browser, and nothing is transmitted.',
        },
      ]}
    >
      <PdfToExcelClient />
    </ToolShell>
  );
}
