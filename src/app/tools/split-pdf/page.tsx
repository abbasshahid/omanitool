import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import SplitPDFClient from '@/components/tools/SplitPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('split-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Extract Pages from PDF for Free | OmniTool`,
    description: tool?.description || 'Split PDF files online for free. Extract specific pages or split every page into separate files. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function SplitPDFPage() {
  const tool = getToolById('split-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <SplitPDFClient />
    </>
  );
}
