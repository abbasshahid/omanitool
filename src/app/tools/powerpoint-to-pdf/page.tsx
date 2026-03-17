import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AdobeConverterClient from '@/components/tools/AdobeConverterClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('powerpoint-to-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Convert PPT and PPTX to PDF for Free | OmniTool`,
    description: tool?.description || 'Convert Microsoft PowerPoint presentations to PDF online for free. High-quality conversion via Adobe PDF Services. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function PowerPointToPDFPage() {
  const tool = getToolById('powerpoint-to-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AdobeConverterClient toolId="powerpoint-to-pdf" />
    </>
  );
}
