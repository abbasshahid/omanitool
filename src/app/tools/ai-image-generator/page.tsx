'use client';

import { useState } from 'react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { getToolById } from '@/lib/toolsConfig';
import { ImageIcon, Wand2, RefreshCw, Download } from 'lucide-react';

export default function AIImageGeneratorPage() {
  const tool = getToolById('ai-image-generator');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setResultImage(null);
    
    // Pseudo-functional mock that returns a real image based loosely on the prompt
    // For a real app, this hits /api/generate-image -> OpenAI DALL-E 3
    setTimeout(() => {
      // Use Unsplash source to generate a realistic looking mockup image
      const keywords = prompt.split(' ').slice(0, 3).join(',');
      const randomSeed = Math.floor(Math.random() * 1000);
      setResultImage(`https://source.unsplash.com/800x800/?${keywords}&sig=${randomSeed}`);
      setIsProcessing(false);
    }, 3500);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="AIGEN_TOP_BANNER" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${tool?.color} mb-4 shadow-lg`}>
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">{tool?.name}</h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">{tool?.description}</p>
        </div>

        <div className="card-container p-6 md:p-8 shadow-xl">
          <div className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">Describe what you want to see</label>
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city cyberpunk sunset with flying cars, highly detailed, 8k resolution..."
                  className="w-full h-32 bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl p-4 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isProcessing || !prompt.trim()}
                  className="absolute bottom-4 right-4 btn-primary bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border-0 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Wand2 className="w-4 h-4" /> Generate Image</span>
                  )}
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="mt-8 border-t border-[var(--color-border-base)] pt-8">
               <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Result</h3>
               <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 aspect-square md:aspect-[4/3] flex items-center justify-center border border-[var(--color-border-base)]">
                 
                 {isProcessing ? (
                    <div className="flex flex-col items-center">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center animate-pulse mb-6 shadow-lg shadow-fuchsia-500/20">
                          <Wand2 className="w-8 h-8 text-white" />
                       </div>
                       <p className="text-[var(--color-text-main)] font-medium text-lg">Dreaming up your image...</p>
                       <p className="text-[var(--color-text-muted)] mt-2">This usually takes 5-10 seconds</p>
                    </div>
                 ) : resultImage ? (
                    <div className="w-full h-full relative group">
                       <img src={resultImage} alt={prompt} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <p className="text-white text-sm mb-4 line-clamp-2">{prompt}</p>
                          <a href={resultImage} download="ai-generated.jpg" target="_blank" rel="noreferrer" className="btn-primary w-fit gap-2">
                             <Download className="w-4 h-4" /> Download Full Resolution
                          </a>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center p-6 opacity-60">
                       <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                       <p className="text-[var(--color-text-muted)]">Your generated image will appear here</p>
                    </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
