'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, FileText, SplitSquareHorizontal, CheckSquare, Square } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import PDFThumbnail from '@/components/shared/PDFThumbnail';

export default function SplitPDFClient() {
  const tool = getToolById('split-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
       alert("Please upload a valid PDF file.");
       return;
    }
    setFile(selectedFile);
    setNumPages(0);
    setSelectedPages(new Set());
    setIsDone(false);
    setSplitPdfUrl(null);
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      return next;
    });
  };

  const selectAll = () => {
     const all = new Set<number>();
     for(let i=1; i<=numPages; i++) all.add(i);
     setSelectedPages(all);
  };

  const deselectAll = () => {
     setSelectedPages(new Set());
  };

  const handleProcess = async () => {
    if (!file || selectedPages.size === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const newPdf = await PDFDocument.create();
      
      const sortedSelectedIndices = Array.from(selectedPages).sort((a,b) => a-b).map(p => p - 1);
      
      const copiedPages = await newPdf.copyPages(pdfDoc, sortedSelectedIndices);
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setSplitPdfUrl(URL.createObjectURL(blob));
      setIsDone(true);
    } catch (e) {
      console.error(e);
      alert('Failed to split PDF. It may be encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
     if(splitPdfUrl) {
         const a = document.createElement('a');
         a.href = splitPdfUrl;
         a.download = `extracted-pages-${file?.name || 'document.pdf'}`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
     }
  };

  const resetTool = () => {
    setFile(null);
    setNumPages(0);
    setSelectedPages(new Set());
    setIsProcessing(false);
    setIsDone(false);
    setSplitPdfUrl(null);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="SPLIT_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <SplitSquareHorizontal className="w-6 h-6 text-white" />
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
                    <div className="p-3 bg-amber-500/10 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB • {numPages} pages</p>
                    </div>
                  </div>
                  {!isProcessing && !isDone && (
                    <button onClick={resetTool} className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto shrink-0">
                      Remove File
                    </button>
                  )}
                </div>

                {!isDone && (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10 p-4 border border-amber-100 dark:border-amber-900/50 rounded-xl">
                         <div>
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Select pages to extract</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400">Click on pages to toggle selection.</p>
                         </div>
                         <div className="flex gap-2 text-sm font-medium">
                            <button onClick={selectAll} className="text-amber-700 hover:text-amber-600 px-3 py-1.5 bg-amber-100/50 rounded-lg">Select All</button>
                            <button onClick={deselectAll} className="text-gray-600 hover:text-gray-900 px-3 py-1.5 bg-gray-100 rounded-lg">Clear All</button>
                         </div>
                      </div>
                      
                      <div className="relative border border-[var(--color-border-base)] rounded-xl bg-gray-50/50 dark:bg-gray-800/20 p-6 min-h-[300px]">
                         {numPages === 0 && (
                            <div className="hidden">
                               <PDFThumbnail file={file} pageNumber={1} onLoad={(n) => setNumPages(n)} />
                            </div>
                         )}
                         
                         {numPages === 0 ? (
                            <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-muted)] animate-pulse">
                               Loading document preview...
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                               {Array.from({ length: numPages }).map((_, i) => {
                                  const pageNum = i + 1;
                                  const isSelected = selectedPages.has(pageNum);
                                  return (
                                     <div 
                                        key={pageNum} 
                                        onClick={() => togglePageSelection(pageNum)}
                                        className={`relative cursor-pointer group transition-all duration-200 rounded-xl border-4 ${isSelected ? 'border-amber-500 shadow-md scale-[1.02]' : 'border-transparent hover:border-gray-200 hover:scale-[1.01]'}`}
                                     >
                                        <PDFThumbnail file={file} pageNumber={pageNum} width={150} className="rounded-lg shadow-sm w-full" />
                                        
                                        <div className="absolute top-2 left-2 z-10 transition-opacity">
                                           {isSelected ? (
                                              <div className="bg-amber-500 text-white rounded shadow-sm">
                                                 <CheckSquare className="w-6 h-6" />
                                              </div>
                                           ) : (
                                              <div className="bg-white/80 text-gray-400 rounded shadow-sm opacity-0 group-hover:opacity-100">
                                                 <Square className="w-6 h-6" />
                                              </div>
                                           )}
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                         )}
                      </div>
                   </div>
                )}


                {!isDone ? (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex justify-between items-center">
                     <span className="text-sm font-medium text-[var(--color-text-main)]">
                        {selectedPages.size} pages selected
                     </span>
                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing || selectedPages.size === 0}
                      className={`btn-primary w-full sm:w-auto min-w-[200px] ${selectedPages.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Extracting...</span>
                      ) : (
                        "Extract Pages"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                     <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                        <Download className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">PDF Split Complete!</h3>
                     <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">
                        A new PDF document containing your {selectedPages.size} selected pages has been created.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                           Split another file
                        </button>
                        <button onClick={handleDownload} className="btn-primary bg-amber-600 hover:bg-amber-500 ring-amber-600 shadow-lg shadow-amber-500/20 px-8 gap-2">
                           <Download className="w-4 h-4" /> Download New PDF
                        </button>
                     </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="SPLIT_SIDEBAR" className="h-[600px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
