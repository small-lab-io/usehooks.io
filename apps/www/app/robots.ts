import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs/*"],
        disallow: ["/private/", "/api/*", "/admin/*", "/*.json$", "/*.xml$"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: "https://usehooks.io/sitemap.xml",
    host: "https://usehooks.io",
  };
}
