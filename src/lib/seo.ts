import type { Metadata } from 'next';

/**
 * One canonical origin for the whole site. Set NEXT_PUBLIC_SITE_URL in Vercel to
 * the production domain; the fallback matches the current deployment so
 * canonicals and the sitemap can never drift apart again.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://omanitool.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'OmniTool';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'OmniTool — free file, image and text tools that run in your browser';
const DEFAULT_DESCRIPTION =
  'Merge PDFs, convert images, format JSON and more. Every tool runs on your own machine, so your files are never uploaded.';

export function constructMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  ogImage,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const url = `${SITE_URL}${canonical}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      // Omitted on purpose when no override is given: `app/opengraph-image.tsx`
      // generates the card at build time and Next injects it. Pointing at a
      // hand-maintained /og-image.png previously produced a 404 preview.
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: !noIndex, follow: !noIndex },
    // `apple-icon.tsx` supplies the touch icon; only the favicon is a real file.
    icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
  };
}

/**
 * Structured data for a tool page.
 *
 * Deliberately carries no `aggregateRating`. An earlier version claimed 4.8
 * stars from 1,250 ratings for every tool, which was invented — Google treats
 * fabricated review markup as spam, and it is not true.
 */
export function generateSoftwareSchema(tool: {
  name: string;
  description: string;
  path?: string;
  id?: string;
}) {
  const path = tool.path ?? `/tools/${tool.id ?? ''}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/** FAQ markup, generated only from questions actually shown on the page. */
export function generateFaqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
