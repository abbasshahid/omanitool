import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ScanToPDFClient from '@/components/tools/ScanToPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('scan-to-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Create PDF from Webcam Scans for Free | OmniTool`,
    description: tool?.description || 'Scan your documents to PDF online for free using your webcam or mobile camera. Fast, secure, and easy way to digitize paperwork.',
    canonical: tool?.path,
  });
}

export default function ScanToPDFPage() {
  const tool = getToolById('scan-to-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ScanToPDFClient />
    </>
  );
}
