import type { MetadataRoute } from "next";
import { getHooks } from "@/lib/get-hooks";

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
  ];

  const hookPages: MetadataRoute.Sitemap = hooks.map((hook) => ({
    url: `https://usehooks.io/docs/${hook.name}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...hookPages];
}
