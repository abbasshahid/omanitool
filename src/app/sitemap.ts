import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/toolsConfig';

const SITE_URL = "https://omnitool.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static Routes
  const staticRoutes = [
    '',
    '/tools/pdf',
    '/tools/document',
    '/ai-hub',
    '/blog',
    '/donate',
    '/tools/media-downloader',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 2. Tool Routes
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Note: Future dynamic blog posts from the filesystem will need to be fetched here too

  return [...staticRoutes, ...toolRoutes];
}
