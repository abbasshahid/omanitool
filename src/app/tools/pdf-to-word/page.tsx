import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AdobeExportClient from '@/components/tools/AdobeExportClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-to-word');
  return constructMetadata({
    title: `${tool?.name} Online - Convert PDF to Editable Word for Free | OmniTool`,
    description: tool?.description || 'Convert PDF to Microsoft Word (DOCX) online for free. High-quality conversion via Adobe PDF Services. Easy to edit, secure, and fast.',
    canonical: tool?.path,
  });
}

export default function PDFToWordPage() {
  const tool = getToolById('pdf-to-word');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AdobeExportClient toolId="pdf-to-word" />
    </>
  );
}
