'use client';

import { useState, useEffect } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { FileText, Download, ArrowRight, RefreshCw, LayoutTemplate, FileArchive } from 'lucide-react';
import JSZip from 'jszip';

export default function PDFToJPGPage() {
  const tool = getToolById('pdf-to-jpg');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    // Set worker source for pdfjs dynamically on client
    import('pdfjs-dist').then(pdfjsLib => {
       pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    });
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
       alert("Please select a valid PDF file.");
       return;
    }
    setFile(selectedFile);
    setImages([]);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setImages([]);
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const maxPages = Math.min(totalPages, 5); // Limit to 5 pages for browser performance
      
      const newImages = [];
      
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better JPG quality
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (ctx) {
          const renderContext: any = {
            canvasContext: ctx,
            viewport: viewport
          };
          await page.render(renderContext).promise;
          newImages.push(canvas.toDataURL('image/jpeg', 0.9));
        }
      }
      
      setImages(newImages);
      if (totalPages > 5) {
        alert("For browser performance, only the first 5 pages were converted.");
      }
      
    } catch (e) {
      console.error(e);
      alert('Failed to parse PDF and convert to JPG.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Folder name inside zip
    const folderName = file?.name ? file.name.replace('.pdf', '') : 'pdf_images';
    const folder = zip.folder(folderName);
    
    if (!folder) return;

    // Add each image to the zip file
    images.forEach((imgDataUrl, idx) => {
      // imgDataUrl is 'data:image/jpeg;base64,...'
      const base64Data = imgDataUrl.split(',')[1];
      folder.file(`page-${idx + 1}.jpg`, base64Data, { base64: true });
    });
    
    // Generate the zip file asynchronously
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create download link for the zip
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `${folderName}-images.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setFile(null);
    setImages([]);
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="PDFJPG_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Tool Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool?.color}`}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              {tool?.name}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">{tool?.description}</p>
          </div>

          <div className="card-container p-6 md:p-8">
            {!file ? (
              <FileUploader onFileSelect={handleFileSelect} acceptedTypes="application/pdf" />
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="p-3 bg-red-500/10 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isProcessing && images.length === 0 && (
                    <button onClick={resetTool} className="text-xs text-gray-500 hover:text-red-500 px-3 py-1">Remove</button>
                  )}
                </div>

                {images.length > 0 ? (
                  <div className="border border-[var(--color-border-base)] rounded-xl bg-gray-50 dark:bg-gray-800/20 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-[var(--color-text-main)]">Extracted Pages ({images.length})</h3>
                        <button onClick={handleDownloadAll} className="btn-primary py-2 px-4 gap-2 text-sm">
                          <FileArchive className="w-4 h-4" /> Download as ZIP
                        </button>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                           <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--color-border-base)] shadow-sm">
                              <img src={img} alt={`Page ${idx + 1}`} className="w-full h-auto object-cover bg-white" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <a href={img} download={`page-${idx + 1}.jpg`} className="text-white bg-indigo-600 hover:bg-indigo-500 rounded-full p-2">
                                    <Download className="w-4 h-4" />
                                 </a>
                              </div>
                              <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">Page {idx + 1}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                ) : (
                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                      Select different PDF
                    </button>

                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Extracting pages...</span>
                      ) : (
                        'Convert PDF to JPG'
                      )}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Sidebar Toolkit */}
        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="PDFJPG_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
           
           <div className="card-container p-6">
            <h3 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">Related Tools</h3>
            <div className="space-y-3">
              <a href="/tools/pdf-merger" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">PDF Merger</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
               <a href="/tools/format-converter" className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-background-base)] transition-colors group">
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-indigo-400">Format Converter</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </a>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
