import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/toolsConfig';

const SITE_URL = 'https://omanitool.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}