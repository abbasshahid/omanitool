import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/next';
import GDPRConsent from '@/components/ui/GDPRConsent';
import { themeBootScript } from '@/components/layout/ThemeToggle';
import { consentModeBootScript } from '@/lib/ads/consent';
import AdScript from '@/components/ads/AdScript';
import { constructMetadata } from '@/lib/seo';

/**
 * Archivo carries the headings — an industrial grotesque that holds up at heavy
 * weights. IBM Plex Sans sets the body, and Plex Mono handles anything that is
 * really data: file sizes, tool codes, the uplink meter.
 */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = constructMetadata({
  title: 'OmniTool — 55 free file tools that run in your browser',
  description:
    'Merge PDFs, convert images, format JSON and 50 more tools. Everything runs on your own machine, so your files are never uploaded. Free, no account, no limits.',
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b121b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {/* Consent Mode v2 defaults, set before any Google tag can run. */}
        <script dangerouslySetInnerHTML={{ __html: consentModeBootScript }} />
      </head>
      <body
        className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} flex min-h-screen flex-col`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--signal)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--signal-fg)]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <AdScript />
        <GDPRConsent />
      </body>
    </html>
  );
}
