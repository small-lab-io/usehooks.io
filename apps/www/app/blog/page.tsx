import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { compareAsc } from "date-fns";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export const metadata: Metadata = {
  title: "Blog - useHooks.io",
  description:
    "Latest updates, tutorials, and insights about React hooks and web development.",
};

export default function BlogPage() {
  const posts = allPosts.sort((a, b) =>
    compareAsc(new Date(b.date), new Date(a.date))
  );

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <StructuredData type="website" />
      <div className="pb-20 space-y-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p
            className="text-lg text-gray-600 dark:text-gray-300 mb-12"
            style={{ animationDelay: "100ms" }}
          >
            Latest updates, tutorials, and insights about React hooks and web
            development.
          </p>

          <div className="space-y-8">
            {posts.map((post, index) => (
              <article
                key={post._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 hover:scale-[1.01] transition-transform"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col space-y-2">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {post.formattedDate}
                  </time>
                  <h2 className="text-2xl font-bold">
                    <Link
                      href={post.url}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.description}
                  </p>
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
                  {post.author && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By {post.author}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
