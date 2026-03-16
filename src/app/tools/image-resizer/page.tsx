'use client';

import { useState, useRef, useEffect } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { MoveDiagonal, Download, ArrowRight } from 'lucide-react';

export default function ImageResizerPage() {
  const tool = getToolById('image-resizer');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  
  const [resultImage, setResultImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setResultImage(null);

    const img = new Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
      imgRef.current = img;
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspect && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspect && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleProcess = () => {
    if (!file || !imgRef.current) return;
    
    // Canvas magic to resize natively in browser
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(imgRef.current, 0, 0, width, height);
      // Export as high quality depending on original type
      const mimeType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      setResultImage(dataUrl);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a');
      a.href = resultImage;
      a.download = `resized-${width}x${height}-${file?.name || 'image.png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPreview(null);
    setResultImage(null);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10">
        <AdSenseBanner dataAdSlot="RESIZER_TOP_BANNER" className="h-[90px] bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool?.color}`}>
                <MoveDiagonal className="w-6 h-6 text-white" />
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
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Preview</h3>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center p-4 border border-[var(--color-border-base)]">
                      <img src={preview!} alt="Original upload" className="max-w-full max-h-full object-contain drop-shadow-md" />
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-6">
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Resize Settings</h3>
                    
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                        <input 
                          type="number" 
                          value={width || ''} 
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-lg px-4 py-2 text-[var(--color-text-main)]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                        <input 
                          type="number" 
                          value={height || ''} 
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-lg px-4 py-2 text-[var(--color-text-main)]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="aspect" 
                        checked={keepAspect} 
                        onChange={(e) => setKeepAspect(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-base)]"
                      />
                      <label htmlFor="aspect" className="text-sm text-[var(--color-text-main)]">Lock aspect ratio</label>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border-base)]">
                      {!resultImage ? (
                        <button onClick={handleProcess} className="btn-primary w-full shadow-md">
                          Resize Image
                        </button>
                      ) : (
                        <button onClick={handleDownload} className="btn-primary w-full gap-2 bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20">
                          <Download className="w-4 h-4" /> Download Resized Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-start">
                   <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)] transition-colors">
                    Upload new image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Toolkit & Ads */}
        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
          <AdSenseBanner dataAdSlot="RESIZER_SIDEBAR_TOP" className="h-[280px] bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
          
          <div className="card-container p-6">
            <h3 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">Other Utilities</h3>
            <div className="space-y-3">
              <a href="/tools/image-compressor" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Image Compressor</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
               <a href="/tools/background-remover" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Background Remover</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
