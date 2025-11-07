import Script from "next/script";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AdsenseAd } from "@/components/adsense-ad";

export default function HookAside() {
  return (
    <aside className="sticky top-16 min-w-64 hidden lg:block p-2">
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

      <AdsenseAd adSlot="9540285659" className="mt-4" />
    </aside>
  );
}
