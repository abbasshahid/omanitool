import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-base)] bg-[var(--color-surface-base)] py-12">
      <div className="container mx-auto max-w-7xl px-4 xl:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">OmniTool</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm max-w-sm mb-6">
              Empowering your workflow with simple, powerful online tools. From image processing to format conversion and AI assistance.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--color-text-main)] mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">All Tools</Link></li>
              <li><Link href="/ai-hub" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">AI Hub</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">API Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--color-text-main)] mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[var(--color-text-muted)] hover:text-indigo-400 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--color-border-base)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-text-muted)] text-sm">
            &copy; {new Date().getFullYear()} OmniTool Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
