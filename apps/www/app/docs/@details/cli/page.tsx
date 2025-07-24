import { Steps, Step } from "@/components/steps";
import { Callout } from "@/components/callout";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { Terminal } from "@/components/terminal";
import { getCliVersion } from "@/lib/get-cli-version";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredData } from "@/components/structured-data";

export default async function CliPage() {
  const cliVersion = await getCliVersion();

  return (
    <>
      <StructuredData type="website" />
      <div className="pb-10 sm:pb-20 px-4 sm:px-20 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: "CLI" },
          ]}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              CLI
            </h1>
            <Badge asChild variant="outline">
              <>v{cliVersion}</>
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            A powerful command-line interface tool for seamlessly integrating
            React hooks into your projects.
          </p>
        </div>

        <Callout>
          <p className="text-sm">
            <strong>Note:</strong> Make sure you have Node.js 18.0 or higher
            installed. No installation required - use npx to run the CLI
            directly.
          </p>
        </Callout>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">init</h2>
            <p className="text-muted-foreground">
              Initialize usehooks configuration in your project with smart
              project detection.
            </p>
            <p className="text-sm text-muted-foreground">
              The init command detects your project structure, installs
              dependencies, adds utility functions, and configures your project.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest init</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest init"
                className="absolute top-0 right-0"
              />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">add</h2>
            <p className="text-muted-foreground">
              Add hooks and their dependencies to your project.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest add [hooks...]</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest add "
                className="absolute top-0 right-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Arguments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  hooks
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Name of the hook(s) to add
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -y, --yes
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Skip confirmation prompt
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -o, --overwrite
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Overwrite existing files
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -c, --cwd &lt;cwd&gt;
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  The working directory. Defaults to the current directory.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -p, --path &lt;path&gt;
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  The path to add the hook to
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">update</h2>
            <p className="text-muted-foreground">
              Update hooks to their latest versions with automatic backup
              creation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest update [hooks...]</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest update "
                className="absolute top-0 right-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Arguments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  hooks
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Name of the hook(s) to update
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -a, --all
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Update all installed hooks
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -y, --yes
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Skip confirmation prompt
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -c, --cwd &lt;cwd&gt;
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  The working directory. Defaults to the current directory.
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">remove</h2>
            <p className="text-muted-foreground">
              Remove hooks from your project with smart dependency cleanup.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest remove [hooks...]</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest remove "
                className="absolute top-0 right-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Arguments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  hooks
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Name of the hook(s) to remove
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -y, --yes
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Skip confirmation prompt
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -c, --cwd &lt;cwd&gt;
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  The working directory. Defaults to the current directory.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  --clean-deps
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Remove unused dependencies
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">list</h2>
            <p className="text-muted-foreground">
              View all available hooks in the registry, organized by category.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest list</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest list"
                className="absolute top-0 right-0"
              />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">search</h2>
            <p className="text-muted-foreground">
              Search for hooks by name, description, or category with fuzzy
              matching.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>npx usehooks-cli@latest search &lt;query&gt;</Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest search "
                className="absolute top-0 right-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Arguments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  query
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Search query (required)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -c, --category &lt;category&gt;
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Filter by specific category
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -i, --interactive
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Interactive search mode
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -a, --add
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Add selected hook after search
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">info</h2>
            <p className="text-muted-foreground">
              Get detailed information about a specific hook including examples,
              dependencies, and methods.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Usage</h3>
            <div className="relative">
              <Terminal>
                npx usehooks-cli@latest info &lt;hook-name&gt;
              </Terminal>
              <CopyToClipboard
                text="npx usehooks-cli@latest info "
                className="absolute top-0 right-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Arguments</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  hook-name
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Name of the hook (required)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -e, --examples
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Show only examples
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -d, --dependencies
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Show only dependencies
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="font-mono text-blue-600 dark:text-blue-400">
                  -m, --methods
                </div>
                <div className="md:col-span-2 text-muted-foreground">
                  Show only methods
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
            <p className="text-muted-foreground">
              Here are some common usage examples for the usehooks CLI.
            </p>
          </div>

          <Steps>
            <Step title="Initialize a new project">
              <p className="text-sm text-muted-foreground mb-3">
                Start by initializing your project with the usehooks CLI
                configuration.
              </p>
              <Terminal>npx usehooks-cli@latest init</Terminal>
            </Step>

            <Step title="Add a specific hook">
              <p className="text-sm text-muted-foreground mb-3">
                Add a specific hook to your project, for example use-counter.
              </p>
              <Terminal>npx usehooks-cli@latest add use-counter</Terminal>
            </Step>

            <Step title="Add multiple hooks">
              <p className="text-sm text-muted-foreground mb-3">
                You can add multiple hooks at once by specifying them as
                arguments.
              </p>
              <Terminal>
                npx usehooks-cli@latest add use-counter use-fetch use-toggle
              </Terminal>
            </Step>

            <Step title="Search for hooks">
              <p className="text-sm text-muted-foreground mb-3">
                Search for hooks by keyword with interactive selection.
              </p>
              <Terminal>
                npx usehooks-cli@latest search "fetch" --interactive --add
              </Terminal>
            </Step>

            <Step title="Update all hooks">
              <p className="text-sm text-muted-foreground mb-3">
                Keep your hooks up-to-date with the latest versions.
              </p>
              <Terminal>npx usehooks-cli@latest update --all</Terminal>
            </Step>

            <Step title="Get hook information">
              <p className="text-sm text-muted-foreground mb-3">
                Get detailed information about a hook before adding it.
              </p>
              <Terminal>npx usehooks-cli@latest info use-fetch</Terminal>
            </Step>
          </Steps>
        </section>

        <Separator />

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
            <p className="text-muted-foreground">
              The usehooks CLI comes with powerful features to enhance your
              development workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">🚀 Quick Installation</h3>
              <p className="text-sm text-muted-foreground">
                Add hooks to your project with a single command
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">🔍 Smart Search</h3>
              <p className="text-sm text-muted-foreground">
                Find hooks by name, description, or category with fuzzy matching
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">🔄 Update Management</h3>
              <p className="text-sm text-muted-foreground">
                Keep your hooks up-to-date with automatic backup creation
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">🗑️ Clean Removal</h3>
              <p className="text-sm text-muted-foreground">
                Remove hooks and their dependencies safely
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">⚡️ Zero Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Works out of the box with smart project detection
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">🛡️ Type Safe</h3>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with proper type definitions
              </p>
            </div>
          </div>
        </section>

        <Callout>
          <div className="space-y-2">
            <p className="text-sm font-medium">Need help?</p>
            <p className="text-sm text-muted-foreground">
              Run any command with the{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                --help
              </code>{" "}
              flag to see detailed usage information, or visit the{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                npx usehooks-cli@latest list
              </code>{" "}
              command to see all available hooks.
            </p>
          </div>
        </Callout>
      </div>
    </>
  );
}
