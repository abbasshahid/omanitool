'use client';

import { useEffect, useRef } from 'react';

interface ApryseWebViewerProps {
  file?: File;
  initialDoc?: string;
  onSave?: (blob: Blob) => void;
}

export default function ApryseWebViewer({ file, initialDoc, onSave }: ApryseWebViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Dynamically import WebViewer to avoid SSR issues
    const initWebViewer = async () => {
      const { default: WebViewer } = await import('@pdftron/webviewer');

      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: process.env.NEXT_PUBLIC_APRYSE_LICENSE_KEY, 
          initialDoc: initialDoc || (file ? URL.createObjectURL(file) : undefined),
          fullAPI: true,
        },
        viewerRef.current!
      ).then((instance) => {
        instanceRef.current = instance;
        const { documentViewer, annotationManager } = instance.Core;

        console.log('WebViewer instance loaded');

        // Disable UI Branding Logo
        instance.UI.disableElements(['logo-image']);

        // Wait for document to load before enabling Edit features
        documentViewer.addEventListener('documentLoaded', () => {
          console.log('Document loaded, enabling Content Editing');
          
          // Enable Content Editing (Modifying existing text/images)
          instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
          
          // Switch to Edit toolbar
          instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.EDIT);
        });

        // You can add custom buttons or logic here
        instance.UI.setHeaderItems((header: any) => {
          header.push({
            type: 'actionButton',
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const data = await doc.getFileData({ xfdfString });
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: 'application/pdf' });

              if (onSave) {
                onSave(blob);
              } else {
                // Default download behavior
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'edited_document.pdf';
                a.click();
              }
            },
          });
        });
      });
    };

    initWebViewer();

    return () => {
      // Cleanup if necessary
      if (instanceRef.current) {
        // Some cleanup logic might go here if the SDK supports it
      }
    };
  }, []); // Only run once on mount

  return (
    <div
      className="webviewer w-full h-full min-h-[700px] border border-[var(--color-border-base)] rounded-xl overflow-hidden"
      ref={viewerRef}
    />
  );
}
