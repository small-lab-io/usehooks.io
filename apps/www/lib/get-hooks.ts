import { useFetch as fetchData } from "@/hooks/use-fetch";
import { HookMeta } from "./types";

const hooksUrl =
  "https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src/index.json";

export async function getHooks(): Promise<HookMeta[]> {
  try {
    return await fetchData<HookMeta[]>(hooksUrl);
  } catch (error) {
    console.error("Error fetching hooks:", error);
    return [];
  }
}
