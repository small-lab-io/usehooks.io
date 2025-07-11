import { useFetch } from "@/hooks/use-fetch";

export type HookMeta = {
  name: string;
  description: string;
  category: string;
  examples: [{ name: string; description: string }];
};

const hooksUrl =
  "https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src/index.json";

export async function getHooks(): Promise<HookMeta[]> {
  try {
    return await useFetch<HookMeta[]>(hooksUrl);
  } catch (error) {
    console.error("Error fetching hooks:", error);
    return [];
  }
}
