import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import PDFToJPGClient from '@/components/tools/PDFToJPGClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-to-jpg');
  return constructMetadata({
    title: `${tool?.name} Online - Extract High-Quality JPG from PDF | OmniTool`,
    description: tool?.description || 'Convert PDF pages to high-quality JPG images online for free. Extract images from your PDF documents instantly. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function PDFToJPGPage() {
  const tool = getToolById('pdf-to-jpg');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <PDFToJPGClient />
    </>
  );
}
