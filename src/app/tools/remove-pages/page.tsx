import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import RemovePagesClient from '@/components/tools/RemovePagesClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('remove-pages');
  return constructMetadata({
    title: `${tool?.name} Online - Delete Pages from PDF for Free | OmniTool`,
    description: tool?.description || 'Remove pages from PDF online for free. Delete unwanted pages or ranges from your PDF documents securely. Fast and easy to use.',
    canonical: tool?.path,
  });
}

export default function RemovePagesPage() {
  const tool = getToolById('remove-pages');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <RemovePagesClient />
    </>
  );
}
