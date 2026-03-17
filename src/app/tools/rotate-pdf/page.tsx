import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import RotatePDFClient from '@/components/tools/RotatePDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('rotate-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Rotate PDF Pages for Free | OmniTool`,
    description: tool?.description || 'Rotate PDF pages online for free. Permanently rotate individual pages or the entire document. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function RotatePDFPage() {
  const tool = getToolById('rotate-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <RotatePDFClient />
    </>
  );
}
