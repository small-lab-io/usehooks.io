#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

const HOOKS_REGISTRY_URL =
  "https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src";

// Cache mechanism to improve performance
const cache = {
  hooks: null,
  hooksByCategory: null,
  hookDetails: {},
  lastFetch: 0,
  cacheTTL: 5 * 60 * 1000, // 5 minutes cache TTL
};

/**
 * Get all hooks from the registry
 * @returns {Promise<Array>} Array of all hooks
 */
async function getAllHooks() {
  // Check if we have a valid cache
  const now = Date.now();
  if (cache.hooks && now - cache.lastFetch < cache.cacheTTL) {
    return cache.hooks;
  }

  try {
    const response = await fetch(`${HOOKS_REGISTRY_URL}/index.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch hooks: ${response.status} ${response.statusText}`
      );
    }

    const hooks = await response.json();
    const sortedHooks = hooks.sort((a, b) => a.name.localeCompare(b.name));

    // Update cache
    cache.hooks = sortedHooks;
    cache.lastFetch = now;
    cache.hooksByCategory = null; // Reset category cache

    return sortedHooks;
  } catch (err) {
    console.error("Fetch error:", err);
    // Return cached data if available, otherwise empty array
    return cache.hooks || [];
  }
}

/**
 * Get hooks organized by category
 * @returns {Promise<Object>} Object with categories as keys and arrays of hooks as values
 */
async function getHooksByCategory() {
  // Check if we have a valid cache
  const now = Date.now();
  if (cache.hooksByCategory && now - cache.lastFetch < cache.cacheTTL) {
    return cache.hooksByCategory;
  }

  const hooks = await getAllHooks();
  const hooksByCategory = hooks.reduce((acc, hook) => {
    const category = hook.category || "misc";
    acc[category] = acc[category] || [];
    acc[category].push(hook);
    return acc;
  }, {});

  // Update cache
  cache.hooksByCategory = hooksByCategory;

  return hooksByCategory;
}

/**
 * Get detailed information about a specific hook
 * @param {string} name - The name of the hook
 * @returns {Promise<Object|null>} Hook details or null if not found
 */
async function getHook(name) {
  // Normalize hook name
  const normalizedName = name.toLowerCase().trim();

  // Check if we have a valid cache for this hook
  const now = Date.now();
  if (
    cache.hookDetails[normalizedName] &&
    now - cache.hookDetails[normalizedName].fetchTime < cache.cacheTTL
  ) {
    return cache.hookDetails[normalizedName].data;
  }

  try {
    // First check if the hook exists in our list
    const allHooks = await getAllHooks();
    const hookExists = allHooks.some(
      (h) => h.name.toLowerCase() === normalizedName
    );

    if (!hookExists) {
      console.warn(`Hook '${name}' not found in the registry`);
      return null;
    }

    // Fetch the hook metadata
    const metaUrl = `${HOOKS_REGISTRY_URL}/${normalizedName}/meta.json`;
    const metaRes = await fetch(metaUrl);

    if (!metaRes.ok) {
      throw new Error(
        `Failed to fetch hook metadata: ${metaRes.status} ${metaRes.statusText}`
      );
    }

    const meta = await metaRes.json();

    // Fetch all files for this hook
    const files = await Promise.all(
      meta.files.map(async (f) => {
        const fileUrl = `${HOOKS_REGISTRY_URL}/${normalizedName}/${f.name}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
          throw new Error(
            `Failed to fetch file ${f.name}: ${fileRes.status} ${fileRes.statusText}`
          );
        }

        const content = await fileRes.text();
        return { name: f.name, content, type: f.type };
      })
    );

    // Fetch examples if they exist
    let examples = [];
    if (meta.examples && Array.isArray(meta.examples)) {
      examples = await Promise.all(
        meta.examples.map(async (example) => {
          try {
            const exampleUrl = `${HOOKS_REGISTRY_URL}/${normalizedName}/${example.name}`;
            const exampleRes = await fetch(exampleUrl);

            if (!exampleRes.ok) {
              console.warn(
                `Example ${example.name} not found: ${exampleRes.status}`
              );
              return { ...example, content: null };
            }

            const content = await exampleRes.text();
            return { ...example, content };
          } catch (exampleErr) {
            console.warn(
              `Failed to fetch example ${example.name}:`,
              exampleErr
            );
            return { ...example, content: null };
          }
        })
      );
    }

    // Prepare the complete hook data
    const hookData = { ...meta, files, examples };

    // Update cache
    cache.hookDetails[normalizedName] = {
      data: hookData,
      fetchTime: now,
    };

    return hookData;
  } catch (err) {
    console.error(`Failed to get hook ${name}:`, err);
    return null;
  }
}

/**
 * Format hook list for display
 * @param {Array} hooks - Array of hooks
 * @returns {string} Formatted hook list
 */
function formatHookList(hooks) {
  if (!hooks || hooks.length === 0) {
    return "No hooks found.";
  }

  return hooks
    .map((hook) => {
      return `- **${hook.title}** (${hook.name}): ${hook.description}`;
    })
    .join("\n");
}

// Initialize MCP Server
const server = new McpServer({
  name: "UseHooks MCP Server",
  version: "1.0.0",
});

// list_hooks tool
server.tool(
  "list_hooks",
  "List all available React hooks, optionally filtered by category",
  z.object({
    category: z.string().optional(),
    format: z.enum(["json", "markdown"]).optional().default("markdown"),
  }),
  async ({ category, format }) => {
    try {
      // Get hooks by category if specified, otherwise get all hooks
      let hooks;
      let responseText;

      if (category) {
        const hooksByCategory = await getHooksByCategory();
        hooks = hooksByCategory[category] || [];

        if (hooks.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No hooks found in category '${category}'. Available categories: ${Object.keys(hooksByCategory).join(", ")}`,
              },
            ],
          };
        }
      } else {
        hooks = await getAllHooks();
      }

      // Format the response based on the requested format
      if (format === "json") {
        responseText = JSON.stringify(hooks, null, 2);
      } else {
        // Default to markdown
        const categoryTitle = category
          ? `# Hooks in category: ${category}`
          : "# All React Hooks";
        responseText = `${categoryTitle}\n\n${formatHookList(hooks)}\n\n*Total: ${hooks.length} hooks*`;
      }

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error("Error in list_hooks:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error listing hooks: ${error.message}`,
          },
        ],
      };
    }
  }
);

