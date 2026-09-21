import type { NextConfig } from 'next';

/**
 * Tools that were removed because they could not be delivered honestly on a
 * free, backend-less deployment. Each one redirects to the closest tool that
 * genuinely works, so inbound links and indexed pages keep their value.
 */
const RETIRED_TOOLS: Record<string, string> = {
  // Needed a paid translation API.
  'translate-pdf': '/tools/category/pdf',
  // PDF/A conformance cannot be verified in the browser.
  'pdf-to-pdfa': '/tools/compress-pdf',
  // Drawing boxes over text leaves the text extractable; a fake redaction is
  // more dangerous than none, so this points at a real removal tool instead.
  'redact-pdf': '/tools/remove-pages',
  // PowerPoint rendering has no viable free client-side path.
  'pdf-to-powerpoint': '/tools/pdf-to-jpg',
  'powerpoint-to-pdf': '/tools/jpg-to-pdf',
  // The AI tools were simulated, not AI.
  'ai-image-generator': '/tools/category/image',
  'ai-text-enhancer': '/tools/category/text',
  'ai-summarizer': '/tools/category/text',
  'ai-code-assistant': '/tools/category/developer',
  // Renamed.
  'format-converter': '/tools/image-converter',
};

const nextConfig: NextConfig = {
  // pdfjs-dist 3.x has a Node-only `require('canvas')` path. We only run pdf.js
  // in the browser, and the native `canvas` package will not build on Vercel,
  // so both bundlers are pointed at an empty module instead.
  turbopack: {
    resolveAlias: {
      canvas: './src/lib/stubs/empty.js',
    },
  },

  webpack(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },

  async redirects() {
    return [
      // Category pages moved under /tools/category/.
      { source: '/tools/pdf', destination: '/tools/category/pdf', permanent: true },
      { source: '/tools/document', destination: '/tools/category/pdf', permanent: true },
      { source: '/ai-hub', destination: '/tools/category/developer', permanent: true },

      ...Object.entries(RETIRED_TOOLS).map(([from, destination]) => ({
        source: `/tools/${from}`,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
