import { ImageResponse } from "next/og";

export const alt = "Blog - useHooks.io";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
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
        <div style={{ marginBottom: 20 }}>Blog</div>
        <div style={{ fontSize: 32, opacity: 0.9, marginBottom: 16 }}>
          Latest updates, tutorials, and insights
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>
          React hooks and web development
        </div>
        <div style={{ fontSize: 18, opacity: 0.7, marginTop: 20 }}>
          useHooks.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
