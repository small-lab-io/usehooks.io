import { Anchor } from "lucide-react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ModeToggle } from "@/components/toogle-theme";
import { GithubIcon } from "@/components/github-icon";
import { Button } from "@workspace/ui/components/button";
import { CommandMenu } from "@/components/command-menu";
import "@workspace/ui/globals.css";
import type { Metadata } from "next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL("https://usehooks.io"),
  title: {
    default: "useHooks - React Hooks Library",
    template: "%s | useHooks",
  },
  description:
    "Collection of modern, server-safe React hooks for your next project",
};

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-hidden`}
      >
        <Providers>
          <>
            <header className="h-16 flex justify-between items-center container mx-auto px-2 md:px-0">
              <Link href="/" className="flex items-center gap-2">
                <Anchor className="w-4 h-4" />
                <span className="text-lg font-black tracking-tighter animate-in fade-in-0 duration-1000 cursor-pointer">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    use<span className="font-light italic">hooks.</span>io
                  </span>
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <CommandMenu />
                </div>
                <ModeToggle />
                <Button asChild variant="ghost">
                  <Link
                    href={"https://github.com/small-lab-io/usehooks.io"}
                    target="_blank"
                  >
                    <GithubIcon />
                  </Link>
                </Button>
              </div>
            </header>
            <main className="flex flex-1 flex-col h-screen">
              {children}
              <Analytics />
            </main>
          </>
        </Providers>
      </body>
    </html>
  );
}
