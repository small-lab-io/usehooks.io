import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import prompts from "prompts";
import { saveConfig, type Config } from "../utils/config";
import { detectProjectStructure } from "../utils/project-detector";

interface ProjectInfo {
  framework: string;
  structure: string;
  router: string;
  hasTypeScript: boolean;
  hasTailwind: boolean;
  packageManager: string;
}

function detectProjectInfo(cwd: string): ProjectInfo {
  const projectStructure = detectProjectStructure(cwd);

  // Detect TypeScript
  const hasTypeScript = fs.existsSync(path.join(cwd, "tsconfig.json"));

  // Detect Tailwind
  const hasTailwind =
    fs.existsSync(path.join(cwd, "tailwind.config.js")) ||
    fs.existsSync(path.join(cwd, "tailwind.config.ts")) ||
    fs.existsSync(path.join(cwd, "tailwind.config.mjs"));

  // Detect package manager
  let packageManager = "npm";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  } else if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    packageManager = "bun";
  }

  return {
    ...projectStructure,
    hasTypeScript,
    hasTailwind,
    packageManager,
  };
}

function generateSmartDefaults(projectInfo: ProjectInfo) {
  const { structure, framework, router, hasTypeScript } = projectInfo;

  // Smart hooks path based on project structure
  let hooksPath = "./hooks";
  if (structure === "src") {
    hooksPath = "./src/hooks";
  } else if (framework === "nextjs" && router === "app") {
    hooksPath = "./lib/hooks";
  }

  // Smart utils path
  let utilsPath = "./lib/utils";
  if (structure === "src") {
    utilsPath = "./src/lib/utils";
  }

  return {
    hooksPath,
    utilsPath,
    typescript: hasTypeScript,
  };
}

function displayProjectInfo(projectInfo: ProjectInfo) {
  console.log(chalk.cyan("\n📋 Project Detection:"));
  console.log(chalk.gray(`   Framework: ${projectInfo.framework}`));
  console.log(chalk.gray(`   Structure: ${projectInfo.structure}`));
  if (projectInfo.framework === "nextjs") {
    console.log(chalk.gray(`   Router: ${projectInfo.router}`));
  }
  console.log(
    chalk.gray(`   TypeScript: ${projectInfo.hasTypeScript ? "✅" : "❌"}`)
  );
  console.log(
    chalk.gray(`   Tailwind: ${projectInfo.hasTailwind ? "✅" : "❌"}`)
  );
  console.log(chalk.gray(`   Package Manager: ${projectInfo.packageManager}`));
}

export async function initCommand() {
  const cwd = process.cwd();

  console.log(chalk.blue("🚀 Initializing usehooks in your project..."));

  // Detect project structure and info
  const projectInfo = detectProjectInfo(cwd);
  displayProjectInfo(projectInfo);

  // Generate smart defaults
  const defaults = generateSmartDefaults(projectInfo);

  console.log(chalk.cyan("\n⚙️  Configuration:"));

  const responses = await prompts([
    {
      type: "text",
      name: "hooksPath",
      message: "Where would you like to store your hooks?",
      initial: defaults.hooksPath,
      hint: `Detected ${projectInfo.structure} structure`,
    },
    {
      type: "text",
      name: "utilsPath",
      message: "Where is your utils file?",
      initial: defaults.utilsPath,
      hint: "For shared utility functions",
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Are you using TypeScript?",
      initial: defaults.typescript,
      hint: projectInfo.hasTypeScript ? "Auto-detected" : "Not detected",
    },
    {
      type: "confirm",
      name: "rsc",
      message: "Are you using React Server Components?",
      initial:
        projectInfo.framework === "nextjs" && projectInfo.router === "app",
      hint:
        projectInfo.framework === "nextjs" && projectInfo.router === "app"
          ? "Detected Next.js App Router"
          : "Only for Next.js App Router",
    },
  ]);

  // Handle user cancellation
  if (!responses.hooksPath) {
    console.log(chalk.yellow("\n❌ Initialization cancelled."));
    process.exit(0);
  }

  const config: Config = {
    style: "default",
    rsc: responses.rsc,
    tsx: responses.typescript,
    aliases: {
      hooks: responses.hooksPath,
    },
  };

  // Add Tailwind config if detected
  if (projectInfo.hasTailwind) {
    config.tailwind = {
      config: "./tailwind.config.js",
      css: "./app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    };
  }

  try {
    // Create hooks directory
    const hooksDir = path.resolve(cwd, responses.hooksPath);
    await fs.ensureDir(hooksDir);

    // Create utils directory if it doesn't exist
    const utilsDir = path.dirname(path.resolve(cwd, responses.utilsPath));
    await fs.ensureDir(utilsDir);

    // Create utils file if it doesn't exist
    const utilsFile = path.resolve(
      cwd,
      responses.utilsPath + (responses.typescript ? ".ts" : ".js")
    );
    if (!(await fs.pathExists(utilsFile))) {
      const utilsContent = responses.typescript
        ? `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
        : `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

      await fs.writeFile(utilsFile, utilsContent);
    }

    // Save config
    await saveConfig(config, cwd);

    // Success messages
    console.log(chalk.green("\n✅ usehooks initialized successfully!"));
    console.log(
      chalk.gray(`   Configuration: ${path.join(cwd, "usehooks.json")}`)
    );
    console.log(chalk.gray(`   Hooks directory: ${hooksDir}`));
    console.log(chalk.gray(`   Utils file: ${utilsFile}`));

    // Next steps
    console.log(chalk.cyan("\n🎯 Next steps:"));
    console.log(
      chalk.blue(`   ${projectInfo.packageManager} install clsx tailwind-merge`)
    );
    console.log(chalk.blue(`   npx usehooks-cli@latest add [hook-name]`));
    console.log(chalk.blue(`   npx usehooks-cli@latest list`));
  } catch (error) {
    console.error(chalk.red("\n❌ Failed to initialize usehooks:"));
    console.error(error);
    process.exit(1);
  }
}
