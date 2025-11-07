import Script from "next/script";
import type { CSSProperties } from "react";

type AdsenseAdProps = {
  adSlot: string;
  adClient?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: CSSProperties;
  scriptId?: string;
};

export function AdsenseAd({
  adSlot,
  adClient = process.env.NEXT_PUBLIC_AD_CLIENT_ID,
  adFormat = "auto",
  fullWidthResponsive = true,
  className,
  style = { display: "block" },
  scriptId,
}: AdsenseAdProps) {
  // If client ID is missing, avoid rendering to prevent runtime errors
  if (!adClient) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />

      <Script
        id={scriptId ?? `adsense-${adSlot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  );
}