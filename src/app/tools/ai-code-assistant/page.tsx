import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AICodeAssistantClient from '@/components/tools/AICodeAssistantClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('ai-code-assistant');
  return constructMetadata({
    title: `${tool?.name} Online - Refactor and Explain Code with AI for Free | OmniTool`,
    description: tool?.description || 'Refactor, optimize, and explain your code online for free with our AI Code Assistant. Enhance code quality and understand complex logic instantly.',
    canonical: tool?.path,
  });
}

export default function AICodeAssistantPage() {
  const tool = getToolById('ai-code-assistant');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AICodeAssistantClient />
    </>
  );
}
