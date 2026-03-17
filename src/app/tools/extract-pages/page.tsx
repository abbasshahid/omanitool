import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ExtractPagesClient from '@/components/tools/ExtractPagesClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('extract-pages');
  return constructMetadata({
    title: `${tool?.name} Online - Extract Specific Pages from PDF for Free | OmniTool`,
    description: tool?.description || 'Extract pages from PDF online for free. Create a new PDF with only the pages you need. Secure, fast, and easy to use.',
    canonical: tool?.path,
  });
}

export default function ExtractPagesPage() {
  const tool = getToolById('extract-pages');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ExtractPagesClient />
    </>
  );
}
