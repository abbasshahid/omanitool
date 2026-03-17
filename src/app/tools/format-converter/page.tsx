import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import FormatConverterClient from '@/components/tools/FormatConverterClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('format-converter');
  return constructMetadata({
    title: `${tool?.name} Online - Convert Image Formats (JPG, PNG, WebP) for Free | OmniTool`,
    description: tool?.description || 'Convert images between JPG, PNG, and WebP formats online for free. High-quality image conversion entirely in your browser. Fast and secure.',
    canonical: tool?.path,
  });
}

export default function FormatConverterPage() {
  const tool = getToolById('format-converter');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <FormatConverterClient />
    </>
  );
}
