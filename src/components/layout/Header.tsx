import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-base)] bg-[var(--color-background-base)]/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 xl:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">OmniTool</span>
            </Link>
            
            <nav className="hidden md:flex gap-6 items-center">
              
              {/* PDF Dropdown */}
              <div className="relative group/pdf py-4">
                <Link href="/tools/pdf" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                  Document Tools
                  <svg className="w-4 h-4 text-gray-400 group-hover/pdf:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                <div className="absolute top-full left-0 w-[400px] opacity-0 invisible group-hover/pdf:opacity-100 group-hover/pdf:visible transition-all duration-200 translate-y-2 group-hover/pdf:translate-y-0 z-50">
                   <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-2">
                     <div className="col-span-2 px-2 pb-2 mb-2 border-b border-[var(--color-border-base)]">
                       <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Popular Document Tools</span>
                     </div>
                     <Link href="/tools/merge-pdf" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Merge PDF</Link>
                     <Link href="/tools/split-pdf" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Split PDF</Link>
                     <Link href="/tools/compress-pdf" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Compress PDF</Link>
                     <Link href="/tools/word-to-pdf" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">WORD to PDF</Link>
                     <div className="col-span-2 mt-2 pt-2 border-t border-[var(--color-border-base)] text-center">
                       <Link href="/tools/pdf" className="text-xs font-bold text-red-500 hover:text-red-400">View All 28+ Document Tools &rarr;</Link>
                     </div>
                   </div>
                </div>
              </div>

              {/* Image Dropdown */}
              <div className="relative group/img py-4">
                <Link href="/tools/image" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                  Image Tools
                  <svg className="w-4 h-4 text-gray-400 group-hover/img:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                <div className="absolute top-full left-0 w-[240px] opacity-0 invisible group-hover/img:opacity-100 group-hover/img:visible transition-all duration-200 translate-y-2 group-hover/img:translate-y-0 z-50">
                   <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl shadow-2xl p-2 flex flex-col gap-1">
                     <Link href="/tools/background-remover" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Background Remover</Link>
                     <Link href="/tools/image-resizer" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Image Resizer</Link>
                     <Link href="/tools/image-compressor" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Image Compressor</Link>
                     <Link href="/tools/format-converter" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Format Converter</Link>
                     <div className="mt-1 pt-2 border-t border-[var(--color-border-base)] text-center">
                       <Link href="/tools/image" className="text-xs font-bold text-indigo-500 hover:text-indigo-400">View All Image Tools</Link>
                     </div>
                   </div>
                </div>
              </div>

              {/* AI Hub Dropdown */}
              <div className="relative group/ai py-4">
                <Link href="/ai-hub" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                  AI Hub
                  <span className="inline-flex mx-1 items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">New</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover/ai:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                <div className="absolute top-full left-0 w-[240px] opacity-0 invisible group-hover/ai:opacity-100 group-hover/ai:visible transition-all duration-200 translate-y-2 group-hover/ai:translate-y-0 z-50">
                   <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl shadow-2xl p-2 flex flex-col gap-1">
                     <Link href="/tools/ai-image-generator" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">AI Image Generator</Link>
                     <Link href="/tools/ai-text-enhancer" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">AI Text Enhancer</Link>
                     <Link href="/tools/ai-summarizer" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">AI Text Summarizer</Link>
                     <Link href="/tools/ai-code-assistant" className="px-3 py-2 rounded-lg hover:bg-[var(--color-background-base)] text-sm font-medium transition-colors">Code Assistant</Link>
                     <div className="mt-1 pt-2 border-t border-[var(--color-border-base)] text-center">
                       <Link href="/ai-hub" className="text-xs font-bold text-purple-500 hover:text-purple-400">View All AI Tools</Link>
                     </div>
                   </div>
                </div>
              </div>

              {/* Blog Link */}
              <Link href="/blog" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors py-4">
                Blog
              </Link>

            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] sm:block transition-colors">
              Pricing
            </Link>
            <Link href="#" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
