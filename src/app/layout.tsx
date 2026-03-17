import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from "@vercel/analytics/next";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'OmniTool - Free All-in-One Online PDF, Image & AI Productivity Tools',
  description: 'Boost your productivity with OmniTool. Free online tools for PDF editing, image conversion, background removal, and AI-powered text generation. No installation required.',
});

export const viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans antialiased`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
