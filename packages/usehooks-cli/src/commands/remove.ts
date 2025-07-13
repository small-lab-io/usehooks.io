import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { execSync } from "child_process";
import { getConfig } from "../utils/config";
import { detectPackageManager } from "../utils/dependencies";

interface RemoveOptions {
  yes?: boolean;
  cwd?: string;
  "clean-deps"?: boolean;
}

interface InstalledHook {
  name: string;
  path: string;
  relativePath: string;
}

/**
 * Get all installed hooks from the hooks directory
 */
async function getInstalledHooks(
  hooksDir: string,
  cwd: string
): Promise<InstalledHook[]> {
  const installedHooks: InstalledHook[] = [];

  if (!(await fs.pathExists(hooksDir))) {
    return installedHooks;
  }

  const files = await fs.readdir(hooksDir);

  for (const file of files) {
    const filePath = path.join(hooksDir, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile() && (file.endsWith(".ts") || file.endsWith(".js"))) {
      // Extract hook name from filename (e.g., "use-counter.ts" -> "use-counter")
      const hookName = path.basename(file, path.extname(file));

      installedHooks.push({
        name: hookName,
        path: filePath,
        relativePath: path.relative(cwd, filePath),
      });
    }
  }

  return installedHooks;
}

/**
 * Check if a dependency is used by other files in the project
 */
async function isDependencyUsedElsewhere(
  dependency: string,
  projectDir: string,
  excludePaths: string[]
): Promise<boolean> {
  try {
    // Search for import statements of this dependency
    const searchPatterns = [
      `from ['"]${dependency}['"]`,
      `require\(['"]${dependency}['"]\)`,
      `import.*['"]${dependency}['"]`,
    ];

    for (const pattern of searchPatterns) {
      try {
        const result = execSync(
          `grep -r "${pattern}" ${projectDir} --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true`,
          { encoding: "utf-8", stdio: "pipe" }
        );

        if (result.trim()) {
          // Check if any matches are outside the excluded paths
          const matches = result.split("\n").filter((line) => line.trim());
          const relevantMatches = matches.filter((match) => {
            const filePath = match.split(":")[0];
            return !excludePaths.some(
              (excludePath) => filePath && filePath.includes(excludePath)
            );
          });

          if (relevantMatches.length > 0) {
            return true;
          }
        }
      } catch (error) {
        // Continue with next pattern if grep fails
        continue;
      }
    }

    return false;
  } catch (error) {
    // If we can't determine usage, err on the side of caution
    return true;
  }
}

/**
 * Extract dependencies from hook file content
 */
