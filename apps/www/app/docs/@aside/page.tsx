"use client";

import Script from "next/script";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";

export default function DocsAside() {
  return (
    <aside className="sticky top-16 w-64 hidden lg:block p-2">
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="mb-2">Install any hook with:</p>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
              npx usehooks-cli@latest add [hook-name]
            </code>
          </div>

          <div className="text-sm">
            <p className="mb-2">Or install all hooks:</p>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
              npm install @workspace/hooks
            </code>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: 240, height: 400 }}
          data-ad-client="ca-pub-1640905025052378"
          data-ad-slot="9540285659"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>

        <Script
          id="adsense-docs-aside"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
          }}
        />
      </div>
    </aside>
  );
}
