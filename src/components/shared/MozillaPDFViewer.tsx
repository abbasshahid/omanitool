'use client';

import { useEffect, useRef } from 'react';

interface MozillaPDFViewerProps {
  file: File;
}

export default function MozillaPDFViewer({ file }: MozillaPDFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    // The the viewer allows passing the file via the 'file' query parameter if it's a URL,
    // but for local Blobs, it's safer to wait for the iframe to load and then set the file.
    
    const viewerUrl = `/lib/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    
    if (iframeRef.current) {
      iframeRef.current.src = viewerUrl;
    }

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  return (
    <div className="w-full h-full min-h-[700px] border border-[var(--color-border-base)] rounded-xl overflow-hidden bg-white shadow-xl">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        title="Mozilla PDF.js Editor"
      />
    </div>
  );
}
