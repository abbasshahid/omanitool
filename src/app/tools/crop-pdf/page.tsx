import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import CropPDFClient from '@/components/tools/CropPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('crop-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Trim PDF Margins for Free | OmniTool`,
    description: tool?.description || 'Crop your PDF online for free. Adjust margins and trim PDF pages to the perfect size. Secure, fast, and professional results.',
    canonical: tool?.path,
  });
}

export default function CropPDFPage() {
  const tool = getToolById('crop-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CropPDFClient />
    </>
  );
}
