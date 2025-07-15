import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "useHooks",
    short_name: "useHooks",
    description:
      "A collection of modern React Hooks ready to use in your projects",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    orientation: "natural",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
