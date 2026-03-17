'use client';

import { useState } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { TextSelect, Wand2, RefreshCw, Copy, Check } from 'lucide-react';

export default function AITextEnhancerClient() {
  const tool = getToolById('ai-text-enhancer');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setResult(null);

    // Simulated "AI" Text Enhancement
    setTimeout(() => {
      let enhanced = input
        .replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase())
        .replace(/  +/g, ' ')
        .replace(/\bdon't\b/gi, 'do not')
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bI'm\b/gi, 'I am')
        .replace(/\byou're\b/gi, 'you are')
        .replace(/\bthey're\b/gi, 'they are')
        .replace(/\bi\.e\./gi, 'that is')
        .replace(/\be\.g\./gi, 'for example');

      setResult(enhanced);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="AIENHANCE_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${tool?.color} mb-4 shadow-lg`}>
            <TextSelect className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">{tool?.name}</h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">{tool?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-container p-6 border-indigo-500/30">
            <h3 className="font-semibold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
               Original Text
            </h3>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your rough draft here..."
              className="w-full h-[300px] bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl p-4 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
            />
            <button 
              onClick={handleProcess}
              disabled={isProcessing || !input.trim()}
              className="btn-primary w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Enhancing...</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Wand2 className="w-4 h-4" /> Enhance with AI</span>
              )}
            </button>
          </div>

          <div className="card-container p-6 bg-indigo-50/10 dark:bg-indigo-900/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--color-text-main)] flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-fuchsia-500" /> Enhanced Result
              </h3>
              {result && (
                <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 transition-colors">
                  {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Text</>}
                </button>
              )}
            </div>
            
            <div className={`w-full h-[300px] bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl p-4 text-[var(--color-text-main)] overflow-y-auto ${!result ? 'flex items-center justify-center opacity-50' : ''}`}>
               {isProcessing ? (
                  <div className="flex flex-col items-center justify-center h-full text-fuchsia-500">
                     <Wand2 className="w-8 h-8 animate-pulse mb-3" />
                     <span className="font-medium">Polishing vocabulary...</span>
                  </div>
               ) : result ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{result}</p>
               ) : (
                  <div className="text-center text-gray-400">
                     <TextSelect className="w-10 h-10 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">Your enhanced text will appear here</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
