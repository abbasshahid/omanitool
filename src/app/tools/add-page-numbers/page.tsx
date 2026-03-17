import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AddPageNumbersClient from '@/components/tools/AddPageNumbersClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('add-page-numbers');
  return constructMetadata({
    title: `${tool?.name} Online - Add Page Numbers to PDF for Free | OmniTool`,
    description: tool?.description || 'Add page numbers correctly to your PDF online for free. Customize position, start number, and typography. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function AddPageNumbersPage() {
  const tool = getToolById('add-page-numbers');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AddPageNumbersClient />
    </>
  );
}
