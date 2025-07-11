import { ImageResponse } from "next/og";

export const alt = "useHooks Documentation";
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
          fontSize: 48,
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
        <div style={{ marginBottom: 20 }}>useHooks.io</div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>Documentation</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
