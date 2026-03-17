import { constructMetadata, generateSoftwareSchema } from '@/lib/seo';
import MediaDownloaderClient from '@/components/tools/MediaDownloaderClient';
import { FileImage } from 'lucide-react';

export function generateMetadata() {
  return constructMetadata({
    title: 'Media Downloader - Extract Images & Videos from any URL',
    description: 'Download images and videos from Instagram, Facebook, Amazon, AliExpress, and more. Free, unlimited, and high-quality media extraction.',
    canonical: '/tools/media-downloader',
  });
}

export default function MediaDownloaderPage() {
  const schema = generateSoftwareSchema({
    name: 'Media Downloader',
    description: 'Download images and videos from URLs, including Social Media and E-commerce sites.',
    path: '/tools/media-downloader'
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen pb-20">
        <MediaDownloaderClient />
      </main>
    </>
  );
}
