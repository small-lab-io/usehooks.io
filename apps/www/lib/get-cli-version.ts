import { useGet } from "@/hooks/use-fetch";

export async function getCliVersion(): Promise<string> {
  try {
    const data = await useGet(
      "https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/usehooks-cli/package.json"
    );

    return data.version || "unknown";
  } catch (error) {
    console.error("Error reading CLI version:", error);
    return "unknown";
  }
}
