import { cn } from "@workspace/ui/lib/utils";
import { Separator } from "@workspace/ui/components/separator";

function Callout({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/50 p-4 rounded-r-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Terminal({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono",
        className
      )}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

export default function CliPage() {
  return (
    <div className="pb-20 space-y-10 px-20 max-w-4xl">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">CLI</h1>
        <p className="text-xl text-muted-foreground">
          Use the usehooks CLI to add hooks to your project.
        </p>
      </div>

      <Callout>
        <p className="text-sm">
          <strong>Note:</strong> The CLI is currently in development. Make sure
          you have Node.js 16.0 or higher installed.
        </p>
      </Callout>

      <Separator />

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">init</h2>
          <p className="text-muted-foreground">
            Use the init command to initialize configuration and dependencies
            for a new project.
          </p>
          <p className="text-sm text-muted-foreground">
            The init command installs dependencies, adds the cn util, and
            configures your project.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Usage</h3>
          <Terminal>npx usehooks-cli@latest init [options]</Terminal>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Options</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -y, --yes
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Skip confirmation prompt. (default: false)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -f, --force
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Force overwrite of existing configuration. (default: false)
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
                -s, --silent
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Mute output. (default: false)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -h, --help
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Display help for command
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">add</h2>
          <p className="text-muted-foreground">
            Use the add command to add hooks and dependencies to your project.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Usage</h3>
          <Terminal>npx usehooks-cli@latest add [options] [hooks...]</Terminal>
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
                Skip confirmation prompt. (default: false)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -o, --overwrite
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Overwrite existing files. (default: false)
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
                -a, --all
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Add all available hooks (default: false)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -p, --path &lt;path&gt;
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                The path to add the hook to.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -s, --silent
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Mute output. (default: false)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-mono text-blue-600 dark:text-blue-400">
                -h, --help
              </div>
              <div className="md:col-span-2 text-muted-foreground">
                Display help for command
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
              Add a specific hook to your project, for example useLocalStorage.
            </p>
            <Terminal>npx usehooks-cli@latest add useLocalStorage</Terminal>
          </Step>

          <Step title="Add multiple hooks">
            <p className="text-sm text-muted-foreground mb-3">
              You can add multiple hooks at once by specifying them as
              arguments.
            </p>
            <Terminal>
              npx usehooks-cli@latest add useLocalStorage useDebounce useToggle
            </Terminal>
          </Step>

          <Step title="Add all hooks">
            <p className="text-sm text-muted-foreground mb-3">
              Add all available hooks to your project with the --all flag.
            </p>
            <Terminal>npx usehooks-cli@latest add --all</Terminal>
          </Step>
        </Steps>
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Installation
          </h2>
          <p className="text-muted-foreground">
            The CLI is available as an npm package and can be used with npx.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Global Installation</h3>
          <Terminal>npm install -g usehooks-cli</Terminal>
          <p className="text-sm text-muted-foreground">
            After global installation, you can use the CLI directly:
          </p>
          <Terminal>usehooks-cli add useLocalStorage</Terminal>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Using npx (Recommended)</h3>
          <Terminal>npx usehooks-cli@latest add useLocalStorage</Terminal>
          <p className="text-sm text-muted-foreground">
            Using npx ensures you always use the latest version without global
            installation.
          </p>
        </div>
      </section>

      <Callout>
        <div className="space-y-2">
          <p className="text-sm font-medium">Need help?</p>
          <p className="text-sm text-muted-foreground">
            Run any command with the{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">--help</code>{" "}
            flag to see detailed usage information.
          </p>
        </div>
      </Callout>
    </div>
  );
}
