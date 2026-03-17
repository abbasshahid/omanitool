'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, ArrowRight, FileText, ChevronLeft, Shield, Zap } from 'lucide-react';
import ApryseWebViewer from '@/components/shared/ApryseWebViewer';
import MozillaPDFViewer from '@/components/shared/MozillaPDFViewer';

export default function EditPDFClient() {
  const tool = getToolById('edit-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [editorType, setEditorType] = useState<'mozilla' | 'apryse'>('mozilla');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsDone(false);
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
      
      {/* Top Leaderboard Ad */}
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Main Tool Area */}
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {tool.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
               <div className="space-y-6">
                 <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/10 p-4">
                    <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf" />
                 </div>
               </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-[var(--color-border-base)]">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={resetTool}
                      className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <div className="h-8 w-px bg-[var(--color-border-base)] hidden md:block" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[var(--color-text-main)] truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-[var(--color-background-base)] p-1 rounded-lg border border-[var(--color-border-base)] shadow-sm">
                    <button
                      onClick={() => setEditorType('mozilla')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        editorType === 'mozilla' 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Standard (Free)
                    </button>
                    <button
                      onClick={() => setEditorType('apryse')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        editorType === 'apryse' 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Professional (Trial)
                    </button>
                  </div>
                </div>

                <div className="h-[800px] w-full bg-[var(--color-background-base)] rounded-xl overflow-hidden shadow-2xl border border-[var(--color-border-base)] relative">
                  {editorType === 'mozilla' ? (
                    <MozillaPDFViewer file={file} />
                  ) : (
                    <ApryseWebViewer file={file} />
                  )}
                  
                  {editorType === 'mozilla' && (
                    <div className="absolute bottom-4 left-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center justify-between shadow-lg pointer-events-none md:pointer-events-auto">
                      <span>Using Google Chrome / Mozilla PDF Engine (No Watermark)</span>
                      <span className="opacity-70">Free Edition</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Ad Area (previously sidebar) */}
        <div className="w-full space-y-8">
           <AdSenseBanner dataAdSlot="GENERIC_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </div>

      </div>
    </div>
  );
}
