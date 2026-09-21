import { getTool, toolPath } from '@/lib/tools/registry';
import { constructMetadata } from '@/lib/seo';
import ToolShell from '@/components/tool/ToolShell';
import WordToPdfClient from '@/components/tools/WordToPdfClient';

const tool = getTool('word-to-pdf')!;

export const metadata = constructMetadata({
  title: 'Word to PDF — convert .docx in your browser, free | OmniTool',
  description:
    'Convert Word documents to PDF without uploading them. Headings, lists and tables are kept, and the text stays selectable. Free, no sign-up.',
  canonical: toolPath(tool),
});

export default function WordToPdfPage() {
  return (
    <ToolShell
      tool={tool}
      steps={[
        'Drop one or more .docx files onto the box above.',
        'Choose the page size, orientation and margin you want.',
        'Select Convert to PDF, then save the result.',
      ]}
      faq={[
        {
          question: 'Are my documents uploaded anywhere?',
          answer:
            'No. The conversion runs entirely in your browser, so the file never leaves your machine. The byte counter at the top of the page measures exactly this.',
        },
        {
          question: 'Can it convert old .doc files?',
          answer:
            'Only .docx. The older .doc format is binary with no practical browser-side reader. Open it in Word or LibreOffice and save it as .docx first.',
        },
        {
          question: 'Will the PDF look exactly like the Word document?',
          answer:
            'Not exactly. Text, headings, lists, bold and italic, and tables are reproduced, and the text stays selectable and searchable. Images, precise positioning and unusual fonts are not carried over.',
        },
        {
          question: 'Is there a file size limit?',
          answer:
            'No account limits. The practical ceiling is your browser memory — files up to about 200 MB are accepted, and you can convert several at once.',
        },
      ]}
    >
      <WordToPdfClient />
    </ToolShell>
  );
}
