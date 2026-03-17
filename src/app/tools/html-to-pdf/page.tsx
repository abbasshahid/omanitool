import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import HTMLToPDFClient from '@/components/tools/HTMLToPDFClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('html-to-pdf');
  return constructMetadata({
    title: `${tool?.name} Online - Convert Web Pages to PDF for Free | OmniTool`,
    description: tool?.description || 'Convert HTML files or web pages to PDF online for free. High-quality conversion with CSS and layout preservation. Secure and fast.',
    canonical: tool?.path,
  });
}

export default function HTMLToPDFPage() {
  const tool = getToolById('html-to-pdf');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <HTMLToPDFClient />
    </>
  );
}
