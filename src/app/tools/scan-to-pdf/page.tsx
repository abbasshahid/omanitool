'use client';

import { useState, useRef, useEffect } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { RefreshCw, Download, Camera, SwitchCamera, X, Plus, FileImage } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ScanToPDFPage() {
  const tool = getToolById('scan-to-pdf');
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFrontCamera ? 'user' : 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Unable to access camera. Please check permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
    setTimeout(startCamera, 100);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImages(prev => [...prev, imageUrl]);
        stopCamera();
        setResultUrl(null);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageUrl of images) {
        const response = await fetch(imageUrl);
        const imageBytes = await response.arrayBuffer();
        const base64Str = imageUrl.split(',')[1];
        
        let embeddedImage;
        if (imageUrl.startsWith('data:image/png')) {
          embeddedImage = await pdfDoc.embedPng(base64Str);
        } else {
          embeddedImage = await pdfDoc.embedJpg(base64Str);
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
      alert('Failed to generate PDF from scans.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setImages([]);
    setIsProcessing(false);
    setResultUrl(null);
    stopCamera();
  };

  if (!tool) return <div className="p-10 text-center">Tool not found</div>;

  const Icon = tool.icon || Camera;

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="GENERIC_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
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
              
              {isCameraActive ? (
                 <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-6">
                       <button onClick={stopCamera} className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 backdrop-blur-md transition-colors">
                          <X className="w-6 h-6" />
                       </button>
                       <button onClick={captureImage} className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full hover:bg-gray-100 transition-colors shadow-lg active:scale-95" />
                       <button onClick={toggleCamera} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-md transition-colors">
                          <SwitchCamera className="w-6 h-6" />
                       </button>
                    </div>
                 </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-[1/1.4] rounded-xl overflow-hidden border border-[var(--color-border-base)] bg-gray-100 dark:bg-gray-800">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 top-0 p-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/50 to-transparent">
                           <button onClick={() => removeImage(index)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm">
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-xs truncate font-medium">
                           Scan {index + 1}
                        </div>
                      </div>
                    ))}
                    
                    {!resultUrl && (
                      <button 
                        onClick={startCamera}
                        className="relative aspect-[1/1.4] border-2 border-dashed border-sky-300 dark:border-sky-700 hover:border-sky-500 dark:hover:border-sky-500 bg-sky-50 hover:bg-sky-100/50 dark:bg-sky-900/10 dark:hover:bg-sky-900/20 rounded-xl flex flex-col items-center justify-center transition-colors group"
                      >
                        <Camera className="w-10 h-10 text-sky-500 mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-sky-700 dark:text-sky-400">{images.length > 0 ? 'Scan Another' : 'Start Scanning'}</span>
                      </button>
                    )}
                  </div>

                  {images.length === 0 && !resultUrl && (
                    <div className="text-center py-6">
                       {cameraError && <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg inline-block border border-red-100 dark:border-red-900/50">{cameraError}</p>}
                       <p className="text-[var(--color-text-muted)] text-sm">Click "Start Scanning" to open your webcam and take photos of your document.</p>
                    </div>
                  )}

                  {images.length > 0 && !resultUrl && (
                    <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button onClick={resetTool} className="text-sm text-gray-500 hover:text-[var(--color-text-main)]">
                         Clear all scans
                      </button>

                      <button 
                        onClick={handleProcess} 
                        disabled={isProcessing}
                        className="btn-primary w-full sm:w-auto min-w-[200px]"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF...</span>
                        ) : (
                          "Create PDF from Scans"
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}

              {resultUrl && (
                <div className="pt-6 border-t border-[var(--color-border-base)] flex flex-col items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                     <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">PDF Ready!</h3>
                  <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">Your scans have been successfully converted into a PDF document.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                     <button onClick={resetTool} className="text-sm text-gray-500 font-medium hover:text-[var(--color-text-main)]">
                        Scan More Documents
                     </button>
                     <a href={resultUrl} download={`scanned-doc-${Date.now()}.pdf`} className="btn-primary bg-emerald-600 hover:bg-emerald-500 ring-emerald-600 shadow-lg shadow-emerald-500/20 px-8 py-3 rounded-xl gap-2 font-bold text-white flex items-center justify-center">
                        <Download className="w-5 h-5" /> Download PDF
                     </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[336px] flex-shrink-0 space-y-8">
           <AdSenseBanner dataAdSlot="GENERIC_SIDEBAR" className="h-[280px] w-full bg-slate-900/50 rounded-xl border border-[var(--color-border-base)]" />
        </aside>

      </div>
    </div>
  );
}
