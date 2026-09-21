import { getTool, toolPath } from '@/lib/tools/registry';
import { constructMetadata } from '@/lib/seo';
import ToolShell from '@/components/tool/ToolShell';
import ExcelToPdfClient from '@/components/tools/ExcelToPdfClient';

const tool = getTool('excel-to-pdf')!;

export const metadata = constructMetadata({
  title: 'Excel to PDF — convert .xlsx and .csv in your browser | OmniTool',
  description:
    'Turn spreadsheets into clean PDF tables without uploading them. One section per worksheet, headers repeated on every page. Free and private.',
  canonical: toolPath(tool),
});

export default function ExcelToPdfPage() {
  return (
    <ToolShell
      tool={tool}
      steps={[
        'Drop .xlsx or .csv files onto the box above.',
        'Pick a page size and say whether the first row is a header.',
        'Select Convert to PDF, then save the result.',
      ]}
      faq={[
        {
          question: 'Does it keep my formulas and formatting?',
          answer:
            'Formulas are rendered as their calculated values, which is what a printed table should show. Cell colours and fonts are replaced by one consistent table style.',
        },
        {
          question: 'What happens to multiple worksheets?',
          answer:
            'Each worksheet becomes its own section, titled with the sheet name. By default every sheet starts on a new page, which you can turn off.',
        },
        {
          question: 'My table is too wide for the page.',
          answer:
            'Switch the orientation to landscape. Long cell values wrap rather than being cut off, so wide tables stay readable either way.',
        },
        {
          question: 'Is the spreadsheet uploaded to a server?',
          answer:
            'No. The file is read and rendered by your own browser. Nothing is transmitted, which the byte counter on this page shows live.',
        },
      ]}
    >
      <ExcelToPdfClient />
    </ToolShell>
  );
}
