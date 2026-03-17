import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import ProtectPDFClient from '@/components/tools/ProtectPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('protect-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Encrypt PDF with Password for Free | OmniTool`,
    description: tool?.description || 'Protect your PDF online for free. Encrypt your document with a strong password to prevent unauthorized access. Secure, reliable, and easy.',
    canonical: tool?.path,
  });
}

export default function ProtectPDFPage() {
  const tool = getToolById('protect-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProtectPDFClient />
    </>
  );
}
