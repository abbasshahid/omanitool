import { getToolsByCategory } from '@/lib/toolsConfig';
import ToolCard from '@/components/ui/ToolCard';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Free Online Document Tools - Convert & Format Files | OmniTool',
  description: 'Powerful and easy-to-use document tools. Convert file formats, repair PDFs, and manage your documents online for free. Secure and fast directly in your browser.',
  canonical: '/tools/document',
});

export default function DocumentToolsPage() {
  const tools = getToolsByCategory('document');

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="DOC_HUB_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">
          Online <span className="text-amber-500">Document</span> Tools
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl">
          Easily convert format files and document schemas online with professional-grade speed and accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

    </div>
  );
}
