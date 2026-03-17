'use client';

import { useState } from 'react';
import { 
  Download, Link2, Image as ImageIcon, Video, 
  Layers, Package, AlertCircle, CheckCircle2, 
  Loader2, ExternalLink, Scissors, ChevronDown, Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import AdSenseBanner from '@/components/ads/AdSenseBanner';

interface MediaResult {
  images: { url: string; title?: string }[];
  videos: { 
    url: string; 
    title?: string; 
    resolutions: string[];
    urlMap: Record<string, string>;
  }[];
  type: string;
}

export default function MediaDownloaderClient() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [selectedResolutions, setSelectedResolutions] = useState<Record<number, string>>({});

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/media/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Extraction failed');

      setResult(data);
      // Initialize default resolutions
      const defaults: Record<number, string> = {};
      data.videos.forEach((v: any, i: number) => {
        defaults[i] = v.resolutions[0];
      });
      setSelectedResolutions(defaults);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async (imgUrl: string, filename: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'image.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const downloadAllImages = async () => {
    if (!result || result.images.length === 0) return;
    
    setIsZipping(true);
    const zip = new JSZip();
    const imagesToDownload = result.type === 'social' ? result.images.slice(0, 30) : result.images;
    
    try {
      const promises = imagesToDownload.map(async (img, index) => {
        try {
          const response = await fetch(img.url);
          const blob = await response.blob();
          const ext = img.url.split('.').pop()?.split('?')[0] || 'jpg';
          zip.file(`image-${index + 1}.${ext}`, blob);
        } catch (e) {
          console.error(`Failed to add image ${index} to zip`, e);
        }
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omnitool-media-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Zip generation failed', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Download className="w-4 h-4" />
          Multi-Platform Media Downloader
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-main)] mb-4">
          Extract Media from <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Any Link</span>
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Paste a link from Facebook, Instagram, Amazon, or any website to instantly download images and videos in high quality.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-3xl p-5 md:p-8 shadow-xl mb-12">
        <form onSubmit={handleExtract} className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
              <Link2 className="w-5 h-5" />
            </div>
            <input 
              type="url"
              required
              placeholder="Paste URL (Social, Shop, or Website)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[var(--color-background-base)] border-2 border-[var(--color-border-base)] rounded-2xl py-3.5 md:py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm md:text-base"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
            {isLoading ? 'Extracting...' : 'Extract Media'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <AdSenseBanner dataAdSlot="TOOLS_TOP_BANNER" className="mb-12" />

      {/* Results Section */}
      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Images Grid */}
          {result.images.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                    Extracted Images 
                    <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">({result.images.length} found)</span>
                  </h2>
                </div>
                <button 
                  onClick={downloadAllImages}
                  disabled={isZipping}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
                >
                  {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  {isZipping ? 'Zipping...' : `Download All ${result.type === 'social' ? '(30 max)' : ''}`}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {result.images.slice(0, 100).map((img, i) => (
                  <div key={i} className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-[var(--color-border-base)]">
                    <img src={img.url} alt={`Found ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button 
                        onClick={() => downloadImage(img.url, `omni-image-${i}.jpg`)}
                        className="p-3 bg-white text-black rounded-full shadow-xl hover:scale-110 transition-transform"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos Section */}
          {result.videos.length > 0 && (
            <section className="bg-gradient-to-br from-[var(--color-surface-base)] to-purple-500/5 border border-[var(--color-border-base)] rounded-3xl p-5 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                  <Video className="w-5 h-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-main)]">Extracted Videos</h2>
              </div>

              <div className="flex flex-col gap-6 md:gap-8">
                {result.videos.map((video, idx) => (
                  <div key={idx} className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center p-4 md:p-6 bg-[var(--color-background-base)] rounded-2xl border border-[var(--color-border-base)]">
                    <div className="aspect-video w-full lg:w-80 bg-black rounded-xl overflow-hidden shadow-lg relative group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="w-10 h-10 md:w-12 md:h-12 text-white/50" />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      <div className="max-w-full overflow-hidden">
                        <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-main)] mb-1 truncate">{video.title || 'Extracted Video'}</h3>
                        <p className="text-xs md:text-sm text-[var(--color-text-muted)] truncate">{url}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
                        <div className="flex flex-col gap-1.5 flex-1 w-full">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Resolution</label>
                          <div className="relative">
                            <select 
                              value={selectedResolutions[idx]}
                              onChange={(e) => setSelectedResolutions({ ...selectedResolutions, [idx]: e.target.value })}
                              className="w-full appearance-none bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-xl py-2.5 px-4 pr-10 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {video.resolutions.map(res => (
                                <option key={res} value={res}>{res}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            const selectedRes = selectedResolutions[idx];
                            const downloadUrl = video.urlMap[selectedRes] || video.url;
                            window.open(downloadUrl, '_blank');
                          }}
                          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md w-full sm:w-auto"
                        >
                          <Download className="w-5 h-5" />
                          <span className="whitespace-nowrap">Download {selectedResolutions[idx]}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {result.images.length === 0 && result.videos.length === 0 && (
            <div className="text-center py-20 bg-[var(--color-surface-base)] rounded-3xl border-2 border-dashed border-[var(--color-border-base)]">
               <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <p className="text-[var(--color-text-muted)] font-medium">No media files could be detected at this URL.</p>
            </div>
          )}
        </div>
      )}

      {/* Guide / Promo */}
      {!result && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:mt-20 mt-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-text-main)]">How it works</h2>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Copy the link of the post, reel, or product page you want to extract.' },
                { step: '2', text: 'Paste the link in the input box above and click "Extract Media".' },
                { step: '3', text: 'Preview the images and videos, choose your resolution, and download!' },
              ].map(item => (
                <div key={item.step} className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-base)] border border-[var(--color-border-base)]">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                  <p className="text-[var(--color-text-muted)] text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <Sparkles className="absolute -top-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Why use OmniTool Media?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Unlimited Bulk Image Downloads
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  E-commerce Product Media (Amazon, AliExpress)
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  High-Resolution Video Detection
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No Watermarks or Hidden Fees
                </li>
              </ul>
              <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                <p className="text-xs italic opacity-80">"Support OmniTool by donating - help us keep these massive tools free for everyone!"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdSenseBanner dataAdSlot="TOOLS_BOTTOM_BANNER" className="mt-20" />
    </div>
  );
}
