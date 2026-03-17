import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AddWatermarkClient from '@/components/tools/AddWatermarkClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('add-watermark');
  return constructMetadata({
    title: `${tool?.name} Online - Stamp Text or Images on PDF for Free | OmniTool`,
    description: tool?.description || 'Add watermarks to your PDF online for free. Protect your documents with custom text or image stamps. Secure, fast, and easy to use.',
    canonical: tool?.path,
  });
}

export default function AddWatermarkPage() {
  const tool = getToolById('add-watermark');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AddWatermarkClient />
    </>
  );
}
