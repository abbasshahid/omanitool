import { getToolById } from '@/lib/toolsConfig';
import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import AdobeExportClient from '@/components/tools/AdobeExportClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById('pdf-to-excel');
  return constructMetadata({
    title: `${tool?.name} Online - Convert PDF to Excel Spreadsheets for Free | OmniTool`,
    description: tool?.description || 'Convert PDF to Microsoft Excel (XLSX) spreadsheets online for free. Extract data from tables with high precision via Adobe PDF Services.',
    canonical: tool?.path,
  });
}

export default function PDFToExcelPage() {
  const tool = getToolById('pdf-to-excel');
  const schema = tool ? generateSoftwareSchema(tool) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <AdobeExportClient toolId="pdf-to-excel" />
    </>
  );
}
