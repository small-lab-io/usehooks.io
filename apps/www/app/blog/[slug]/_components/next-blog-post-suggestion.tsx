import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { compareAsc } from "date-fns";

export function NextBlogPostSuggestion({
  currentPostSlug,
}: {
  currentPostSlug: string;
}) {
  // Sort posts by date (newest first)
  const sortedPosts = allPosts.sort((a, b) =>
    compareAsc(new Date(b.date), new Date(a.date))
  );

  // Find current post index
  const currentPostIndex = sortedPosts.findIndex(
    (post) => post.slug === currentPostSlug
  );

  // Get next post (or first post if current is last)
  const nextPost =
    currentPostIndex < sortedPosts.length - 1
      ? sortedPosts[currentPostIndex + 1]
      : currentPostIndex === sortedPosts.length - 1
        ? sortedPosts[0]
        : null;

  if (!nextPost) return null;

  return (
    <Link href={nextPost.url} className="block group">
      <article className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex flex-col space-y-2">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {nextPost.formattedDate}
          </time>
          <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {nextPost.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {nextPost.description}
          </p>
          {nextPost.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {nextPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
