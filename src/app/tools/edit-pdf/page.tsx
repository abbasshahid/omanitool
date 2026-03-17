import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import EditPDFClient from '@/components/tools/EditPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('edit-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Free PDF Editor & Annotator | OmniTool`,
    description: tool?.description || 'Edit PDF files online for free. Add text, images, and annotations. Secure and easy to use PDF editor directly in your browser.',
    canonical: tool?.path,
  });
}

export default function EditPDFPage() {
  const tool = getToolById('edit-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <EditPDFClient />
    </>
  );
}
