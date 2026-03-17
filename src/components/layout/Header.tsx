'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TOOLS, getToolsByCategory } from '@/lib/toolsConfig';
import { 
  Menu, X, ChevronDown, Rocket, LayoutTemplate, 
  FileText, Wand2, ArrowRight, Zap, Shield, Sparkles, Heart
} from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);

  // Group PDF tools by subcategory
  const pdfTools = getToolsByCategory('pdf');
  const aiTools = getToolsByCategory('ai');
  
  const subCategories = Array.from(new Set(pdfTools.map(t => t.subCategory).filter(Boolean))) as string[];

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Donation Banner */}
      <div className="bg-indigo-600 text-white py-2 px-4 relative z-[60]">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <p className="text-[10px] sm:text-xs font-bold tracking-wide text-center">
            <span className="opacity-90">Tools are completely free & unlimited.</span>
            <Link href="/donate" className="ml-2 underline hover:text-indigo-100 items-center inline-flex gap-1 group">
              Donate for needy people <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-base)] bg-[var(--color-background-base)]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 xl:px-8">
          <div className="flex h-20 items-center justify-between relative">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-main)] to-[var(--color-text-muted)]">OmniTool</span>
              </Link>
              
              <nav className="hidden md:flex gap-1 items-center">
                
                {/* Document Tools Mega Menu */}
                <div className="group/mega px-3 py-4">
                  <button className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-[var(--color-surface-base)]">
                    Document Tools
                    <ChevronDown className="w-4 h-4 opacity-50 group-hover/mega:rotate-180 transition-transform" />
                  </button>
                  
                  {/* Mega Menu Container */}
                  <div className="absolute top-full left-0 right-0 mx-auto w-[95vw] max-w-6xl opacity-0 invisible group-hover/mega:opacity-100 group-hover/mega:visible transition-all duration-300 translate-y-4 group-hover/mega:translate-y-0 z-50 pt-2">
                     <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-2xl shadow-2xl p-8 grid grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-8 overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                       
                       {subCategories.map(sub => (
                         <div key={sub} className="flex flex-col gap-3 relative z-10">
                           <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-1">{sub}</h3>
                           <div className="flex flex-col gap-1">
                             {pdfTools.filter(t => t.subCategory === sub).slice(0, 6).map(tool => (
                               <Link 
                                 key={tool.id} 
                                 href={tool.path} 
                                 className="text-sm text-[var(--color-text-muted)] hover:text-indigo-500 transition-colors py-1 flex items-center gap-2 group/item"
                               >
                                 <tool.icon className="w-3.5 h-3.5 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                                 {tool.name}
                               </Link>
                             ))}
                           </div>
                         </div>
                       ))}

                       {/* Featured/AI Sidebar in Mega Menu */}
                       <div className="hidden lg:flex flex-col gap-4 p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-xl relative overflow-hidden">
                          <div className="relative z-10">
                            <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              AI-Powered
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)] mb-4">Try our next-gen AI tools for instant results.</p>
                            <Link href="/ai-hub" className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline">
                              Explore AI Hub <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* AI Hub Dropdown */}
                <div className="relative group/ai px-3 py-4">
                  <Link href="/ai-hub" className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-[var(--color-surface-base)]">
                    AI Hub
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">HOT</span>
                    <ChevronDown className="w-4 h-4 opacity-50 group-hover/ai:rotate-180 transition-transform" />
                  </Link>
                  <div className="absolute top-full left-0 w-[260px] opacity-0 invisible group-hover/ai:opacity-100 group-hover/ai:visible transition-all duration-200 translate-y-2 group-hover/ai:translate-y-0 z-50 pt-2">
                     <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl shadow-xl p-3 flex flex-col gap-1">
                       {aiTools.map(tool => (
                         <Link 
                           key={tool.id} 
                           href={tool.path} 
                           className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent text-sm font-medium transition-all group/aiitem"
                         >
                           <div className={`p-1.5 rounded-md bg-gradient-to-br ${tool.color} shadow-sm group-hover/aiitem:scale-110 transition-transform`}>
                             <tool.icon className="w-4 h-4 text-white" />
                           </div>
                           {tool.name}
                         </Link>
                       ))}
                     </div>
                  </div>
                </div>

                <Link href="/blog" className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--color-surface-base)]">
                  Blog
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/donate" className="hidden text-sm font-semibold text-[var(--color-text-muted)] hover:text-indigo-500 transition-colors sm:block">
                Donate
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border-base)] text-[var(--color-text-main)]"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-x-0 bottom-0 top-[90px] sm:top-[113px] z-[100] bg-[var(--color-background-base)] transition-all duration-300 md:hidden overflow-y-auto ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4 pointer-events-none'}`}>
          <div className="p-6 flex flex-col gap-8 pb-32">
            
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
              <Rocket className="w-5 h-5 text-indigo-600" />
              <span className="text-lg font-bold">Back to Home</span>
            </Link>

            {/* Document Tools Mobile */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Document Capabilities</h3>
              <div className="flex flex-col gap-1">
                 {subCategories.map(sub => (
                   <div key={sub} className="border-b border-[var(--color-border-base)] last:border-0 pb-1">
                     <button 
                      onClick={() => setActiveMobileSub(activeMobileSub === sub ? null : sub)}
                      className="w-full flex items-center justify-between py-4 px-2 text-[var(--color-text-main)] font-semibold text-base"
                     >
                       {sub}
                       <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileSub === sub ? 'rotate-180' : ''}`} />
                     </button>
                     {activeMobileSub === sub && (
                       <div className="grid grid-cols-1 gap-1 px-2 py-2 mb-4 animate-in slide-in-from-top-2">
                         {pdfTools.filter(t => t.subCategory === sub).map(tool => (
                           <Link 
                             key={tool.id} 
                             href={tool.path} 
                             onClick={() => setIsMobileMenuOpen(false)}
                             className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] py-3 px-3 hover:bg-[var(--color-surface-base)] rounded-lg"
                           >
                             <tool.icon className="w-4 h-4 opacity-50" />
                             {tool.name}
                           </Link>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
              </div>
            </div>

            {/* AI Tools Mobile */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest px-2 group flex items-center gap-2">
                AI Intelligence
                <Zap className="w-3 h-3 fill-purple-500" />
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {aiTools.map(tool => (
                  <Link 
                    key={tool.id} 
                    href={tool.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border-base)] active:scale-[0.98] transition-all"
                  >
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${tool.color} shadow-sm`}>
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold">{tool.name}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">Advanced AI Utility</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-[var(--color-border-base)]">
               <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-surface-base)] text-lg font-bold text-[var(--color-text-main)] transition-all"
               >
                 Blog
                 <FileText className="w-5 h-5 opacity-40" />
               </Link>
               <Link 
                href="/donate" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold shadow-lg shadow-indigo-500/20"
               >
                 Donate to Support
                 <Heart className="w-5 h-5 fill-white" />
               </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
