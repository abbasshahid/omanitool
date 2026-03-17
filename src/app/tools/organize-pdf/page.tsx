import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import OrganizePDFClient from '@/components/tools/OrganizePDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('organize-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Reorder and Manage PDF Pages for Free | OmniTool`,
    description: tool?.description || 'Organize PDF pages online for free. Drag and drop to reorder, delete, or add pages to your PDF documents. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function OrganizePDFPage() {
  const tool = getToolById('organize-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <OrganizePDFClient />
    </>
  );
}
