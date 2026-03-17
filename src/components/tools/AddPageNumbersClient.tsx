'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, FileText, Hash, AlignLeft, AlignCenter, AlignRight, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type VerticalPos = 'top' | 'bottom';
type HorizontalPos = 'left' | 'center' | 'right';

export default function AddPageNumbersClient() {
  const tool = getToolById('add-page-numbers');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [vPos, setVPos] = useState<VerticalPos>('bottom');
  const [hPos, setHPos] = useState<HorizontalPos>('center');
  const [startNumber, setStartNumber] = useState<number>(1);
  const [pagesToNumber, setPagesToNumber] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
       alert("Please upload a valid PDF file.");
       return;
    }
    setFile(selectedFile);
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const pages = pdfDoc.getPages();
      
      let targetPages = new Set(pages.map((_, i) => i + 1));
      if (pagesToNumber === 'custom' && customRange.trim()) {
         targetPages = new Set();
         const parts = customRange.split(',');
         for (const part of parts) {
            const range = part.trim().split('-');
            if (range.length === 2) {
               const start = parseInt(range[0]);
               const end = parseInt(range[1]);
               if (!isNaN(start) && !isNaN(end)) {
                  for (let i = start; i <= end; i++) targetPages.add(i);
               }
            } else {
               const pageNum = parseInt(part);
               if (!isNaN(pageNum)) targetPages.add(pageNum);
            }
         }
      }

      let currentNum = startNumber;

      pages.forEach((page, index) => {
         const pageNum = index + 1;
         if (targetPages.has(pageNum)) {
            const { width, height } = page.getSize();
            const text = String(currentNum);
            const textSize = 12;
            const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
            
            const marginX = 30;
            const marginY = 30;
            
            let x = marginX;
            if (hPos === 'center') x = width / 2 - textWidth / 2;
            if (hPos === 'right') x = width - marginX - textWidth;
            
            let y = marginY;
            if (vPos === 'top') y = height - marginY - textSize;
            
            page.drawText(text, {
               x,
               y,
               size: textSize,
               font: helveticaFont,
               color: rgb(0, 0, 0)
            });
            
            currentNum++;
         }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to add page numbers. The PDF might be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setResultUrl(null);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  const Icon = tool.icon || Hash;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1 max-w-5xl mx-auto w-full">
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
                  <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf" />
               </div>
            ) : (
              <div className="space-y-8">
                
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
                  {!isProcessing && !resultUrl && (
                    <button onClick={resetTool} className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto shrink-0">
                      Remove File
                    </button>
                  )}
                </div>

                {!resultUrl && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-800/20 p-6 rounded-xl border border-gray-100 dark:border-gray-800/50">
                      
                      <div className="space-y-4">
                         <h3 className="font-semibold text-[var(--color-text-main)]">Position</h3>
                         
                         <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vertical</label>
                            <div className="flex gap-2">
                               <button onClick={() => setVPos('top')} className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${vPos === 'top' ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                  <ArrowUpFromLine className="w-4 h-4" /> Top
                               </button>
                               <button onClick={() => setVPos('bottom')} className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${vPos === 'bottom' ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                  <ArrowDownToLine className="w-4 h-4" /> Bottom
                               </button>
                            </div>
                         </div>

                         <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Horizontal</label>
                            <div className="flex gap-2">
                               <button onClick={() => setHPos('left')} className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${hPos === 'left' ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                  <AlignLeft className="w-4 h-4" />
                               </button>
                               <button onClick={() => setHPos('center')} className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${hPos === 'center' ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                  <AlignCenter className="w-4 h-4" />
                               </button>
                               <button onClick={() => setHPos('right')} className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg border text-sm transition-colors ${hPos === 'right' ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                  <AlignRight className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <h3 className="font-semibold text-[var(--color-text-main)]">Starting Number</h3>
                            <p className="text-xs text-[var(--color-text-muted)]">The number to print on the first labeled page.</p>
                            <input 
                               type="number" 
                               min="1" 
                               value={startNumber} 
                               onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                               className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                         </div>

                         <div className="space-y-2">
                            <h3 className="font-semibold text-[var(--color-text-main)]">Pages to label</h3>
                            <div className="flex gap-4">
                               <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" checked={pagesToNumber === 'all'} onChange={() => setPagesToNumber('all')} className="text-sky-500 focus:ring-sky-500" />
                                  <span className="text-sm">All pages</span>
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" checked={pagesToNumber === 'custom'} onChange={() => setPagesToNumber('custom')} className="text-sky-500 focus:ring-sky-500" />
                                  <span className="text-sm">Custom range</span>
                               </label>
                            </div>
                            {pagesToNumber === 'custom' && (
                               <input 
                                  type="text" 
                                  placeholder="e.g. 1-5, 8, 11-13" 
                                  value={customRange} 
                                  onChange={(e) => setCustomRange(e.target.value)}
                                  className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                               />
                            )}
                         </div>
                      </div>

                   </div>
                )}

                {!resultUrl ? (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex justify-end">
                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Numbering...</span>
                      ) : (
                        "Add Page Numbers"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                       <Download className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Page Numbers Added!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your document now has page numbers stamped on the specified pages.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                       <a href={resultUrl} download={`numbered-${Date.now()}.pdf`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
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
           <AdSenseBanner dataAdSlot="GENERIC_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
