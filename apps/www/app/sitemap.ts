import { MetadataRoute } from "next";
import { getHooks } from "@/lib/get-hooks";
import { allPosts } from "contentlayer/generated";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hooks = await getHooks();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://usehooks.io",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://usehooks.io/docs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://usehooks.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const hookPages: MetadataRoute.Sitemap = hooks.map((hook) => ({
    url: `https://usehooks.io/docs/${hook.name}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = allPosts.map(
    (post: { url: string; date: string }) => ({
      url: `https://usehooks.io${post.url}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  return [...staticPages, ...hookPages, ...blogPages];
}
