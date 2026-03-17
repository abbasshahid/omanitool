import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import TranslatePDFClient from '@/components/tools/TranslatePDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('translate-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Translate PDF while Preserving Layout for Free | OmniTool`,
    description: tool?.description || 'Translate your PDF documents online for free. Support for over 100 languages while maintaining the original visual layout. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function TranslatePDFPage() {
  const tool = getToolById('translate-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <TranslatePDFClient />
    </>
  );
}
