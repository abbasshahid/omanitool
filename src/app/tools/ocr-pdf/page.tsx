import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import OCRPDFClient from '@/components/tools/OCRPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('ocr-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Extract Text from PDF and Images for Free | OmniTool`,
    description: tool?.description || 'Convert non-selectable PDF and images into searchable, editable text online for free. Fast, accurate, and secure browser-based OCR.',
    canonical: tool?.path,
  });
}

export default function OCRPDFPage() {
  const tool = getToolById('ocr-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <OCRPDFClient />
    </>
  );
}
