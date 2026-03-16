'use client';

import { useState } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { TerminalSquare, Bug, Code2, RefreshCw } from 'lucide-react';

export default function AICodeAssistantPage() {
  const tool = getToolById('ai-code-assistant');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'refactor' | 'explain'>('refactor');

  const handleProcess = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setResult(null);

    // Simulated "AI" Code Parsing
    setTimeout(() => {
       if (mode === 'explain') {
         setResult(`// AI Explanation:\n// This code appears to be defining variables or functions based on standard syntax. Without deeper context, it looks structurally sound.\n\n${input}`);
       } else {
         // Auto-add pseudo-typescript typings to simple JS functions as a mock "refactor"
         const refactored = input.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, "/**\n * Refactored by OmniTool AI\n * @param {any} args - Implicit arguments\n * @returns {void}\n */\nfunction $1($2) {");
         setResult(`// Optimized & Commented Version\n\n${refactored}`);
       }
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="AIFUNC_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${tool?.color} mb-4 shadow-lg`}>
            <TerminalSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">{tool?.name}</h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">{tool?.description}</p>
        </div>

        <div className="card-container p-0 overflow-hidden border border-[var(--color-border-base)] flex flex-col md:flex-row h-auto md:h-[600px]">
          
          {/* Sidebar Tools */}
          <div className="w-full md:w-64 bg-[var(--color-surface-base)] border-r border-[var(--color-border-base)] flex flex-col p-4">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Command Pallet</h3>
             <div className="space-y-2">
               <button 
                 onClick={() => setMode('refactor')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'refactor' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:bg-[var(--color-background-base)] hover:text-white'}`}
               >
                 <Code2 className="w-4 h-4" /> Refactor Code
               </button>
               <button 
                 onClick={() => setMode('explain')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${mode === 'explain' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:bg-[var(--color-background-base)] hover:text-white'}`}
               >
                 <TerminalSquare className="w-4 h-4" /> Explain Logic
               </button>
               <button 
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-500 cursor-not-allowed`}
                 title="Pro feature"
               >
                 <Bug className="w-4 h-4" /> Find Bugs (Pro)
               </button>
             </div>

             <div className="mt-auto pt-6">
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing || !input.trim()}
                  className="btn-primary w-full bg-slate-700 hover:bg-slate-600 border-0"
                >
                  {isProcessing ? 'Running...' : 'Run Query'}
                </button>
             </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-[#0d1117]">
             {/* Input Editor */}
             <div className="flex-1 border-b border-gray-800 relative">
               <div className="absolute top-0 left-0 bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-br-lg font-mono">Input.js</div>
               <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your code snippet here..."
                  className="w-full h-full bg-transparent p-6 pt-10 text-green-400 font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
               />
             </div>
             
             {/* Output/Console Area */}
             <div className="h-1/2 md:flex-1 relative bg-black/50">
               <div className="absolute top-0 left-0 bg-indigo-900/40 text-indigo-300 text-xs px-3 py-1 rounded-br-lg font-mono border-b border-r border-indigo-500/30">Output Terminal</div>
               <div className="p-6 pt-10 text-sm font-mono h-full overflow-y-auto">
                 {isProcessing ? (
                   <div className="text-indigo-400 flex items-center gap-2">
                     <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Abstract Syntax Tree...
                   </div>
                 ) : result ? (
                   <pre className="text-gray-300 whitespace-pre-wrap">{result}</pre>
                 ) : (
                   <div className="text-gray-600">Waiting for input...</div>
                 )}
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