function extractDependenciesFromContent(content: string): string[] {
  const dependencies: string[] = [];
  const importRegex = /from ['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

  let match;

  // Extract from import statements
  while ((match = importRegex.exec(content)) !== null) {
    const dep = match[1];
    // Only include external dependencies (not relative imports)
    if (!dep?.startsWith(".") && !dep?.startsWith("/")) {
      if (dep) dependencies.push(dep);
    }
  }

  // Extract from require statements
  while ((match = requireRegex.exec(content)) !== null) {
    const dep = match[1];
    if (!dep?.startsWith(".") && !dep?.startsWith("/")) {
      if (dep) dependencies.push(dep);
    }
  }

  return [...new Set(dependencies)]; // Remove duplicates
}

/**
 * Remove unused dependencies
 */
async function removeUnusedDependencies(
  dependencies: string[],
  projectDir: string,
  excludePaths: string[]
): Promise<string[]> {
  const unusedDeps: string[] = [];

  for (const dep of dependencies) {
    const isUsed = await isDependencyUsedElsewhere(
      dep,
      projectDir,
      excludePaths
    );
    if (!isUsed) {
      unusedDeps.push(dep);
    }
  }

  if (unusedDeps.length > 0) {
    const packageManager = detectPackageManager(projectDir);
    let uninstallCommand: string;

    switch (packageManager) {
      case "pnpm":
        uninstallCommand = `pnpm remove ${unusedDeps.join(" ")}`;
        break;
      case "yarn":
        uninstallCommand = `yarn remove ${unusedDeps.join(" ")}`;
        break;
      case "npm":
      default:
        uninstallCommand = `npm uninstall ${unusedDeps.join(" ")}`;
        break;
    }

    try {
      execSync(uninstallCommand, {
        cwd: projectDir,
        stdio: "pipe",
      });
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Warning: Failed to remove dependencies: ${unusedDeps.join(", ")}`
        )
      );
    }
  }

  return unusedDeps;
}

export async function removeCommand(hooks: string[], options: RemoveOptions) {
  const cwd = path.resolve(options.cwd || process.cwd());

  // Check if config exists
  const config = await getConfig(cwd);
  if (!config) {
    console.log(
      chalk.red(
        "Configuration not found. Please run `usehooks-cli init` first."
      )
    );
    process.exit(1);
  }

  const hooksDir = path.resolve(cwd, config.aliases.hooks);
  const installedHooks = await getInstalledHooks(hooksDir, cwd);

  if (installedHooks.length === 0) {
    console.log(chalk.yellow("No hooks found in your project."));
    return;
  }

  let hooksToRemove: InstalledHook[] = [];

  if (hooks.length > 0) {
    // Validate that specified hooks exist locally
    const installedHookNames = installedHooks.map((hook) => hook.name);
    const notFound = hooks.filter((hook) => !installedHookNames.includes(hook));

    if (notFound.length > 0) {
      console.log(chalk.red(`Hooks not found: ${notFound.join(", ")}`));
      process.exit(1);
    }

    hooksToRemove = installedHooks.filter((hook) => hooks.includes(hook.name));
  } else {
    // Interactive selection
    const { selectedHooks } = await prompts({
      type: "multiselect",
      name: "selectedHooks",
      message: "Which hooks would you like to remove?",
      choices: installedHooks.map((hook) => ({
        title: hook.name,
        value: hook.name,
        description: hook.relativePath,
      })),
    });

    if (!selectedHooks || selectedHooks.length === 0) {
      console.log(chalk.yellow("No hooks selected for removal."));
      return;
    }

    hooksToRemove = installedHooks.filter((hook) =>
      selectedHooks.includes(hook.name)
    );
  }

  // Show what will be removed
  console.log(chalk.cyan("\n🗑️  Removal Summary:"));
  hooksToRemove.forEach((hook) => {
    console.log(
      `   ${chalk.red("✗")} ${chalk.bold(hook.name)} ${chalk.gray(`(${hook.relativePath})`)}`
    );
  });

  // Confirm removal
  if (!options.yes) {
    const { confirmRemoval } = await prompts({
      type: "confirm",
      name: "confirmRemoval",
      message: `Remove ${hooksToRemove.length} hook(s)?`,
      initial: false,
    });

    if (!confirmRemoval) {
      console.log(chalk.yellow("Removal cancelled."));
      return;
    }
  }

  const spinner = ora("Removing hooks...").start();
  const removedHooks: string[] = [];
  const allDependencies: string[] = [];

  try {
    for (const hook of hooksToRemove) {
      // Extract dependencies before removing the file
      if (options["clean-deps"]) {
        const content = await fs.readFile(hook.path, "utf-8");
        const dependencies = extractDependenciesFromContent(content);
        allDependencies.push(...dependencies);
      }

      // Remove the hook file
      await fs.remove(hook.path);
      removedHooks.push(hook.name);

      spinner.text = `Removed ${hook.name}`;
    }

    spinner.succeed(`Removed ${removedHooks.length} hook(s)`);

    // Clean up unused dependencies if requested
    if (options["clean-deps"] && allDependencies.length > 0) {
      const cleanupSpinner = ora("Checking for unused dependencies...").start();

      try {
        const uniqueDeps = [...new Set(allDependencies)];
        const excludePaths = hooksToRemove.map((hook) => hook.path);
        const removedDeps = await removeUnusedDependencies(
          uniqueDeps,
          cwd,
          excludePaths
        );

        if (removedDeps.length > 0) {
          cleanupSpinner.succeed(
            `Removed unused dependencies: ${chalk.gray(removedDeps.join(", "))}`
          );
        } else {
          cleanupSpinner.succeed("No unused dependencies found");
        }
      } catch (error) {
        cleanupSpinner.warn("Could not clean up dependencies");
      }
    }

    console.log(
      chalk.green(
        `\n✅ Successfully removed: ${chalk.bold(removedHooks.join(", "))}`
      )
    );

    if (options["clean-deps"]) {
      console.log(
        chalk.gray(
          "\n💡 Tip: Use --clean-deps to automatically remove unused dependencies"
        )
      );
    }
  } catch (error) {
    spinner.fail("Failed to remove hooks");
    console.error(error);
    process.exit(1);
  }
}
