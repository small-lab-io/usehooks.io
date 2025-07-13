import path from "path";
import fs from "fs-extra";

export function detectProjectStructure(cwd: string) {
  const hasNextConfig =
    fs.existsSync(path.join(cwd, "next.config.js")) ||
    fs.existsSync(path.join(cwd, "next.config.mjs"));
  const hasSrcFolder = fs.existsSync(path.join(cwd, "src"));
  const hasAppFolder =
    fs.existsSync(path.join(cwd, "app")) ||
    fs.existsSync(path.join(cwd, "src/app"));

  return {
    framework: hasNextConfig ? "nextjs" : "react",
    structure: hasSrcFolder ? "src" : "root",
    router: hasAppFolder ? "app" : "pages",
  };
}
