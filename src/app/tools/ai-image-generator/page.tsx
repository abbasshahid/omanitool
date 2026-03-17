import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AIImageGeneratorClient from '@/components/tools/AIImageGeneratorClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('ai-image-generator');
  return constructMetadata({
    title: `${tool?.name} Online - Generate Stunning Art from Text for Free | OmniTool`,
    description: tool?.description || 'Create beautiful, high-resolution images and digital art from text prompts online for free. AI-powered image generation by OmniTool.',
    canonical: tool?.path,
  });
}

export default function AIImageGeneratorPage() {
  const tool = getToolById('ai-image-generator');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AIImageGeneratorClient />
    </>
  );
}
