import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AITextEnhancerClient from '@/components/tools/AITextEnhancerClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('ai-text-enhancer');
  return constructMetadata({
    title: `${tool?.name} Online - Improve and Rewrite Text with AI for Free | OmniTool`,
    description: tool?.description || 'Enhance your writing online for free with our AI text enhancer. Improve vocabulary, fix grammar, and polish your rough drafts instantly.',
    canonical: tool?.path,
  });
}

export default function AITextEnhancerPage() {
  const tool = getToolById('ai-text-enhancer');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AITextEnhancerClient />
    </>
  );
}
