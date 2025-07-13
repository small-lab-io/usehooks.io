import fs from "fs/promises";
import path from "path";

export async function getCliVersion(): Promise<string> {
  try {
    const packageJsonPath = path.join(
      process.cwd(),
      `https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/usehooks-cli/package.json`
    );
    const packageJson = await fs.readFile(packageJsonPath, "utf8");
    const parsed = JSON.parse(packageJson);
    return parsed.version || "unknown";
  } catch (error) {
    console.error("Error reading CLI version:", error);
    return "unknown";
  }
}
