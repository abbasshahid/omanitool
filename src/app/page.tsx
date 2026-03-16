import { TOOLS, getToolsByCategory } from '@/lib/toolsConfig';
import ToolCard from '@/components/ui/ToolCard';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const imageTools = getToolsByCategory('image');
  const aiTools = getToolsByCategory('ai').slice(0, 3); // Preview top 3 AI tools
  const pdfTools = getToolsByCategory('pdf');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-[var(--color-border-base)]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
        <div className="container mx-auto max-w-7xl px-4 xl:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-text-main)] mb-6">
            Your All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Digital Toolbox</span>
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10">
            Empowering your workflow with simple, powerful online tools. Remove backgrounds, convert formats, and leverage AI instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#tools" className="btn-primary text-base px-8 py-4">
              Explore Tools
            </Link>
            <Link href="/ai-hub" className="btn-secondary text-base px-8 py-4">
              Discover AI Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Top AdSense Banner */}
      <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-8">
        <AdSenseBanner dataAdSlot="HOMEPAGE_TOP_LEADERBOARD" className="h-[90px] bg-slate-50 dark:bg-slate-900/50 rounded-xl" />
      </div>

      <div id="tools" className="container mx-auto max-w-7xl px-4 xl:px-8 py-12 md:py-20 flex flex-col gap-20">
        
        {/* Image Tools Section */}
        <section>
          <div className="flex items-center justify-between mb-8 group">
            <h2 className="text-3xl font-bold text-[var(--color-text-main)]">Image Tools</h2>
            <Link href="/tools/image" className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-medium whitespace-nowrap">
              View all Image tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>



        {/* Massive PDF Suite Section */}
        <section>
          <div className="flex items-center justify-between mb-8 group">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">
                Complete <span className="text-red-500">Document</span> Toolkit
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg">Everything you need to modify, convert, and manage your documents.</p>
            </div>
            <Link href="/tools/pdf" className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium whitespace-nowrap">
              View all Document tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pdfTools.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Mid-Page AdSense Banner */}
        <div className="py-4">
          <AdSenseBanner dataAdSlot="HOMEPAGE_MID_BANNER" className="h-[250px] bg-slate-50 dark:bg-slate-900/50 rounded-xl" />
        </div>

        {/* AI Hub Preview Section */}
        <section className="rounded-3xl bg-[var(--color-surface-base)] border border-[var(--color-border-base)] p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-3">
                Next-Gen AI Tools Hub
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                  Update
                </span>
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg">Unlock your creative potential with our suite of powerful AI-driven utilities.</p>
            </div>
            <Link href="/ai-hub" className="group flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-medium whitespace-nowrap">
              View all AI tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
