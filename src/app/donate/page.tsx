import { constructMetadata } from '@/lib/seo';
import DonationClient from '@/components/donation/DonationClient';

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
      <DonationClient />
    </main>
  );
}
