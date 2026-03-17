import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AISummarizerClient from '@/components/tools/AISummarizerClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('ai-summarizer');
  return constructMetadata({
    title: `${tool?.name} Online - Summarize Articles and Documents with AI for Free | OmniTool`,
    description: tool?.description || 'Quickly summarize long articles, essays, and documents online for free. Extract key takeaways and core concepts instantly with AI-powered summarization.',
    canonical: tool?.path,
  });
}

export default function AISummarizerPage() {
  const tool = getToolById('ai-summarizer');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AISummarizerClient />
    </>
  );
}
