import { useFetch } from "@/hooks/use-fetch";

export async function getHookSource(name: string): Promise<string> {
  const sourceUrl = `https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src/${name}/index.ts`;

  try {
    return await useFetch<string>(sourceUrl);
  } catch (error) {
    console.error(`Error fetching hook source: ${error}`);
    return "Source code not available";
  }
}
