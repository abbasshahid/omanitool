import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import JPGToPDFClient from '@/components/tools/JPGToPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('jpg-to-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Convert Images to PDF for Free | OmniTool`,
    description: tool?.description || 'Convert JPG, PNG, and WEBP images to PDF online for free. Combine multiple images into a single PDF document. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function JPGToPDFPage() {
  const tool = getToolById('jpg-to-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <JPGToPDFClient />
    </>
  );
}
