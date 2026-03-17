import yt_dlp
import json
import sys

def extract_info(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        'skip_download': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
            
            # Extract relevant fields
            result = {
                'title': info.get('title', 'Social Media Video'),
                'thumbnail': info.get('thumbnail', ''),
                'webpage_url': info.get('webpage_url', url),
                'formats': []
            }
            
            # Add video formats
            for f in info.get('formats', []):
                if f.get('ext') == 'mp4' or f.get('vcodec') != 'none':
                    result['formats'].append({
                        'url': f.get('url'),
                        'ext': f.get('ext'),
                        'resolution': f.get('resolution', 'Standard Quality'),
                        'filesize': f.get('filesize'),
                        'format_note': f.get('format_note')
                    })
            
            # Simple fallback format
            if not result['formats'] and info.get('url'):
                 result['formats'].append({
                    'url': info.get('url'),
                    'ext': info.get('ext'),
                    'resolution': 'Original Quality'
                })
                
            return result
        except Exception as e:
            return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No URL provided'}))
        sys.exit(1)
        
    url = sys.argv[1]
    result = extract_info(url)
    print(json.dumps(result))
