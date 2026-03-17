'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, FileText, Type } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export default function AddWatermarkClient() {
  const tool = getToolById('add-watermark');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

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
    if (!watermarkText) {
       alert("Please enter watermark text.");
       return;
    }
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        page.drawText(watermarkText, {
          x: width / 2 - 100, 
          y: height / 2 - 50,
          size: 60,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      
    } catch (e) {
      console.error(e);
      alert('Failed to add watermark. The file might be corrupted or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setResultUrl(null);
    setWatermarkText('CONFIDENTIAL');
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  const Icon = tool.icon || FileText;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1">
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
                  <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf, image/*" />
               </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="p-3 bg-indigo-500/10 rounded-lg shrink-0">
                      <Icon className="w-6 h-6 text-indigo-500" />
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
                   <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1">
                            <Type className="w-5 h-5" />
                         </div>
                         <div className="flex-1 space-y-4">
                            <div>
                               <h3 className="font-semibold text-[var(--color-text-main)] mb-1">Watermark Settings</h3>
                               <p className="text-sm text-[var(--color-text-muted)]">Customize the text that will be stamped across all pages.</p>
                            </div>
                            
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">Watermark Text</label>
                                  <input 
                                     type="text" 
                                     value={watermarkText} 
                                     onChange={(e) => setWatermarkText(e.target.value)}
                                     placeholder="e.g. CONFIDENTIAL or DRAFT"
                                     className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                  />
                               </div>
                            </div>
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
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</span>
                      ) : (
                        "Add Watermark"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                       <Download className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Watermark Added!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your document has been successfully processed and is ready for download.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                       <a href={resultUrl} download={`watermarked-${file.name}`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
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
