'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, FileText } from 'lucide-react';

export default function HTMLToPDFClient() {
  const tool = getToolById('html-to-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsDone(false);
    setDownloadUrl(null);
    setErrorMsg(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/pdf/create', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Unknown error. Check server logs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsDone(false);
    setDownloadUrl(null);
    setErrorMsg(null);
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
               <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/10 p-4">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                    acceptedTypes=".html,.htm" 
                  />
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
                  <div className="pt-4 border-t border-[var(--color-border-base)] space-y-4">
                    {errorMsg && (
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                        {errorMsg}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button onClick={handleProcess} disabled={isProcessing} className="btn-primary w-full sm:w-auto min-w-[200px]">
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Converting...</span>
                        ) : (tool.name + ' Now')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                       <Download className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Conversion Complete!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your HTML file has been converted to PDF and is ready for download.</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">Convert Another</button>
                       {downloadUrl && (
                         <a href={downloadUrl} download={file.name.replace(/\.[^.]+$/, '.pdf')} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
                           <Download className="w-5 h-5" /> Download PDF
                         </a>
                       )}
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
