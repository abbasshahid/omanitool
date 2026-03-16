import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | OmniTool',
  description: 'Read the latest guides, tutorials, and news about productivity, document management, and online tools.',
  openGraph: {
    title: 'The OmniTool Blog',
    description: 'Expert advice on PDF management, image conversion, and AI productivity.',
    type: 'website',
  }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto max-w-7xl px-4 xl:px-8 py-10 md:py-16">
      
      <div className="mb-10 text-center">
        <AdSenseBanner dataAdSlot="BLOG_INDEX_TOP" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
      </div>

      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6">
          The OmniTool <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Blog</span>
        </h1>
        <p className="text-xl text-[var(--color-text-muted)]">
          Discover new ways to enhance your workflow, manage documents securely, and leverage AI to save hours of manual work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {posts.map((post) => (
          <article key={post.slug} className="card-container flex flex-col group hover:border-indigo-400 transition-colors">
            <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
               <img 
                 src={post.coverImage} 
                 alt={post.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
            </div>
            <div className="p-6 flex flex-col flex-grow">
               <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-muted)] mb-3">
                 <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                 <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
               </div>
               <Link href={`/blog/${post.slug}`} className="block mb-3">
                 <h2 className="text-xl font-bold text-[var(--color-text-main)] group-hover:text-indigo-500 transition-colors line-clamp-2">
                   {post.title}
                 </h2>
               </Link>
               <p className="text-[var(--color-text-muted)] line-clamp-3 mb-6 text-sm flex-grow">
                 {post.excerpt}
               </p>
               <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-500 mt-auto">
                 Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
