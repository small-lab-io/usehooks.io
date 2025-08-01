import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MDXRenderer } from "@/components/mdx-renderer";
import { NextBlogPostSuggestion } from "./_components/next-blog-post-suggestion";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${post.title} - useHooks.io Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://usehooks.io/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <StructuredData type="blog" slug={slug} />
      <div className="h-[calc(100vh-64px)] overflow-scroll">
        <div className="pb-20 space-y-10 px-4 sm:px-6 lg:px-8 md:max-w-4xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <article className="md:max-w-4xl mx-auto">
            <header className="mb-8">
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {post.formattedDate}
              </time>
              <h1 className="text-4xl font-bold mt-2 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                {post.description}
              </p>
              {post.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {post.author}
                </p>
              )}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="dark:prose-invert w-full prose-pre:overflow-x-auto ">
              <MDXRenderer code={post.body.code} />
            </div>

            {/* Next Blog Post Suggestion */}
            <div
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 animate-in fade-in-0 duration-700"
              style={{ animationDelay: "300ms" }}
            >
              <h2 className="text-2xl font-bold mb-4">Continue Reading</h2>
              <NextBlogPostSuggestion currentPostSlug={post.slug} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
