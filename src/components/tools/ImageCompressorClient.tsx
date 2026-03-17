'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { Scissors, Download, RefreshCw, ArrowRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ImageCompressorClient() {
  const tool = getToolById('image-compressor');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultImage(null);
    setCompressedFile(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const options = {
        maxSizeMB: Math.max(0.1, (file.size / 1024 / 1024) * quality),
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedBlob = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedBlob);
      
      setCompressedFile(compressedBlob as File);
      setResultImage(url);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultImage && compressedFile) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = `compressed-${file?.name || 'image.jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPreview(null);
    setResultImage(null);
    setCompressedFile(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="COMPRESS_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool?.color}`}>
                <Scissors className="w-6 h-6 text-white" />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="border border-[var(--color-border-base)] rounded-xl overflow-hidden bg-[var(--color-background-base)]">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-b border-[var(--color-border-base)] flex justify-between items-center text-sm">
                      <span className="font-semibold text-[var(--color-text-main)]">Original</span>
                      <span className="text-gray-500">{formatSize(file.size)}</span>
                    </div>
                    <div className="aspect-video relative p-4 flex items-center justify-center">
                      <img src={preview!} alt="Original upload" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>

                  {/* Compressed */}
                  <div className="border border-[var(--color-border-base)] rounded-xl overflow-hidden bg-[var(--color-background-base)] relative">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-[var(--color-border-base)] flex justify-between items-center text-sm">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Compressed</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {compressedFile ? formatSize(compressedFile.size) : '???'}
                        {compressedFile && (
                          <span className="ml-2 text-xs text-emerald-500 opacity-80">
                            (-{Math.round((1 - compressedFile.size / file.size) * 100)}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="aspect-video relative p-4 flex items-center justify-center bg-[url('/checkered.png')] bg-gray-100 dark:bg-slate-900">
                      {isProcessing ? (
                        <div className="flex flex-col items-center justify-center text-indigo-500 h-full w-full bg-[var(--color-surface-base)]/80 backdrop-blur-sm absolute inset-0">
                          <RefreshCw className="w-8 h-8 animate-spin mb-3" />
                          <span className="font-medium">Squeezing pixels...</span>
                        </div>
                      ) : resultImage ? (
                        <img src={resultImage} alt="Compressed result" className="max-w-full max-h-full object-contain drop-shadow-lg" />
                      ) : (
                        <div className="text-[var(--color-text-muted)] text-sm flex flex-col items-center">
                          <span className="opacity-50 mb-2">Ready to compress</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compression Controls */}
                {!resultImage && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-border-base)]">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-[var(--color-text-main)]">Compression Quality</label>
                       <span className="text-sm text-indigo-500 font-bold">{Math.round(quality * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.1" 
                      value={quality} 
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                       <span>Smaller File (Low Quality)</span>
                       <span>Better Quality (Larger File)</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                    Upload another image
                  </button>

                  <div className="w-full sm:w-auto">
                    {!resultImage ? (
                      <button 
                        onClick={handleProcess} 
                        disabled={isProcessing}
                        className="btn-primary w-full"
                      >
                       {isProcessing ? 'Compressing...' : 'Compress Image Now'}
                      </button>
                    ) : (
                      <button onClick={handleDownload} className="btn-primary w-full gap-2 bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20">
                        <Download className="w-4 h-4" /> Download ({formatSize(compressedFile!.size)})
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
          <AdSenseBanner dataAdSlot="COMPRESS_SIDEBAR_TOP" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
          
          <div className="card-container p-6">
            <h3 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">You might also need</h3>
            <div className="space-y-3">
              <a href="/tools/image-resizer" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Image Resizer</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
              <a href="/tools/format-converter" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-amber-400">Format Converter</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400" />
              </a>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
