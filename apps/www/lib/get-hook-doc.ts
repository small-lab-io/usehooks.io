import { useFetch as fetchData } from "@/hooks/use-fetch";
import { HookDoc } from "./types";

export async function getHookDoc(name: string): Promise<HookDoc | null> {
  const docUrl = `https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src/${name}/doc.json`;

  try {
    return await fetchData<HookDoc>(docUrl);
  } catch (error) {
    console.error(`Error fetching hook doc: ${error}`);
    return null;
  }
}
