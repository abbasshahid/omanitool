'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, FileText, ScanText, Download, CheckCircle2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

export default function OCRPDFClient() {
  const tool = getToolById('ocr-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ status: string; progress: number }>({ status: '', progress: 0 });
  const [extractedText, setExtractedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.type.startsWith('image/')) {
       alert("Please upload a PDF or an Image file.");
       return;
    }
    setFile(selectedFile);
    setIsDone(false);
    setExtractedText("");
    setProgress({ status: '', progress: 0 });
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress({ status: 'Initializing Tesseract...', progress: 0 });
    
    try {
      const images: string[] = [];
      
      if (file.type === 'application/pdf') {
         setProgress({ status: 'Extracting PDF pages...', progress: 0 });
         const arrayBuffer = await file.arrayBuffer();
         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
         const numPages = Math.min(pdf.numPages, 5); 
         
         for (let i = 1; i <= numPages; i++) {
           setProgress({ status: `Parsing PDF page ${i}/${numPages}...`, progress: (i / numPages) * 0.3 });
           const page = await pdf.getPage(i);
           const viewport = page.getViewport({ scale: 2.0 });
           const canvas = document.createElement('canvas');
           const context = canvas.getContext('2d');
           if (!context) continue;
           
           canvas.height = viewport.height;
           canvas.width = viewport.width;
           
           await page.render({ canvasContext: context, viewport }).promise;
           images.push(canvas.toDataURL('image/png'));
         }
      } else {
         images.push(URL.createObjectURL(file));
      }

      setProgress({ status: 'Loading OCR Engine...', progress: 0.35 });
      
      const progressInterval = setInterval(() => {
         setProgress(p => ({
            status: 'Running OCR Pattern Recognition...',
            progress: Math.min(0.95, p.progress + 0.05)
         }));
      }, 1000);

      const worker = await createWorker('eng', 1);
      
      let fullText = "";
      for (let i = 0; i < images.length; i++) {
        const { data: { text } } = await worker.recognize(images[i]);
        fullText += `\n\n--- Page ${i + 1} ---\n\n` + text;
      }
      
      clearInterval(progressInterval);
      setProgress({ status: 'Finalizing...', progress: 1.0 });
      
      await worker.terminate();

      setExtractedText(fullText.trim());
      setIsDone(true);
    } catch (e) {
      console.error(e);
      alert('Failed to process document for OCR. Please try a smaller file.');
    } finally {
      setIsProcessing(false);
      setProgress({ status: '', progress: 0 });
    }
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-extracted-${file?.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsDone(false);
    setExtractedText("");
    setProgress({ status: '', progress: 0 });
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="OCR_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} shadow-lg`}>
                <ScanText className="w-6 h-6 text-white" />
              </div>
              {tool.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">Extract text exactly as it appears in any flattened PDF or image using free, client-side browser OCR.</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
               <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/10 p-4">
                  <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf,image/*" />
               </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="p-3 bg-indigo-500/10 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-indigo-500" />
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

                {isProcessing && (
                  <div className="p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                         <RefreshCw className="w-4 h-4 animate-spin" /> {progress.status}
                       </span>
                       <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{Math.round(progress.progress * 100)}%</span>
                    </div>
                    <div className="w-full bg-indigo-500/20 rounded-full h-2">
                       <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress.progress * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-4">Running complex neural-net text extraction entirely in your browser. This may take a minute...</p>
                  </div>
                )}

                {!isDone && !isProcessing && (
                  <div className="pt-4 border-t border-[var(--color-border-base)] flex justify-end">
                    <button 
                      onClick={handleProcess} 
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      Extract Text Now
                    </button>
                  </div>
                )}
                
                {isDone && (
                  <div className="pt-6 border-t border-[var(--color-border-base)]">
                    <div className="flex items-center gap-2 mb-4 text-emerald-500 font-bold">
                       <CheckCircle2 className="w-5 h-5" /> Text Successfully Extracted Local
                    </div>
                    <div className="relative mb-6">
                       <div className="absolute top-2 right-2 flex gap-2">
                          <button onClick={downloadText} className="text-xs px-3 py-1.5 bg-[var(--color-surface-base)] border border-[var(--color-border-base)] hover:border-indigo-400 rounded-lg shadow-sm font-medium flex items-center gap-1 transition-colors">
                             <Download className="w-3 h-3" /> Save .TXT
                          </button>
                       </div>
                       <textarea 
                          readOnly 
                          value={extractedText}
                          className="w-full h-[400px] p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl font-mono text-sm text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                       />
                    </div>
                    
                    <div className="text-center">
                       <button onClick={resetTool} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Extract another document</button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="OCR_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
