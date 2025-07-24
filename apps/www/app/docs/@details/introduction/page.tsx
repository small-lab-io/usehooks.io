import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredData } from "@/components/structured-data";
import { Terminal } from "@/components/terminal";
import { Callout } from "@/components/callout";

export default function IntroductionPage() {
  return (
    <>
      <StructuredData type="website" />
      <div className="pb-10 sm:pb-20 px-4 sm:px-20 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: "Introduction" },
          ]}
        />

        <div className="space-y-4">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Introduction
          </h1>
          <p className="text-xl text-muted-foreground">
            This is not a hook library. It's how you build your hook library.
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-lg leading-7">
            You know how most traditional hook libraries work: you install a
            package from NPM, import the hooks, and use them in your app.
          </p>
          <p className="text-lg leading-7">
            This approach works well until you need to customize a hook to fit
            your specific needs or require one that isn't included in the
            library. Often, you end up wrapping library hooks, writing
            workarounds, or mixing hooks from different libraries with
            incompatible APIs.
          </p>
          <p className="text-lg leading-7">
            This is what <strong>useHooks.io</strong> aims to solve. It is built
            around the following principles:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">🔓 Open Code</h3>
            <p className="text-sm text-muted-foreground">
              The top layer of your hook code is open for modification.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">🧩 Composition</h3>
            <p className="text-sm text-muted-foreground">
              Every hook uses a common, composable interface, making them
              predictable.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">📦 Distribution</h3>
            <p className="text-sm text-muted-foreground">
              A flat-file schema and command-line tool make it easy to
              distribute hooks.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">🎨 Beautiful Defaults</h3>
            <p className="text-sm text-muted-foreground">
              Carefully chosen default implementations, so you get great
              functionality out-of-the-box.
            </p>
          </div>
        </div>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Open Code</h2>
            <p className="text-muted-foreground">
              useHooks.io hands you the actual hook code. You have full control
              to customize and extend the hooks to your needs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Full Transparency</h4>
              <p className="text-sm text-muted-foreground">
                You see exactly how each hook is built.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Easy Customization</h4>
              <p className="text-sm text-muted-foreground">
                Modify any part of a hook to fit your design and functionality
                requirements.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">AI Integration</h4>
              <p className="text-sm text-muted-foreground">
                Access to the code makes it straightforward for LLMs to read,
                understand, and even improve your hooks.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            In a typical library, if you need to change a hook's behavior, you
            have to override implementations or wrap the hook. With useHooks.io,
            you simply edit the hook code directly.
          </p>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              Hook Collection
            </h2>
            <p className="text-muted-foreground">
              A comprehensive collection of 28 production-ready React hooks
              organized by category.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">
                State Management
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useArray</div>
                <div>useCounter</div>
                <div>useLocalStorage</div>
                <div>useSet</div>
                <div>useToggle</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600 dark:text-green-400">
                Sensors & Device
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useAudioRecorder</div>
                <div>useBarcodeDetector</div>
                <div>useDeviceOrientation</div>
                <div>useGeolocation</div>
                <div>useHover</div>
                <div>useNetworkInformation</div>
                <div>useUserMedia</div>
                <div>useVibration</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600 dark:text-purple-400">
                Browser APIs
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useBluetooth</div>
                <div>useContactPicker</div>
                <div>useFullscreen</div>
                <div>useStorage</div>
                <div>useWebShare</div>
                <div>useWindowSize</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600 dark:text-orange-400">
                Utilities
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useDebounce</div>
                <div>useIsMounted</div>
                <div>usePrevious</div>
                <div>useThrottle</div>
                <div>useTimeout</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-red-600 dark:text-red-400">
                Lifecycle
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useDeepCompareEffect</div>
                <div>useUpdateEffect</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400">
                Network & Auth
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>useFetch</div>
                <div>useRoleGuard</div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              Getting Started
            </h2>
            <p className="text-muted-foreground">
              Get started by initializing your project with the useHooks CLI.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Initialize your project</h4>
              <Terminal>npx usehooks-cli@latest init</Terminal>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Add hooks to your project</h4>
              <Terminal>npx usehooks-cli@latest add use-counter</Terminal>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. List all available hooks</h4>
              <Terminal>npx usehooks-cli@latest list</Terminal>
            </div>
          </div>

          <Callout>
            <p className="text-sm">
              <strong>Note:</strong> The CLI is inspired by shadcn/ui's
              component workflow, making it easy to add and manage hooks in your
              React applications.
            </p>
          </Callout>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              CLI Features
            </h2>
            <p className="text-muted-foreground">
              The useHooks CLI provides a seamless workflow for managing React
              hooks.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">🚀 Quick Installation</h4>
              <p className="text-sm text-muted-foreground">
                Add hooks to your project with a single command.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">📦 Curated Collection</h4>
              <p className="text-sm text-muted-foreground">
                Production-ready hooks tested and optimized for real-world use.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔧 Simple Commands</h4>
              <p className="text-sm text-muted-foreground">
                Intuitive CLI interface with init, add, and list commands.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">⚡️ Zero Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Works out of the box with sensible defaults.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-6 justify-between">
          <Button variant="outline" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/cli">CLI</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
