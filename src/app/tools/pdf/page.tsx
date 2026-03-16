import { getToolsByCategory } from '@/lib/toolsConfig';
import ToolCard from '@/components/ui/ToolCard';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PDFToolsPage() {
  const tools = getToolsByCategory('pdf');

  const subCategories = ['Organize PDF', 'Optimize PDF', 'Convert to PDF', 'Convert from PDF', 'Edit PDF', 'PDF Security'];

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      {/* Top Banner Ad */}
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="PDF_HUB_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">
          Complete <span className="text-red-500">Document</span> Toolkit
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl">
          Everything you need to modify, convert, and manage your documents securely and natively in your browser.
        </p>
      </div>

      {subCategories.map(subCategory => {
        const categoryTools = tools.filter(t => t.subCategory === subCategory);
        if (categoryTools.length === 0) return null;
        
        return (
          <div key={subCategory} className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">{subCategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom Leaderboard */}
      <div className="text-center pb-10">
        <AdSenseBanner dataAdSlot="PDF_HUB_BOTTOM" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

    </div>
  );
}
