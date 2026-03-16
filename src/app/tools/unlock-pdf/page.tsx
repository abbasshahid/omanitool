'use client';

import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, FileText, LockOpen } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function UnlockPDFPage() {
  const tool = getToolById('unlock-pdf');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");

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
    
    if (!password.trim()) {
      alert("Please enter the password to unlock the document.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      // pdf-lib's load accepts a password to decrypt. If loaded and saved, it strips encryption.
      // @ts-ignore - 'password' is a valid option but sometimes missing from LoadOptions definitions
      const pdfDoc = await PDFDocument.load(arrayBuffer, { password });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      console.error(e);
      if (e.message?.toLowerCase().includes('password')) {
         alert('Incorrect password. Please try again.');
      } else {
         alert('Failed to unlock PDF. Ensure the file is valid and the password is correct.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setResultUrl(null);
    setPassword("");
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="UNLOCK_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3">
              <div className={"p-2 rounded-lg bg-gradient-to-br " + tool.color + " shadow-lg"}>
                <LockOpen className="w-6 h-6 text-white" />
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
                    <div className="p-3 bg-red-500/10 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isProcessing && !resultUrl && (
                    <button onClick={resetTool} className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
                      Remove File
                    </button>
                  )}
                </div>

                {!resultUrl ? (
                  <div className="pt-4 border-t border-[var(--color-border-base)] flex flex-col items-end gap-4">
                    
                    <div className="w-full relative">
                       <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">Original Document Password</label>
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Enter password..."
                         className="w-full px-4 py-3 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl text-[var(--color-text-main)] focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
                       />
                       <p className="text-xs text-[var(--color-text-muted)] mt-2">Required to authorize removal of encryption layers.</p>
                    </div>

                    <button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      className="btn-primary w-full sm:w-auto min-w-[200px]"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Unlocking...</span>
                      ) : (
                        "Unlock PDF Now"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                       <LockOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Successfully Unlocked!</h3>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">The encryption has been stripped. The document is now free to use.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                       <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                          Start Over
                       </button>
                       <a href={resultUrl} download={`unlocked-${file.name}`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
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
           <AdSenseBanner dataAdSlot="UNLOCK_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
