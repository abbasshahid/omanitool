'use client';

import { useState } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { LayoutTemplate, Plus, Download, RefreshCw, Trash2, ArrowUpDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortablePDFItem from '@/components/shared/SortablePDFItem';

interface FileItem {
  id: string;
  file: File;
}

export default function PDFMergerPage() {
  const tool = getToolById('pdf-merger');
  const [items, setItems] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
       coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleMultipleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      if (newFiles.length !== e.target.files.length) {
         alert("Only PDF files are allowed.");
      }
      const newItems = newFiles.map(file => ({
         id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         file
      }));
      setItems(prev => [...prev, ...newItems]);
      setResultUrl(null);
    }
  };

  const removeFile = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (items.length < 2) {
      alert("Please upload at least two PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const item of items) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to merge PDFs. One of the documents might be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `merged-document-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setItems([]);
    setResultUrl(null);
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="PDFMERGE_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool Area */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool?.color}`}>
                <LayoutTemplate className="w-6 h-6 text-white" />
              </div>
              {tool?.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool?.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            <div className="space-y-6">
              
              {/* File List / DND Context */}
              {items.length > 0 && !resultUrl && (
                 <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center gap-3">
                    <ArrowUpDown className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                       <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Drag to reorder</p>
                       <p className="text-xs text-indigo-700 dark:text-indigo-400">The files will be merged in the order shown below, from top to bottom.</p>
                    </div>
                 </div>
              )}

              {/* Sortable Grid View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <DndContext 
                   sensors={sensors}
                   collisionDetection={closestCenter}
                   onDragEnd={handleDragEnd}
                 >
                   <SortableContext 
                     items={items.map(i => i.id)}
                     strategy={verticalListSortingStrategy}
                   >
                     {items.map((item, index) => (
                       <SortablePDFItem 
                          key={item.id} 
                          id={item.id} 
                          file={item.file} 
                          index={index} 
                          onRemove={removeFile}
                          disabled={!!resultUrl}
                       />
                     ))}
                   </SortableContext>
                 </DndContext>
              </div>

              {/* Add Files Plate */}
              {!resultUrl && (
                <div className="relative border-2 border-dashed border-[var(--color-border-base)] hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl p-8 text-center transition-colors cursor-pointer group mt-4">
                  <input 
                    type="file" 
                    multiple 
                    accept="application/pdf"
                    onChange={handleMultipleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-[var(--color-text-main)] font-medium">Add more PDF files</p>
                </div>
              )}

              {/* Actions */}
              {items.length > 0 && (
                <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                    Clear all files
                  </button>

                  <div className="w-full sm:w-auto">
                    {!resultUrl ? (
                      <button 
                        onClick={handleProcess} 
                        disabled={isProcessing || items.length < 2}
                        className={`btn-primary w-full ${items.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                       {isProcessing ? (
                          <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Merging...</span>
                       ) : 'Merge PDFs'}
                      </button>
                    ) : (
                      <button onClick={handleDownload} className="btn-primary w-full gap-2 bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20">
                        <Download className="w-4 h-4" /> Download Merged PDF
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar Toolkit */}
        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="PDFMERGE_SIDEBAR" className="h-[600px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
