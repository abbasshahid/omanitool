import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION = "Empowering your workflow with simple, powerful online tools. Remove backgrounds, convert formats, and leverage AI instantly.";
const DEFAULT_TITLE = "OmniTool - All-in-One Digital PDF, Image & AI Toolbox";
const SITE_URL = "https://omnitool.com"; // Placeholder, can be updated via env later

export function constructMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = "/",
  ogImage = "/og-image.png",
  noIndex = false,
}: SEOProps = {}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${canonical}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: "OmniTool",
      images: [
        {
          url: ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@omnitool",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    // Favicon and other icons should be handled in layout.tsx or shared here
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export function generateSoftwareSchema(tool: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": "All",
    "applicationCategory": "MultimediaApplication",
    "description": tool.description,
    "url": `${SITE_URL}${tool.path}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };
}
