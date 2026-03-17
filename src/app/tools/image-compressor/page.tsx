import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ImageCompressorClient from '@/components/tools/ImageCompressorClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('image-compressor');
  return constructMetadata({
    title: `${tool?.name} Online - Compress Images Without Quality Loss | OmniTool`,
    description: tool?.description || 'Compress images online for free. Reduce file size of JPG, PNG, and WEBP while maintaining high quality. Fast and secure.',
    canonical: tool?.path,
  });
}

export default function ImageCompressorPage() {
  const tool = getToolById('image-compressor');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ImageCompressorClient />
    </>
  );
}
