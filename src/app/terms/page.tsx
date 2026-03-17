import { FileText, Shield, Gavel, Scale } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Terms of Service - OmniTool',
  description: 'Read the terms and conditions for using the OmniTool platform. Understand your rights and responsibilities.',
  canonical: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">Terms of Service</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">1. Acceptance of Terms</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            By accessing or using OmniTool, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">2. Use License</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
            OmniTool provides free online tools for document and image processing. Under this license you may:
          </p>
          <ul className="list-disc pl-6 text-[var(--color-text-muted)] space-y-2">
            <li>Use the tools for personal or commercial productivity purposes.</li>
            <li>Process files and download the results for your own use.</li>
          </ul>
          <p className="text-[var(--color-text-muted)] mt-4">
            You may not: reverse engineer the software, use the tools for any illegal purposes, or attempt to overwhelm our servers with automated requests.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">3. Disclaimer</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            The materials on OmniTool are provided on an 'as is' basis. OmniTool makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">4. Limitations</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            In no event shall OmniTool or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on OmniTool's website.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] m-0">5. Governing Law</h2>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            These terms and conditions are governed by and construed in accordance with international laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>
      </div>
    </div>
  );
}
