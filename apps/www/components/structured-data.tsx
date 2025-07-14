import { HookMeta } from "@/lib/types";

interface StructuredDataProps {
  hook?: HookMeta;
  type: "website" | "article" | "software" | "blog";
  slug?: string;
}

export function StructuredData({ hook, type, slug }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    if (type === "website") {
      return {
        ...baseData,
        "@type": "WebSite",
        name: "useHooks.io",
        description: "Collection of modern, server-safe React hooks",
        url: "https://usehooks.io",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://usehooks.io/docs/{search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      };
    }

    if (type === "article" && hook) {
      return {
        ...baseData,
        "@type": "TechArticle",
        headline: `${hook.title} - React Hook`,
        description: hook.description,
        url: `https://usehooks.io/docs/${hook.name}`,
        author: {
          "@type": "Organization",
          name: "useHooks.io",
        },
        publisher: {
          "@type": "Organization",
          name: "useHooks.io",
          logo: {
            "@type": "ImageObject",
            url: "https://usehooks.io/logo.png",
          },
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://usehooks.io/docs/${hook.name}`,
        },
        about: {
          "@type": "SoftwareApplication",
          name: "React",
          applicationCategory: "DeveloperApplication",
        },
      };
    }

    if (type === "blog" && slug) {
      return {
        ...baseData,
        "@type": "BlogPosting",
        headline: hook?.title || "Blog Post",
        description: hook?.description || "Blog post from useHooks.io",
        url: `https://usehooks.io/blog/${slug}`,
        author: {
          "@type": "Organization",
          name: "useHooks.io",
        },
        publisher: {
          "@type": "Organization",
          name: "useHooks.io",
          logo: {
            "@type": "ImageObject",
            url: "https://usehooks.io/logo.png",
          },
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://usehooks.io/blog/${slug}`,
        },
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
