'use client';

import { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface PDFThumbnailProps {
  file: File;
  pageNumber?: number;
  width?: number;
  className?: string;
  onLoad?: (numPages: number) => void;
}

export default function PDFThumbnail({ file, pageNumber = 1, width = 200, className = '', onLoad }: PDFThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const generateThumbnail = async () => {
      if (loadingRef.current || !file) return;
      loadingRef.current = true;
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        if (onLoad) {
           onLoad(pdf.numPages);
        }

        // Validate page number
        const targetPage = Math.min(Math.max(1, pageNumber), pdf.numPages);
        const page = await pdf.getPage(targetPage);

        const viewport = page.getViewport({ scale: 1.0 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('No canvas context');

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
        
        if (isActive) {
          setImageUrl(canvas.toDataURL('image/jpeg', 0.8));
        }

      } catch (err) {
        console.error("Thumbnail generation error:", err);
        if (isActive) setError("Failed to preview");
      } finally {
        loadingRef.current = false;
      }
    };

    generateThumbnail();

    return () => {
      isActive = false;
    };
  }, [file, pageNumber, width]); // Re-run if file or page number changes

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-500 border border-dashed border-gray-300 ${className}`} style={{ width, height: width * 1.414 }}>
        {error}
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse ${className}`} style={{ width, height: width * 1.414 }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-2"></div>
        <span className="text-xs text-gray-400 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group ${className}`} style={{ width }}>
      <img src={imageUrl} alt={`Page ${pageNumber}`} className="w-full h-auto object-cover" />
      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        {pageNumber}
      </div>
    </div>
  );
}
