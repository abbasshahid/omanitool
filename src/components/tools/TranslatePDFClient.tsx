'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, FileText, AlertTriangle } from 'lucide-react';

export default function TranslatePDFClient() {
  const tool = getToolById('translate-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsDone(false);
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate API call for the prototype
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 2500);
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsDone(false);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  const Icon = tool.icon || FileText;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {tool.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
               <div className="space-y-6">
                 <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                   <div>
                     <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Backend API Required</h3>
                     <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                       Translating PDF documents while preserving their exact visual layout requires a backend server to extract text, call translation APIs, and rebuild the PDF structure.
                     </p>
                   </div>
                 </div>
                 <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/10 p-4">
                    <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf" />
                 </div>
               </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="p-3 bg-indigo-500/10 rounded-lg shrink-0">
                      <Icon className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isProcessing && !isDone && (
                    <button onClick={resetTool} className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
                      Remove File
                    </button>
                  )}
                </div>

                {!isDone ? (
                  <div className="pt-4 border-t border-[var(--color-border-base)] flex justify-end">
                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</span>
                      ) : (
                        tool.name + " Now"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                       <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Simulated Translation</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">This is a UI prototype. True PDF document translation capabilities require an active backend server connection.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="GENERIC_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
