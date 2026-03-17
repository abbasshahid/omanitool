import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import RepairPDFClient from '@/components/tools/RepairPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('repair-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Recover and Fix Damaged PDF Files for Free | OmniTool`,
    description: tool?.description || 'Repair your damaged or corrupted PDF online for free. Recover content from unreadable PDF files with our advanced fixing algorithms. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function RepairPDFPage() {
  const tool = getToolById('repair-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <RepairPDFClient />
    </>
  );
}
