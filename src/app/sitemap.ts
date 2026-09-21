import type { MetadataRoute } from 'next';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { SITE_URL } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
      { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
      { url: `${SITE_URL}/donate`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    ] as const
  ).map((entry) => ({ ...entry, lastModified: now }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/tools/category/${category.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    postRoutes = getAllPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'yearly',
      priority: 0.5,
    }));
  } catch {
    // The blog directory is optional; an empty list is a fine sitemap.
  }

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...postRoutes];
}
