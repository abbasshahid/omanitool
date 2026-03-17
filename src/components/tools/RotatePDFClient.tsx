'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, RotateCw, FileText } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface PageRotation {
  id: string;
  originalPageNumber: number;
  imageUrl: string;
  rotation: number; // 0, 90, 180, 270
}

export default function RotatePDFClient() {
  const tool = getToolById('rotate-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageRotation[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
       alert("Please upload a valid PDF file.");
       return;
    }
    setFile(selectedFile);
    setResultUrl(null);
    setIsLoadingPages(true);
    setPages([]);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const newPages: PageRotation[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          newPages.push({
            id: `page-${i}`,
            originalPageNumber: i,
            imageUrl: canvas.toDataURL('image/jpeg', 0.8),
            rotation: 0
          });
        }
      }
      setPages(newPages);
    } catch (e) {
      console.error(e);
      alert('Failed to load PDF preview. Make sure it is not encrypted.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleRotatePage = (index: number) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const handleProcess = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pdfPages.forEach((page, index) => {
         const addedRotation = pages[index].rotation;
         if (addedRotation !== 0) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + addedRotation));
         }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to rotate PDF. Make sure it is not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setIsProcessing(false);
    setResultUrl(null);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="ROTATE_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <RotateCw className="w-6 h-6 text-white" />
              </div>
              {tool.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
               <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/10 p-4">
                  <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf" />
               </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="p-3 bg-sky-500/10 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-sky-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isProcessing && !resultUrl && (
                    <button onClick={resetTool} className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto shrink-0">
                      Remove File
                    </button>
                  )}
                </div>

                {isLoadingPages && (
                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                     <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mb-4" />
                     <p className="text-sm text-gray-500">Generating page previews...</p>
                  </div>
                )}

                {!isLoadingPages && pages.length > 0 && !resultUrl && (
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-900/10 p-4 border border-sky-100 dark:border-sky-900/50 rounded-xl">
                        <RotateCw className="w-5 h-5 text-sky-500" />
                        <div>
                           <p className="text-sm font-semibold text-sky-900 dark:text-sky-300">Click rotate buttons to adjust pages</p>
                           <p className="text-xs text-sky-700 dark:text-sky-400">Hover over any page and click the rotate icon.</p>
                        </div>
                     </div>
                     
                     <div className="bg-gray-50/50 dark:bg-gray-800/30 border border-[var(--color-border-base)] rounded-xl p-6 min-h-[300px]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                           {pages.map((page, index) => (
                              <div key={page.id} className="relative flex flex-col items-center p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl group transition-colors hover:border-sky-300">
                                 <div className="shrink-0 w-full flex justify-center mb-3">
                                    <div className="relative overflow-hidden w-[120px] aspect-[1/1.4] flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                       <img 
                                          src={page.imageUrl} 
                                          alt={`Page ${page.originalPageNumber}`} 
                                          className="w-[120px] object-cover shadow-sm transition-transform duration-300"
                                          style={{ transform: `rotate(${page.rotation}deg)` }} 
                                       />
                                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <button 
                                             onClick={() => handleRotatePage(index)}
                                             className="bg-white text-sky-600 p-2 rounded-full hover:bg-sky-50 transition-colors shadow-lg transform hover:scale-110 active:scale-95"
                                             title="Rotate 90 degrees"
                                          >
                                             <RotateCw className="w-5 h-5" />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-center w-full mt-auto">
                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                                       Page {page.originalPageNumber}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {!resultUrl && !isLoadingPages && (
                  <div className="pt-4 border-t border-[var(--color-border-base)] flex justify-end">
                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing || pages.length === 0}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Rotating...</span>
                      ) : (
                        "Save PDF Now"
                      )}
                    </button>
                  </div>
                )}

                {resultUrl && (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                       <Download className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">PDF Rotated!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your document's pages have been rotated successfully.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                       <a href={resultUrl} download={`rotated-pdf-${Date.now()}.pdf`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
                          <Download className="w-5 h-5" /> Download PDF
                       </a>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="ROTATE_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
