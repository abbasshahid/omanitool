'use client';

import { useState } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { FileSearch, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export default function AISummarizerPage() {
  const tool = getToolById('ai-summarizer');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setResult(null);

    // Simulated "AI" Extractive Summarization
    setTimeout(() => {
      // Basic sentence splitting
      const sentences = input.match(/[^.!?]+[.!?]+/g) || [];
      
      let summary = '';
      if (sentences.length <= 1) {
         summary = "The provided text is too short to summarize uniquely. " + input;
      } else if (sentences.length <= 3) {
         summary = sentences.join(' ');
      } else {
         // Extract first sentence and last sentence to represent a naive summary
         const first = sentences[0] || '';
         const last = sentences[sentences.length - 1] || '';
         summary = `**Key Takeaway:**\n${first.trim()}\n\n**Conclusion:**\n${last.trim()}`;
      }

      setResult(summary);
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (result) {
      // Remove markdown for copy
      navigator.clipboard.writeText(result.replace(/\*\*/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="AISUMMARIZE_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${tool?.color} mb-4 shadow-lg`}>
            <FileSearch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">{tool?.name}</h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">{tool?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Area */}
          <div className="card-container p-6">
            <h3 className="font-semibold text-[var(--color-text-main)] mb-4">
               Long-Form Content
            </h3>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a long article, essay, or document here to extract the key points..."
              className="w-full h-[400px] bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl p-4 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none mb-4 text-sm"
            />
            <button 
              onClick={handleProcess}
              disabled={isProcessing || !input.trim()}
              className="btn-primary w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 border-0"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Document...</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> Summarize Now</span>
              )}
            </button>
          </div>

          {/* Result Area */}
          <div className="card-container p-6 bg-sky-50/10 dark:bg-sky-900/10 border-sky-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--color-text-main)] flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-sky-500" /> AI Summary
              </h3>
              {result && (
                <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium hover:text-sky-500 transition-colors">
                  {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Summary</>}
                </button>
              )}
            </div>
            
            <div className={`w-full h-[400px] bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl p-6 text-[var(--color-text-main)] overflow-y-auto ${!result ? 'flex items-center justify-center opacity-50' : ''}`}>
               {isProcessing ? (
                  <div className="flex flex-col items-center justify-center h-full text-sky-500">
                     <FileSearch className="w-8 h-8 animate-bounce mb-3" />
                     <span className="font-medium">Extracting core concepts...</span>
                  </div>
               ) : result ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                     {/* Basic markdown renderer for the bold pseudo-summary */}
                     {result.split('\n').map((line, i) => {
                       if (line.startsWith('**') && line.endsWith('**')) {
                         return <p key={i} className="font-bold text-indigo-400 mb-1 mt-4 first:mt-0">{line.replace(/\*\*/g, '')}</p>
                       }
                       if (line.trim() === '') return null;
                       return <p key={i} className="mb-4 text-gray-300">{line}</p>
                     })}
                  </div>
               ) : (
                  <div className="text-center text-gray-400">
                     <FileSearch className="w-10 h-10 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">Bullet points and summaries will generate here</p>
                  </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
