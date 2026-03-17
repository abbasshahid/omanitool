import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import BackgroundRemoverClient from '@/components/tools/BackgroundRemoverClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('bg-remover');
  return constructMetadata({
    title: `${tool?.name} Online - Free AI-Powered Background Removal | OmniTool`,
    description: tool?.description || 'Remove image backgrounds instantly with AI. Free, high-quality, and works in your browser without uploads.',
    canonical: tool?.path,
  });
}

export default function BackgroundRemoverPage() {
  const tool = getToolById('bg-remover');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <BackgroundRemoverClient />
    </>
  );
}
