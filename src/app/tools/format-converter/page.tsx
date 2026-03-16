'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { FileAudio, Settings2, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function FormatConverterPage() {
  const tool = getToolById('format-converter');
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Only accept images for browser-based conversion without complex WASM
    if (!selectedFile.type.startsWith('image/')) {
       alert("Currently, only image files (PNG, JPG, WebP) are supported for conversion.");
       return;
    }
    setFile(selectedFile);
    setIsDone(false);
    setResultUrl(null);
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Convert Image natively using Canvas for complete functionality
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mime = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
          const dataUrl = canvas.toDataURL(mime, 0.9);
          setResultUrl(dataUrl);
          setIsDone(true);
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
         alert("Failed to read image.");
         setIsProcessing(false);
      }
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (resultUrl) {
      const a = document.createElement('a');
      a.href = resultUrl;
      const originalName = file?.name.split('.')[0] || 'converted-image';
      a.download = `${originalName}.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsDone(false);
    setResultUrl(null);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      {/* Top Ad */}
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="FORMAT_TOP_LEADERBOARD" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${tool?.color} mb-4 shadow-lg`}>
            <FileAudio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">{tool?.name}</h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">{tool?.description}</p>
        </div>

        <div className="card-container p-6 md:p-8 shadow-xl">
          {/* Step 1: Upload */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold">1</span>
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">Upload Image File</h2>
            </div>
            {!file ? (
              <FileUploader 
                onFileSelect={handleFileSelect} 
                acceptedTypes="image/jpeg, image/png, image/webp"
                maxSizeMB={20}
              />
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
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
            )}
          </div>

          {/* Step 2: Configure & Convert */}
          <div className={`transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold">2</span>
              <h2 className="text-lg font-semibold text-[var(--color-text-main)]">Convert to Format</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-64">
                <select 
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  disabled={isProcessing || isDone}
                  className="w-full appearance-none bg-[var(--color-background-base)] border border-[var(--color-border-base)] text-[var(--color-text-main)] py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="Images">
                    <option value="png">PNG Image (.png)</option>
                    <option value="jpg">JPG Image (.jpg)</option>
                    <option value="webp">WebP Image (.webp)</option>
                  </optgroup>
                </select>
                <Settings2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex-1 w-full">
                {!isDone ? (
                  <button 
                    onClick={handleProcess}
                    disabled={isProcessing || !file}
                    className="btn-primary w-full shadow-lg shadow-indigo-500/20"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Converting...</span>
                    ) : (
                      'Start Conversion'
                    )}
                  </button>
                ) : (
                  <button onClick={handleDownload} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 gap-2">
                    <Download className="w-4 h-4" /> Download Result.{targetFormat}
                  </button>
                )}
              </div>
            </div>

            {/* Success State */}
            {isDone && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-[var(--color-text-main)]">Conversion Complete!</h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Your file has been successfully converted and is ready for download.</p>
                  </div>
                </div>
                <button onClick={resetTool} className="text-sm font-medium text-emerald-600 hover:underline">
                  Convert Another
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Ad */}
      <div className="mt-16 text-center">
        <AdSenseBanner dataAdSlot="FORMAT_BOTTOM_LEADERBOARD" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

    </div>
  );
}
