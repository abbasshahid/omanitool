import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AdobeExportClient from '@/components/tools/AdobeExportClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-to-powerpoint');
  return constructMetadata({
    title: `${tool?.name} Online - Convert PDF to Editable PowerPoint for Free | OmniTool`,
    description: tool?.description || 'Convert PDF to Microsoft PowerPoint (PPTX) online for free. High-quality conversion via Adobe PDF Services. Professional slide layout maintained.',
    canonical: tool?.path,
  });
}

export default function PDFToPowerPointPage() {
  const tool = getToolById('pdf-to-powerpoint');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AdobeExportClient toolId="pdf-to-powerpoint" />
    </>
  );
}
