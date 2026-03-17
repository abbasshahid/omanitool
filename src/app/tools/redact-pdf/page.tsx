import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import RedactPDFClient from '@/components/tools/RedactPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('redact-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Permanently Redact Sensitive Info from PDF | OmniTool`,
    description: tool?.description || 'Redact sensitive information from your PDF online for free. Permanently remove text and graphics for total privacy. Secure and easy to use.',
    canonical: tool?.path,
  });
}

export default function RedactPDFPage() {
  const tool = getToolById('redact-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <RedactPDFClient />
    </>
  );
}
