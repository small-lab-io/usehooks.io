import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

// Define interfaces for hook metadata
interface HookMeta {
  name: string;
  title?: string;
  description: string;
  category?: string;
  dependencies?: string[];
  devDependencies?: string[];
  files: {
    name: string;
    type: "hook" | "example" | "test";
  }[];
  examples?: {
    name: string;
    description: string;
  }[];
}

interface Hook extends HookMeta {
  files: {
    name: string;
    content: string;
    type: "hook" | "example" | "test";
  }[];
}

// Registry URL for fetching hooks
const HOOKS_REGISTRY_URL =
  "https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src";

// Helper functions to fetch hooks from the registry
async function getAllHooks(): Promise<HookMeta[]> {
  try {
    const indexUrl = `${HOOKS_REGISTRY_URL}/index.json`;
    const response = await fetch(indexUrl);

    if (!response.ok) {
      return [];
    }

    const hooks = (await response.json()) as HookMeta[];
    return hooks.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error loading hooks:", error);
    return [];
  }
}

async function getHooksByCategory(): Promise<Record<string, HookMeta[]>> {
  const hooks = await getAllHooks();
  const categories: Record<string, HookMeta[]> = {};

  hooks.forEach((hook) => {
    const category = hook.category || "misc";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(hook);
  });

  return categories;
}

async function getHook(name: string): Promise<Hook | null> {
  try {
    const metaUrl = `${HOOKS_REGISTRY_URL}/${name}/meta.json`;
    const metaResponse = await fetch(metaUrl);

    if (!metaResponse.ok) {
      return null;
    }

    const meta = (await metaResponse.json()) as HookMeta;

    // Fetch hook files
    const files = await Promise.all(
      meta.files.map(async (fileInfo) => {
        const fileUrl = `${HOOKS_REGISTRY_URL}/${name}/${fileInfo.name}`;
        const fileResponse = await fetch(fileUrl);
        const content = await fileResponse.text();

        return {
          name: fileInfo.name,
          content,
          type: fileInfo.type,
        };
      })
    );

    return {
      ...meta,
      files,
    };
  } catch (error) {
    console.error(`Error loading hook ${name}:`, error);
    return null;
  }
}

// Create MCP server
const server = new McpServer({
  name: "UseHooks MCP Server",
  version: "1.0.0",
});

// Tool to list all available hooks
server.tool(
  "list_hooks",
  "List all available React hooks from usehooks.io",
  {
    category: "Optional category to filter hooks by",
  },
  async ({ category }) => {
    try {
      let result;

      if (category) {
        const hooksByCategory = await getHooksByCategory();
        result = hooksByCategory[category] || [];
      } else {
        result = await getAllHooks();
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error listing hooks:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error listing hooks: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool to search for hooks by keyword
server.tool(
  "search_hooks",
  "Search for React hooks by keyword in name or description",
  {
    keyword: "Keyword to search for in hook names and descriptions",
  },
  async ({ keyword }) => {
    try {
      const hooks = await getAllHooks();
      const lowercaseKeyword = keyword.toLowerCase();

      const results = hooks.filter(
        (hook) =>
          hook.name.toLowerCase().includes(lowercaseKeyword) ||
          hook.description.toLowerCase().includes(lowercaseKeyword)
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error searching hooks:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error searching hooks: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool to get detailed information about a specific hook
server.tool(
  "get_hook",
  "Get detailed information about a specific React hook including its implementation",
  {
    name: "Name of the hook to retrieve (e.g., use-counter, use-local-storage)",
  },
  async ({ name }) => {
    try {
      const hook = await getHook(name);

      if (!hook) {
        return {
          content: [
            {
              type: "text",
              text: `Hook '${name}' not found. Please check the name and try again.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(hook, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error retrieving hook ${name}:`, error);
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving hook ${name}: ${error}`,
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
