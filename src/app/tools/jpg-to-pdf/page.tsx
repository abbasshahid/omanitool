'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, ArrowRight, FileImage, Trash2, Plus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function JPGToPDFPage() {
  const tool = getToolById('jpg-to-pdf');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleMultipleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
      setResultUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let embeddedImage;

        if (file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const { width, height } = embeddedImage.scaleToFit(595, 842); // A4 roughly
        const page = pdfDoc.addPage([595, 842]);
        
        page.drawImage(embeddedImage, {
          x: 595 / 2 - width / 2,
          y: 842 / 2 - height / 2,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF. Make sure all files are valid JPG/PNG images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setIsProcessing(false);
    setResultUrl(null);
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;
  const Icon = tool.icon || FileImage;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      {/* Top Leaderboard Ad */}
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="JPGPDF_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {tool.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            <div className="space-y-6">
              
              {/* File List */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--color-border-base)] bg-gray-100 dark:bg-gray-800">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => removeFile(index)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-xs truncate">
                       {index + 1}. {file.name}
                    </div>
                  </div>
                ))}
                
                {/* Add Files Plate */}
                {!resultUrl && (
                  <div className="relative aspect-square border-2 border-dashed border-[var(--color-border-base)] hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800/30 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleMultipleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Plus className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-sm font-medium text-[var(--color-text-muted)]">Add Images</span>
                  </div>
                )}
              </div>

              {files.length === 0 && (
                <div className="text-center py-10 opacity-50">
                   <FileImage className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)]" />
                   <p className="text-[var(--color-text-muted)]">Upload images above to begin</p>
                </div>
              )}

              {files.length > 0 && !resultUrl && (
                <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                    Clear all images
                  </button>

                  <button 
                    onClick={handleProcess} 
                    disabled={isProcessing}
                    className="btn-primary w-full sm:w-auto min-w-[200px]"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF...</span>
                    ) : (
                      "Convert to PDF"
                    )}
                  </button>
                </div>
              )}

              {resultUrl && (
                <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center mt-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                     <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">PDF Ready!</h3>
                  <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your new PDF document has been compiled successfully.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                     <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                        Create Another
                     </button>
                     <a href={resultUrl} download={`images-to-pdf-${Date.now()}.pdf`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
                        <Download className="w-5 h-5" /> Download PDF
                     </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar Toolkit */}
        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="JPGPDF_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
