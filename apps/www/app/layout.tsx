import { Anchor } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ModeToggle } from "@/components/toogle-theme";
import { GithubIcon } from "@/components/github-icon";
import { Button } from "@workspace/ui/components/button";
import { CommandMenu } from "@/components/command-menu";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Badge } from "@workspace/ui/components/badge";
import { getCliVersion } from "@/lib/get-cli-version";
import { StructuredData } from "@/components/structured-data";
import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/sonner";

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
    default: "useHooks.io - Modern React Hooks Library",
    template: "%s | useHooks.io",
  },
  description:
    "Collection of 28+ modern, server-safe React hooks for your next project. Similar to shadcn/ui but for hooks - no package dependencies, just install the source code you need.",
  keywords: [
    "React hooks",
    "React",
    "TypeScript",
    "JavaScript",
    "Frontend",
    "Web development",
    "Custom hooks",
    "React components",
    "Server-safe hooks",
    "Next.js",
  ],
  authors: [{ name: "useHooks.io Team" }],
  creator: "useHooks.io",
  publisher: "useHooks.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usehooks.io",
    title: "useHooks.io - Modern React Hooks Library",
    description:
      "Collection of 28+ modern, server-safe React hooks for your next project. No package dependencies, just install the source code you need.",
    siteName: "useHooks.io",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "useHooks.io - Modern React Hooks Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "useHooks.io - Modern React Hooks Library",
    description:
      "Collection of 28+ modern, server-safe React hooks for your next project.",
    images: ["/opengraph-image.png"],
    creator: "@usehooksio", // Add your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }: Readonly<LayoutProps>) {
  const cliVersion = await getCliVersion();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData type="website" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-hidden`}
      >
        <SidebarProvider className="flex flex-col h-screen">
          <Providers>
            <header className="h-16 flex justify-between items-center container mx-auto px-4 md:px-0">
              <div className="flex items-center gap-1 md:gap-3">
                <Anchor className="w-4 h-4 hidden md:block" />
                <SidebarTrigger className="md:hidden" />
                <Link href="/">
                  <span className="text-lg font-black tracking-tighter animate-in fade-in-0 duration-1000 cursor-pointer">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      use<span className="font-light italic">Hooks.</span>io
                    </span>
                  </span>
                </Link>
                <Badge asChild variant="outline" className="hidden">
                  <>v{cliVersion}</>
                </Badge>
              </div>
              <div className="flex items-center gap-1 md:gap-3">
                <Link
                  href="/docs"
                  className="hover:underline underline-offset-2"
                >
                  Docs
                </Link>
                <Link
                  href="/blog"
                  className="hover:underline underline-offset-2"
                >
                  Blog
                </Link>
                <div className="hidden sm:block">
                  <CommandMenu />
                </div>
                <ModeToggle />
                <Button
                  asChild
                  variant="secondary"
                  className="hover:dark:bg-slate-700 bg-slate-800"
                >
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
              <Toaster />
            </main>
          </Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
