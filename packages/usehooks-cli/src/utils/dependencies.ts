import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";

/**
 * Detect the package manager used in the project
 */
export function detectPackageManager(cwd: string): string {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }
  return "npm"; // default fallback
}

/**
 * Install dependencies using the detected package manager
 */
export async function installDependencies(
  dependencies: string[],
  cwd: string = process.cwd()
): Promise<void> {
  const packageManager = detectPackageManager(cwd);
  const spinner = ora(
    `Installing dependencies with ${packageManager}...`
  ).start();

  try {
    let installCommand: string;

    switch (packageManager) {
      case "pnpm":
        installCommand = `pnpm add ${dependencies.join(" ")}`;
        break;
      case "yarn":
        installCommand = `yarn add ${dependencies.join(" ")}`;
        break;
      case "npm":
      default:
        installCommand = `npm install ${dependencies.join(" ")}`;
        break;
    }

    execSync(installCommand, {
      cwd,
      stdio: "pipe", // Hide output to keep spinner clean
    });

    spinner.succeed(
      `Installed dependencies: ${chalk.green(dependencies.join(", "))}`
    );
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    console.error(chalk.red(`Error: ${error}`));
    throw error;
  }
}
