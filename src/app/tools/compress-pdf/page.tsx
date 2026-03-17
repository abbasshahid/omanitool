import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import CompressPDFClient from '@/components/tools/CompressPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('compress-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Reduce PDF File Size for Free | OmniTool`,
    description: tool?.description || 'Compress PDF files online for free. Reduce file size while maintaining the best possible quality. Secure, fast, and easy to use.',
    canonical: tool?.path,
  });
}

export default function CompressPDFPage() {
  const tool = getToolById('compress-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CompressPDFClient />
    </>
  );
}
