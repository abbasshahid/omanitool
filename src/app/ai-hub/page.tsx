import { getToolsByCategory } from '@/lib/toolsConfig';
import ToolCard from '@/components/ui/ToolCard';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { Sparkles, Zap, Shield } from 'lucide-react';

export default function AIHubPage() {
  const aiTools = getToolsByCategory('ai');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background-base)]">
      
      {/* AI Hub Hero */}
      <section className="bg-[var(--color-surface-base)] border-b border-[var(--color-border-base)] py-16">
        <div className="container mx-auto max-w-7xl px-4 xl:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Powered by Advanced Models
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-main)] mb-6">
                OmniTool <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">AI Hub</span>
              </h1>
              <p className="text-xl text-[var(--color-text-muted)] mb-8 max-w-2xl">
                Supercharge your productivity with specialized AI assistants. From text generation to code optimization, all within your browser.
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <Zap className="w-4 h-4 text-amber-500" /> Fast Execution
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                  <Shield className="w-4 h-4 text-emerald-500" /> Private & Secure
                </div>
              </div>
            </div>
            
            {/* Hero Ad Placement */}
            <div className="w-full lg:w-[336px] flex-shrink-0">
              <AdSenseBanner dataAdSlot="AI_HUB_HERO_RECTANGLE" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Area */}
      <section className="container mx-auto max-w-7xl px-4 xl:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            
            {/* Inline Ad Banner */}
            <div className="mt-10">
              <AdSenseBanner dataAdSlot="AI_HUB_INLINE_FEED" className="h-[120px] bg-slate-900/30 rounded-xl" />
            </div>
          </div>

          {/* Sticky Sidebar Ad/Promo */}
          <aside className="w-full lg:w-[300px] flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="card-container p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 text-center">
                <h3 className="text-xl font-bold text-white mb-2">OmniTool Pro</h3>
                <p className="text-indigo-200 text-sm mb-6">Get unlimited generations, priority access to new models, and an ad-free experience.</p>
                <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 rounded-xl transition-colors">
                  Upgrade Now
                </button>
              </div>
              
              <AdSenseBanner dataAdSlot="AI_HUB_SIDEBAR_VERTICAL" className="h-[600px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
            </div>
          </aside>
          
        </div>
      </section>

    </div>
  );
}
