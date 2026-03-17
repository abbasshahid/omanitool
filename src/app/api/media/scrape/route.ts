import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    let media = {
      images: [] as { url: string; title?: string }[],
      videos: [] as { 
        url: string; 
        title: string; 
        resolutions: string[];
        urlMap: Record<string, string>;
      }[],
      type: 'general'
    };

    // --- Hardened Multi-Layered Extraction Logic ---
    let finalUrl = url;
    let html = '';
    
    try {
      // Layer 1: Canonicalization
      if (domain.includes('facebook.com')) {
        const idMatch = url.match(/(?:\/v\/|v=|share\/v\/|reel\/|videos\/)(\d{10,24})/);
        if (idMatch) finalUrl = `https://www.facebook.com/watch/?v=${idMatch[1]}`;
      } else if (domain.includes('instagram.com')) {
        const instaIdMatch = url.match(/(?:\/p\/|\/reels\/|\/reel\/)([A-Za-z0-7_-]+)/);
        if (instaIdMatch) finalUrl = `https://www.instagram.com/reel/${instaIdMatch[1]}/`;
      }

      // Layer 2: Fetch and Regex Extraction (Fast Primary Pass)
      const initialResponse = await fetch(finalUrl, { 
        redirect: 'follow',
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      html = await initialResponse.text();
      const updatedUrlObj = new URL(initialResponse.url);
      const updatedDomain = updatedUrlObj.hostname;

      const getMeta = (prop: string) => {
        const regex = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^">]+)"|<meta[^>]+content="([^">]+)"[^>]+(?:property|name)="${prop}"`, 'i');
        const match = html.match(regex);
        return match ? (match[1] || match[2]) : null;
      };

      const ogImage = getMeta('og:image');
      const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "Extracted Media";

      if (ogImage) media.images.push({ url: ogImage, title: pageTitle });

      // Search for video signatures in JSON/HTML (Fast Pass)
      const videoKeys = ['playable_url', 'playable_url_quality_hd', 'browser_native_hd_url', 'browser_native_sd_url', 'video_url', 'hd_src', 'sd_src', 'contentUrl'];
      
      const fastVideoMap: Record<string, { label: string, url: string }> = {};
      videoKeys.forEach(key => {
        const regex = new RegExp(`"${key}":"([^"]+)"`, 'g');
        let vMatch;
        while ((vMatch = regex.exec(html)) !== null) {
          let vUrl = vMatch[1].replace(/\\/g, '').replace(/&amp;/g, '&');
          if (vUrl.startsWith('http')) {
            const label = key.includes('hd') ? 'High Quality (HD)' : 'Standard Quality';
            fastVideoMap[label] = { label, url: vUrl };
          }
        }
      });

      if (Object.keys(fastVideoMap).length > 0) {
        const sortedLabels = Object.keys(fastVideoMap).sort();
        const urlMap: Record<string, string> = {};
        sortedLabels.forEach(l => urlMap[l] = fastVideoMap[l].url);
        
        media.videos.push({
          title: pageTitle,
          url: fastVideoMap['High Quality (HD)']?.url || fastVideoMap['Standard Quality']?.url || Object.values(fastVideoMap)[0].url,
          resolutions: sortedLabels,
          urlMap
        });
      }

      // Layer 3: yt-dlp Hardcore Fallback (Industry Standard)
      // We run this if no HD video was found or if we want better resolution mapping
      if (media.videos.length === 0 || !media.videos[0].resolutions.some(r => r.includes('HD'))) {
        try {
          const scriptPath = path.join(process.cwd(), 'scripts', 'downloader.py');
          const { stdout } = await execAsync(`python "${scriptPath}" "${finalUrl}"`);
          const result = JSON.parse(stdout);
          
          if (!result.error && result.formats && result.formats.length > 0) {
            const ytdlUrlMap: Record<string, string> = {};
            const ytdlResolutions: string[] = [];
            
            result.formats.forEach((f: any) => {
              if (f.url) {
                const label = f.resolution && f.resolution !== 'null' ? f.resolution : (f.format_note || 'Auto Quality');
                if (!ytdlUrlMap[label]) {
                  ytdlUrlMap[label] = f.url;
                  ytdlResolutions.push(label);
                }
              }
            });

            if (ytdlResolutions.length > 0) {
              const videoObj = {
                title: result.title || pageTitle,
                url: ytdlUrlMap[ytdlResolutions[0]],
                resolutions: ytdlResolutions,
                urlMap: ytdlUrlMap
              };

              // If regex found something but yt-dlp found better, replace it
              if (media.videos.length > 0) {
                media.videos[0] = videoObj;
              } else {
                media.videos.push(videoObj);
              }
            }
            
            if (result.thumbnail && !media.images.some(i => i.url === result.thumbnail)) {
              media.images.push({ url: result.thumbnail, title: result.title });
            }
          }
        } catch (e) {
          console.error('yt-dlp fallback failed', e);
        }
      }

      // Layer 4: General Image Extraction
      const foundImages = new Set<string>();
      const blacklistedKeywords = ['logo', 'icon', 'favicon', 'avatar', 'profile', 'sprite', 'pixel', 'tracking', 'banner', 'button', 'loader', '16x16', '32x32'];

      const imgRegex = /(?:src|data-src|data-lazy-src|srcset)="([^"> ]+)"/g;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(html)) !== null && foundImages.size < 40) {
        let src = imgMatch[1].split(' ')[0];
        if (src.startsWith('//')) src = 'https:' + src;
        if (src.startsWith('/')) src = updatedUrlObj.origin + src;
        if (src.startsWith('http')) {
          const lowerSrc = src.toLowerCase();
          if (!blacklistedKeywords.some(kw => lowerSrc.includes(kw))) {
            foundImages.add(src);
          }
        }
      }
      
      foundImages.forEach(src => {
        if (!media.images.some(i => i.url === src)) {
          media.images.push({ url: src, title: pageTitle });
        }
      });

    } catch (scrapError) {
      console.error('Core Extraction error:', scrapError);
    }

    // Final sorting and de-duplication
    if (media.videos.length > 1) {
      media.videos = media.videos.sort((a, b) => (b.url.length - a.url.length));
    }

    if (media.images.length === 0 && media.videos.length === 0) {
      return NextResponse.json({ error: 'No media found. The page might be protected or require login.' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('API Outer error:', error);
    return NextResponse.json({ error: 'Failed to process request. Try again shortly.' }, { status: 500 });
  }
}
