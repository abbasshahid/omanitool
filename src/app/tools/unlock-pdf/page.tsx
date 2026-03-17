import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import UnlockPDFClient from '@/components/tools/UnlockPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('unlock-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Remove PDF Password Security for Free | OmniTool`,
    description: tool?.description || 'Unlock your PDF online for free. Remove password security and restrictions from your PDF files. Secure, fast, and easy to use.',
    canonical: tool?.path,
  });
}

export default function UnlockPDFPage() {
  const tool = getToolById('unlock-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <UnlockPDFClient />
    </>
  );
}