// get_categories tool
server.tool(
  "get_categories",
  "Get all available hook categories",
  z.object({
    with_counts: z.boolean().optional().default(false),
  }),
  async ({ with_counts }) => {
    try {
      const hooksByCategory = await getHooksByCategory();
      const categories = Object.keys(hooksByCategory).sort();

      if (with_counts) {
        const categoriesWithCounts = categories.map((category) => ({
          name: category,
          count: hooksByCategory[category].length,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(categoriesWithCounts, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(categories, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error in get_categories:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting categories: ${error.message}`,
          },
        ],
      };
    }
  }
);

// search_hooks tool
server.tool(
  "search_hooks",
  "Search hooks by name or description",
  z.object({
    keyword: z.string().min(2),
    format: z.enum(["json", "markdown"]).optional().default("markdown"),
    category: z.string().optional(),
  }),
  async ({ keyword, format, category }) => {
    try {
      const hooks = await getAllHooks();
      const q = keyword.toLowerCase().trim();

      // Filter hooks by keyword and optionally by category
      let results = hooks.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.title.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );

      if (category) {
        results = results.filter((h) => h.category === category);
      }

      // Format the response based on the requested format
      let responseText;
      if (format === "json") {
        responseText = JSON.stringify(results, null, 2);
      } else {
        // Default to markdown
        const searchTitle = `# Search results for: "${keyword}"${category ? ` in category "${category}"` : ""}`;
        responseText = `${searchTitle}\n\n${formatHookList(results)}\n\n*Found: ${results.length} hooks*`;
      }

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error("Error in search_hooks:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error searching hooks: ${error.message}`,
          },
        ],
      };
    }
  }
);

// get_hook tool
server.tool(
  "get_hook",
  "Get full details and implementation of a hook",
  z.object({
    name: z.string().min(2),
    format: z.enum(["json", "markdown"]).optional().default("markdown"),
    include_examples: z.boolean().optional().default(true),
  }),
  async ({ name, format, include_examples }) => {
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

      // Format the response based on the requested format
      let responseText;
      if (format === "json") {
        responseText = JSON.stringify(hook, null, 2);
      } else {
        // Default to markdown
        let markdownContent = `# ${hook.title}
          **Category:** ${hook.category || "misc"}
          **Description:** ${hook.description}
        `;

        // Add dependencies if any
        if (hook.dependencies && hook.dependencies.length > 0) {
          markdownContent += `**Dependencies:** ${hook.dependencies.join(", ")}\n\n`;
        }

        // Add implementation code
        const implementationFile = hook.files.find((f) => f.type === "hook");
        if (implementationFile) {
          markdownContent += `## Implementation\n\n\`\`\`typescript\n${implementationFile.content}\n\`\`\`\n\n`;
        }

        // Add examples if requested
        if (include_examples && hook.examples && hook.examples.length > 0) {
          markdownContent += `## Examples\n\n`;

          hook.examples.forEach((example) => {
            markdownContent += `### ${example.description || example.name}\n\n`;
            if (example.content) {
              markdownContent += `\`\`\`tsx\n${example.content}\n\`\`\`\n\n`;
            } else {
              markdownContent += `*Example content not available*\n\n`;
            }
          });
        }

        responseText = markdownContent;
      }

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error(`Error in get_hook for ${name}:`, error);
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving hook '${name}': ${error.message}`,
          },
        ],
      };
    }
  }
);

// Connect MCP to stdio
const transport = new StdioServerTransport();
server.connect(transport);
