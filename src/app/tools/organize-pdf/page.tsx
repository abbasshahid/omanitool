'use client';

import { useState, useEffect } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, ArrowUpDown, FileText, LayoutGrid } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortablePDFPageItem from '@/components/shared/SortablePDFPageItem';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface PageItem {
  id: string;
  pageNumber: number; // Original 1-based index
  imageUrl: string;
}

export default function OrganizePDFPage() {
  const tool = getToolById('organize-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
       alert("Please upload a valid PDF file.");
       return;
    }
    setFile(selectedFile);
    setResultUrl(null);
    setIsLoadingPages(true);
    setItems([]);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const newItems: PageItem[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          newItems.push({
            id: `page-${i}`,
            pageNumber: i,
            imageUrl: canvas.toDataURL('image/jpeg', 0.8)
          });
        }
      }
      setItems(newItems);
    } catch (e) {
      console.error(e);
      alert('Failed to load PDF preview. Make sure it is not encrypted.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removePage = (id: string) => {
    setItems((items) => items.filter(item => item.id !== id));
  };

  const handleProcess = async () => {
    if (!file || items.length === 0) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      // Get the requested page indices (0-based)
      const pageIndices = items.map(item => item.pageNumber - 1);
      
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to organize PDF. Trying to process an encrypted document?');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setItems([]);
    setIsProcessing(false);
    setResultUrl(null);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <LayoutGrid className="w-6 h-6 text-white" />
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

                {isLoadingPages && (
                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                     <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                     <p className="text-sm text-gray-500">Generating page previews...</p>
                  </div>
                )}

                {!isLoadingPages && items.length > 0 && !resultUrl && (
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/10 p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                        <ArrowUpDown className="w-5 h-5 text-indigo-500" />
                        <div>
                           <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Drag to reorder, click trash to delete</p>
                           <p className="text-xs text-indigo-700 dark:text-indigo-400">Rearrange the pages in the visual grid below.</p>
                        </div>
                     </div>
                     
                     <div className="bg-gray-50/50 dark:bg-gray-800/30 border border-[var(--color-border-base)] rounded-xl p-6 min-h-[300px]">
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={items.map(i => i.id)}
                            strategy={rectSortingStrategy}
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                               {items.map((item, index) => (
                                 <SortablePDFPageItem 
                                    key={item.id} 
                                    id={item.id} 
                                    imageUrl={item.imageUrl} 
                                    originalPageNumber={item.pageNumber}
                                    currentIndex={index}
                                    onRemove={removePage}
                                 />
                               ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                     </div>
                  </div>
                )}

                {!resultUrl && !isLoadingPages && (
                  <div className="pt-4 border-t border-[var(--color-border-base)] flex justify-end">
                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing || items.length === 0}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Organizing...</span>
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
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">PDF Reorganized!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your document pages have been rearranged successfully.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                       <a href={resultUrl} download={`organized-pdf-${Date.now()}.pdf`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
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
