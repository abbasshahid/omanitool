import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import PDFMergerClient from '@/components/tools/PDFMergerClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-merger');
  return constructMetadata({
    title: `${tool?.name} Online - Merge PDF Files for Free | OmniTool`,
    description: tool?.description || 'Combine multiple PDF files into one document online for free. Secure and fast PDF merger tool.',
    canonical: tool?.path,
  });
}

export default function PDFMergerPage() {
  const tool = getToolById('pdf-merger');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <PDFMergerClient />
    </>
  );
}
