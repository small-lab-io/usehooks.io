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
import "@workspace/ui/globals.css";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";

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
    default: "useHooks.io - React Hooks Library",
    template: "%s | useHooks.io",
  },
  description:
    "Collection of modern, server-safe Rea<SidebarTrigger />ct hooks for your next project. Similar to shadcn/ui but for hooks - no package dependencies, just install the source code you need.",
};

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-hidden`}
      >
        <SidebarProvider className="flex flex-col h-screen">
          <Providers>
            <header className="h-16 flex justify-between items-center container mx-auto px-2 md:px-0">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 hidden md:block" />
                <SidebarTrigger className="md:hidden" />
                <Link href="/">
                  <span className="text-lg font-black tracking-tighter animate-in fade-in-0 duration-1000 cursor-pointer">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      use<span className="font-light italic">Hooks.</span>io
                    </span>
                  </span>
                </Link>
              </div>
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
          </Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
