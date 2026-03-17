import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('image-resizer');
  return constructMetadata({
    title: `${tool?.name} Online - Resize Images for Free | OmniTool`,
    description: tool?.description || 'Resize images online for free. Adjust width and height with pixel precision or percentage. Secure and fast image resizer.',
    canonical: tool?.path,
  });
}

export default function ImageResizerPage() {
  const tool = getToolById('image-resizer');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ImageResizerClient />
    </>
  );
}
