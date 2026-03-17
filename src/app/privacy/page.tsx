import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Privacy Policy - OmniTool',
  description: 'Learn how OmniTool handles your data and protects your privacy. We are committed to transparency and security.',
  canonical: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">Privacy Policy</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">Introduction</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            Welcome to OmniTool. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">Data We Collect</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
            We do not require an account to use most of our tools. However, we may collect the following data:
          </p>
          <ul className="list-disc pl-6 text-[var(--color-text-muted)] space-y-2">
            <li><strong>Usage Data:</strong> Information about how you use our website (via Google Analytics & Vercel Analytics).</li>
            <li><strong>Ad Interactions:</strong> Data related to advertisements shown on our platform (via Google AdSense).</li>
            <li><strong>Donation Info:</strong> If you donate, we collect your name and email to process the transaction (via Stripe). We do not store credit card details.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">Cookies</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can manage your cookie preferences through the consent banner on our site.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">Third-Party Services</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
            Our site includes links to third-party services and uses external APIs:
          </p>
          <ul className="list-disc pl-6 text-[var(--color-text-muted)] space-y-2">
            <li><strong>Google AdSense:</strong> To serve advertisements.</li>
            <li><strong>Google Analytics:</strong> To understand site traffic.</li>
            <li><strong>Stripe:</strong> To securely process donations.</li>
            <li><strong>Adobe PDF Services:</strong> For advanced document processing.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
