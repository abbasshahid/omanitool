import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import PDFToPDFAClient from '@/components/tools/PDFToPDFAClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-to-pdfa');
  return constructMetadata({
    title: `${tool?.name} Online - Convert PDF to Long-Term Archive Format for Free | OmniTool`,
    description: tool?.description || 'Convert standard PDF files to PDF/A for secure, long-term archiving online for free. Ensure your documents remain readable for years to come.',
    canonical: tool?.path,
  });
}

export default function PDFToPDFAPage() {
  const tool = getToolById('pdf-to-pdfa');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <PDFToPDFAClient />
    </>
  );
}
