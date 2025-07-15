import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getHooks } from "@/lib/get-hooks";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Anchor } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { CaterogyButton } from "@/components/category-button";
import { Badge } from "@workspace/ui/components/badge";

export const metadata: Metadata = {
  title: "useHooks - React Hooks Library",
  description:
    "Collection of modern, server-safe React hooks for your next project",
};

export default async function HomePage() {
  const hooks = await getHooks();

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="min-h-screen container mx-auto p-4 md:px-0">
        <div className="flex items-center gap-2 justify-center mt-20 animate-in fade-in-0 slide-in-from-top-4 duration-1000 w-full ">
          <Anchor className="w-10 h-10 md:w-20 md:h-20" />
          <span className="text-3xl md:text-8xl font-black tracking-tighter animate-in fade-in-0 duration-1000 w-fit">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              use<span className="font-light italic">Hooks.</span>io
            </span>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-20 md:py-60 text-center">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tighter animate-in fade-in-0 duration-1000">
            Modern React Hooks
          </h1>
          <p className="mt-4 text-xl text-muted-foreground animate-in fade-in-0 duration-1000">
            A collection of modern, server-safe React hooks with zero
            dependencies - install with our CLI tool
          </p>
          <div className="mt-8 flex gap-4 animate-in fade-in-0 duration-1000">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 md:py-60 text-center">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tighter animate-in fade-in-0 duration-1000">
            Install Hooks via CLI
          </h1>
          <p className="mt-4 text-xl text-muted-foreground animate-in fade-in-0 duration-1000">
            Get started with a single command
            <code className="block mt-4 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              npx usehooks-cli@latest init
            </code>
            <code className="block mt-4 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              npx usehooks-cli@latest add use-array
            </code>
          </p>
        </div>

        <div className="grid gap-8 py-62 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          <div className="rounded-lg border p-6 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-6">
            <h3 className="text-xl font-semibold">Server-Safe</h3>
            <p className="mt-2 text-muted-foreground">
              All hooks are built with React Server Components in mind and work
              seamlessly in modern React applications.
            </p>
          </div>
          <div className="rounded-lg border p-6 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-6">
            <h3 className="text-xl font-semibold">TypeScript First</h3>
            <p className="mt-2 text-muted-foreground">
              Written in TypeScript with complete type definitions for the best
              developer experience.
            </p>
          </div>
          <div className="rounded-lg border p-6 transition-all duration-200 animate-in fade-in-0 slide-in-from-right-6">
            <h3 className="text-xl font-semibold">Open Source</h3>
            <p className="mt-2 text-muted-foreground">
              Free and open source under the MIT license. Contributions are
              welcome!
            </p>
          </div>
          <div className="rounded-lg border p-6 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-6 delay-200">
            <h3 className="text-xl font-semibold">Performance Optimized</h3>
            <p className="mt-2 text-muted-foreground">
              Lightweight and efficient hooks designed for optimal performance
              without compromising functionality.
            </p>
          </div>
          <div className="rounded-lg border p-6 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-6 delay-300">
            <h3 className="text-xl font-semibold">Well Documented</h3>
            <p className="mt-2 text-muted-foreground">
              Comprehensive documentation with examples, use cases, and best
              practices for every hook.
            </p>
          </div>
          <div className="rounded-lg border p-6 transition-all duration-300 animate-in fade-in-0 slide-in-from-right-6 delay-400">
            <h3 className="text-xl font-semibold">Community Driven</h3>
            <p className="mt-2 text-muted-foreground">
              Built by developers, for developers. Join our growing community
              and help shape the future of React hooks.
            </p>
          </div>
        </div>

        <div className="pt-32">
          <h2 className="text-3xl font-bold mb-8 text-center animate-in fade-in-0 duration-1000">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from(new Set(hooks.map((hook) => hook.category))).map(
              (category, index) => (
                <CaterogyButton
                  key={category}
                  category={category}
                  index={index}
                  hooks={hooks}
                />
              )
            )}
          </div>
        </div>

        {Array.from(new Set(hooks.map((hook) => hook.category))).map(
          (category) => (
            <div key={category} id={category}>
              <h3 className="text-2xl font-bold mt-16 mb-8 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hooks
                  .filter((hook) => hook.category === category)
                  .map((hook, index) => (
                    <div
                      className="transition-all duration-200 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 cursor-pointer bg-accent p-4 rounded-lg h-58 flex justify-between flex-col"
                      style={{
                        animationDelay: `${2100 + index * 100}ms`,
                      }}
                      key={hook.name}
                    >
                      <Link
                        href={`/docs/${hook.name}`}
                        className="block transition-colors duration-200 hover:text-primary"
                      >
                        <h1 className="text-3xl font-bold mb-2 transition-colors duration-200">
                          {hook.title}
                        </h1>
                      </Link>

                      <div className="mb-4">
                        <p className="text-lg">{hook.description}</p>
                      </div>

                      <Badge variant="default">{hook.category}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )
        )}

        <Separator
          className="my-10 animate-in fade-in-0 duration-1000"
          style={{ animationDelay: `${2500 + hooks.length * 100}ms` }}
        />

        <div
          className="flex items-center gap-2 justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
          style={{ animationDelay: `${2700 + hooks.length * 100}ms` }}
        >
          <Anchor className="w-10 h-10" />
          <span className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            use<span className="font-light italic">Hooks.</span>io
          </span>
        </div>

        <div
          className="py-20 text-center animate-in fade-in-0 slide-in-from-bottom-6 duration-1000"
          style={{ animationDelay: `${2900 + hooks.length * 100}ms` }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Open Source and Free Forever
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            useHooks is open source and available under the MIT license. Feel
            free to use these hooks in your projects, contribute to the library,
            or share with the community.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link
                href="https://github.com/small-lab-io/usehooks.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
