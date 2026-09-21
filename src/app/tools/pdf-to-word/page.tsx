import { getTool, toolPath } from '@/lib/tools/registry';
import { constructMetadata } from '@/lib/seo';
import ToolShell from '@/components/tool/ToolShell';
import PdfToWordClient from '@/components/tools/PdfToWordClient';

const tool = getTool('pdf-to-word')!;

export const metadata = constructMetadata({
  title: 'PDF to Word — get an editable .docx, free | OmniTool',
  description:
    'Extract the text from a PDF into a real, editable Word document. Runs in your browser, so the PDF is never uploaded. Free, no sign-up.',
  canonical: toolPath(tool),
});

export default function PdfToWordPage() {
  return (
    <ToolShell
      tool={tool}
      steps={[
        'Drop a PDF onto the box above.',
        'Choose a font, and whether to detect headings and keep page breaks.',
        'Select Convert to Word, then save the .docx.',
      ]}
      faq={[
        {
          question: 'How faithful is the conversion?',
          answer:
            'You get the text in reading order, with headings detected by font size and paragraphs preserved — an editable document rather than a pixel-perfect copy. Multi-column layouts, images and exact positioning are not reproduced.',
        },
        {
          question: 'It says no text was found.',
          answer:
            'The PDF is almost certainly a scan: a picture of a page with no text layer. Run it through the OCR PDF tool first to create that text layer, then convert.',
        },
        {
          question: 'Is the file uploaded?',
          answer:
            'No. Both the text extraction and the Word file are produced in your browser, and nothing is sent to a server.',
        },
        {
          question: 'How are headings detected?',
          answer:
            'The most common text size in the document is treated as body text, and lines noticeably larger than that become Heading 1 or Heading 2. Switch it off if it guesses wrong for your document.',
        },
      ]}
    >
      <PdfToWordClient />
    </ToolShell>
  );
}
