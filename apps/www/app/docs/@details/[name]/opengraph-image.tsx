import { getHooks } from "@/lib/get-hooks";
import { ImageResponse } from "next/og";

export const alt = "useHooks Documentation";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const hooks = await getHooks();
  const hook = hooks.find((h) => h.name === name);

  const title = hook
    ? `use${hook.name.charAt(0).toUpperCase() + hook.name.slice(1)}`
    : "useHooks";
  const description = hook?.description || "React Hook Documentation";

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
          padding: 40,
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: 20, fontSize: 56 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.9, maxWidth: "80%" }}>
          {description}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 20 }}>
          useHooks.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
