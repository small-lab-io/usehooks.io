import { Callout } from "@/components/callout";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { Terminal } from "@/components/terminal";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StructuredData } from "@/components/structured-data";
import Link from "next/link";

export default function McpPage() {
  return (
    <>
      <StructuredData type="website" />
      <div className="pb-10 sm:pb-20 px-4 sm:px-20 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { label: "MCP Server" },
          ]}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
              MCP Server
            </h1>
            <Badge asChild variant="outline">
              <>v1.2.0</>
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            A Model Context Protocol server for exploring React hooks from
            usehooks.io with AI assistants.
          </p>
        </div>

        <Callout>
          <p className="text-sm">
            <strong>Note:</strong> Make sure you have Node.js 16.0 or higher
            installed. The MCP server is designed to work with AI assistants
            that support the Model Context Protocol.
          </p>
        </Callout>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            What is the MCP Server?
          </h2>
          <p className="text-lg leading-7">
            The useHooks MCP Server is a specialized tool that allows AI
            assistants to interact with the useHooks.io library. It provides a
            structured way for AI models to search, browse, and retrieve React
            hooks from the useHooks.io collection.
          </p>
          <p className="text-lg leading-7">
            MCP (Model Context Protocol) is a standard for building tools that
            AI assistants can use to access external data and functionality.
            This server implements the MCP standard to make the useHooks.io
            library accessible to AI assistants.
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
          <p className="text-lg leading-7">
            You can install the MCP server globally using npm:
          </p>
          <Terminal>
            <CopyToClipboard text="npm install -g mcp-usehooks" />
            npm install -g mcp-usehooks
          </Terminal>
          <p className="text-lg leading-7">
            Or you can use it directly with npx without installation:
          </p>
          <Terminal>
            <CopyToClipboard text="npx mcp-usehooks" />
            npx mcp-usehooks
          </Terminal>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="text-xl font-bold">Browse Hooks</h3>
              <p>List all available React hooks or filter them by category.</p>
            </div>
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="text-xl font-bold">Search Hooks</h3>
              <p>
                Search hooks by name, title, or description to find exactly what
                you need.
              </p>
            </div>
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="text-xl font-bold">Get Hook Details</h3>
              <p>
                Retrieve full implementation details and examples for any hook.
              </p>
            </div>
            <div className="space-y-3 border rounded-lg p-4">
              <h3 className="text-xl font-bold">Browse Categories</h3>
              <p>Explore hooks organized by functional categories.</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Available Tools</h2>
          <p className="text-lg leading-7">
            The MCP server provides the following tools for AI assistants:
          </p>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold">list_hooks</h3>
              <p className="text-gray-600 mb-2">
                List all available React hooks, optionally filtered by category
              </p>
              <div className="bg-accent p-3 rounded">
                <p className="font-mono text-sm">Parameters:</p>
                <ul className="list-disc list-inside font-mono text-sm ml-4">
                  <li>category (optional): Filter hooks by category</li>
                  <li>
                    format (optional): Output format ("json" or "markdown")
                  </li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold">get_categories</h3>
              <p className="text-gray-600 mb-2">
                Get all available hook categories
              </p>
              <div className="bg-accent p-3 rounded">
                <p className="font-mono text-sm">Parameters:</p>
                <ul className="list-disc list-inside font-mono text-sm ml-4">
                  <li>
                    with_counts (optional): Include hook counts per category
                  </li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold">search_hooks</h3>
              <p className="text-gray-600 mb-2">
                Search hooks by name or description
              </p>
              <div className="bg-accentp-3 rounded">
                <p className="font-mono text-sm">Parameters:</p>
                <ul className="list-disc list-inside font-mono text-sm ml-4">
                  <li>keyword: Search term (minimum 2 characters)</li>
                  <li>
                    format (optional): Output format ("json" or "markdown")
                  </li>
                  <li>category (optional): Filter results by category</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold">get_hook</h3>
              <p className="text-gray-600 mb-2">
                Get full details and implementation of a hook
              </p>
              <div className="bg-accent p-3 rounded">
                <p className="font-mono text-sm">Parameters:</p>
                <ul className="list-disc list-inside font-mono text-sm ml-4">
                  <li>name: Name of the hook to retrieve</li>
                  <li>
                    format (optional): Output format ("json" or "markdown")
                  </li>
                  <li>include_examples (optional): Include usage examples</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Using with AI Assistants
          </h2>
          <p className="text-lg leading-7">
            The useHooks MCP Server is designed to be used with AI assistants
            that support the Model Context Protocol. When running the server, it
            will provide a connection URL that you can use to connect your AI
            assistant.
          </p>
          <p className="text-lg leading-7">
            For example, with Claude AI, you can use the MCP server to help you
            find and implement React hooks in your projects. The AI can search
            for hooks, provide implementation details, and help you understand
            how to use them effectively.
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Contributing</h2>
          <p className="text-lg leading-7">
            The useHooks MCP Server is open source and contributions are
            welcome. You can find the source code in the
            <Link
              href="https://github.com/small-lab-io/usehooks.io"
              className="text-blue-600 hover:underline ml-1"
            >
              GitHub repository
            </Link>
            .
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">npm Package</h2>
          <p className="text-lg leading-7">
            The useHooks MCP Server is available as an npm package. You can find
            the package details, documentation, and installation instructions on
            the
            <Link
              href="https://www.npmjs.com/package/mcp-usehooks"
              className="text-blue-600 hover:underline ml-1"
            >
              npm registry
            </Link>
            . The package is regularly updated with new features and
            improvements.
          </p>
        </div>
      </div>
    </>
  );
}
