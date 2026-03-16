import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import AdSenseBanner from '@/components/ads/AdSenseBanner';
import type { Metadata, ResolvingMetadata } from 'next';

// Generate dynamic metadata for SEO including Open Graph tags
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) { return { title: 'Post Not Found' }; }

  return {
    title: `${post.title} | OmniTool Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

// Generate static routes at build time for high performance
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Generate highly structured JSON-LD data for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.coverImage],
    datePublished: post.date,
    dateModified: post.date,
    author: [{
      '@type': 'Organization',
      name: post.author,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'OmniTool',
      logo: {
        '@type': 'ImageObject',
        url: 'https://omnitool.vercel.app/logo.png'
      }
    },
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto max-w-4xl px-4 xl:px-8 py-10 md:py-16">
        
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <article>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--color-text-muted)] border-b border-[var(--color-border-base)] pb-8">
              <span className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white"><User className="w-4 h-4" /></div>
                 {post.author}
              </span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          <figure className="mb-12 w-full h-[300px] md:h-[450px] relative rounded-2xl overflow-hidden border border-[var(--color-border-base)]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </figure>

          {/* AdSense Top of Content */}
          <div className="mb-10 text-center float-right ml-8 mb-4 max-w-[300px]">
             <AdSenseBanner dataAdSlot="BLOG_POST_INLINE" className="w-[300px] h-[250px] bg-slate-900/30 rounded-xl" />
          </div>

          <div 
             className="prose prose-lg dark:prose-invert prose-indigo max-w-none 
                        prose-headings:font-bold prose-headings:text-[var(--color-text-main)] 
                        prose-p:text-[var(--color-text-muted)] prose-a:text-indigo-500 hover:prose-a:text-indigo-400
                        prose-img:rounded-xl prose-img:border prose-img:border-[var(--color-border-base)]"
             dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* AdSense Bottom of Content */}
          <div className="mt-16 pt-10 border-t border-[var(--color-border-base)] text-center">
             <AdSenseBanner dataAdSlot="BLOG_POST_BOTTOM" className="h-[90px] w-full max-w-[728px] mx-auto bg-slate-900/30 rounded-xl" />
          </div>

        </article>
      </div>
    </>
  );
}
