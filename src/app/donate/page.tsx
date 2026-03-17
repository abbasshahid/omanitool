import { constructMetadata } from '@/lib/seo';
import DonationClient from '@/components/donation/DonationClient';

import { Suspense } from 'react';

export function generateMetadata() {
  return constructMetadata({
    title: 'Support OmniTool - Donate to Help Needy People',
    description: 'OmniTool is free for everyone. Your donations help us maintain the servers and support needy people around the world. Every contribution matters.',
    canonical: '/donate',
  });
}

export default function DonatePage() {
  return (
    <main className="min-h-screen pb-20">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <DonationClient />
      </Suspense>
    </main>
  );
}
