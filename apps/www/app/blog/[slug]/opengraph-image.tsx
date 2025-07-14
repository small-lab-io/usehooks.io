import { ImageResponse } from "next/og";
import { allPosts } from "contentlayer/generated";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 46,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          {post?.title}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
