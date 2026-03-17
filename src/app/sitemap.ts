import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/toolsConfig';

const SITE_URL = "https://omanitool.vercel.app";
const LAST_MODIFIED = "2024-03-24T00:00:00.000Z";

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
    lastModified: LAST_MODIFIED,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 2. Tool Routes
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
