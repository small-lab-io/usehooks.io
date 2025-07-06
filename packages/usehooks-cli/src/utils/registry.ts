import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface HookMeta {
  name: string;
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

export interface Hook extends HookMeta {
  files: {
    name: string;
    content: string;
    type: "hook" | "example" | "test";
  }[];
}

// Path to the hooks package
const HOOKS_PACKAGE_PATH = path.resolve(__dirname, "../../../hooks/src");

// Remote registry URL (you can host this on GitHub, your website, etc.)
const HOOKS_REGISTRY_URL =
  "https://github.com/small-lab-io/usehooks.io/tree/main/packages/hooks/src";

export async function getHook(name: string): Promise<Hook | null> {
  try {
    // Fetch metadata from remote
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

export async function getAllHooks(): Promise<HookMeta[]> {
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

export async function getHooksByCategory(): Promise<
  Record<string, HookMeta[]>
> {
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
