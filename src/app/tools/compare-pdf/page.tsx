import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ComparePDFClient from '@/components/tools/ComparePDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('compare-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Compare Two PDF Documents for Free | OmniTool`,
    description: tool?.description || 'Compare two PDF documents online for free. Spot changes, differences, and revisions between PDF files easily. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function ComparePDFPage() {
  const tool = getToolById('compare-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ComparePDFClient />
    </>
  );
}
