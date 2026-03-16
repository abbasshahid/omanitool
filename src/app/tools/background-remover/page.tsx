'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { Eraser, Download, ArrowRight, RefreshCw } from 'lucide-react';
import * as imgly from '@imgly/background-removal';

export default function BackgroundRemoverPage() {
  const tool = getToolById('bg-remover');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorPrompt, setErrorPrompt] = useState('');

  const handleFileSelect = (selectedFile: File) => {
    setErrorPrompt('');
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultImage(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setErrorPrompt('');
    
    try {
      const blob = await imgly.removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          // Track inference progress
          if (["compute:inference", "fetch:model"].includes(key)) {
            const p = Math.round((current / total) * 100);
            setProgress(p > 100 ? 100 : p);
          }
        }
      });
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (e) {
      console.error(e);
      setErrorPrompt('Failed to process image. Make sure you are using a clear subject.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = `removed-bg-${file?.name || 'image.png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPreview(null);
    setResultImage(null);
    setErrorPrompt('');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      {/* Top Ad */}
      <div className="mb-10">
        <AdSenseBanner dataAdSlot="BGREMOVER_TOP_BANNER" className="h-[90px] bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool?.color}`}>
                <Eraser className="w-6 h-6 text-white" />
              </div>
              {tool?.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool?.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
              <FileUploader onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-6">
                {/* Result/Preview Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Original Image</h3>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center">
                      <img src={preview!} alt="Original upload" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Result</h3>
                    <div className="relative rounded-xl overflow-hidden bg-[url('/checkered.png')] bg-gray-200 dark:bg-slate-900 aspect-square flex items-center justify-center border border-dashed border-gray-400">
                      {isProcessing ? (
                        <div className="flex flex-col items-center text-indigo-500 w-full px-8">
                          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                          <span className="font-medium animate-pulse mb-2">Analyzing image with AI...</span>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      ) : resultImage ? (
                        <img src={resultImage} alt="Processed result" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-[var(--color-text-muted)] text-sm">
                          {errorPrompt ? <span className="text-red-500">{errorPrompt}</span> : "Ready to process"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[var(--color-border-base)] gap-4">
                  <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                    Start over
                  </button>
                  
                  <div className="flex gap-4 w-full sm:w-auto">
                    {!resultImage ? (
                      <button 
                        onClick={handleProcess} 
                        disabled={isProcessing}
                        className="btn-primary w-full sm:w-auto"
                      >
                       {isProcessing ? 'Processing AI...' : 'Remove Background'}
                      </button>
                    ) : (
                      <button onClick={handleDownload} className="btn-primary w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-500 ring-emerald-600">
                        <Download className="w-4 h-4" /> Download HD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Toolkit & Ads */}
        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
          <AdSenseBanner dataAdSlot="BGREMOVER_SIDEBAR_TOP" className="h-[280px] bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
          
          <div className="card-container p-6">
            <h3 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">Related Tools</h3>
            <div className="space-y-3">
              <a href="/tools/image-resizer" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Image Resizer</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
              <a href="/tools/image-compressor" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Image Compressor</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
            </div>
          </div>
          
          <AdSenseBanner dataAdSlot="BGREMOVER_SIDEBAR_BOTTOM" className="h-[250px] bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
