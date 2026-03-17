import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import SignPDFClient from '@/components/tools/SignPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('sign-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Sign PDF Documents for Free | OmniTool`,
    description: tool?.description || 'Sign PDF documents online for free. Draw your signature or upload an image to sign your files securely and easily.',
    canonical: tool?.path,
  });
}

export default function SignPDFPage() {
  const tool = getToolById('sign-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <SignPDFClient />
    </>
  );
}
