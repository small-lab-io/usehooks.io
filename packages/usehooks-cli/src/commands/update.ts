import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { getConfig } from "../utils/config";
import { getHook } from "../utils/registry";
import { installDependencies } from "../utils/dependencies";

interface UpdateOptions {
  all?: boolean;
  yes?: boolean;
  cwd?: string;
}

interface InstalledHook {
  name: string;
  path: string;
  currentContent: string;
}

/**
 * Get all installed hooks from the hooks directory
 */
async function getInstalledHooks(hooksDir: string): Promise<InstalledHook[]> {
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
      const content = await fs.readFile(filePath, "utf-8");

      installedHooks.push({
        name: hookName,
        path: filePath,
        currentContent: content,
      });
    }
  }

  return installedHooks;
}

/**
 * Check if hook content has changed
 */
function hasContentChanged(
  currentContent: string,
  newContent: string
): boolean {
  // Remove whitespace and normalize for comparison
  const normalize = (content: string) => content.replace(/\s+/g, " ").trim();
  return normalize(currentContent) !== normalize(newContent);
}

/**
 * Create a backup of the current hook file
 */
async function createBackup(filePath: string): Promise<string> {
  const backupPath = `${filePath}.backup.${Date.now()}`;
  await fs.copy(filePath, backupPath);
  return backupPath;
}

export async function updateCommand(hooks: string[], options: UpdateOptions) {
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
  const installedHooks = await getInstalledHooks(hooksDir);

  if (installedHooks.length === 0) {
    console.log(chalk.yellow("No hooks found in your project."));
    return;
  }

  let hooksToUpdate: string[] = [];

  if (options.all) {
    hooksToUpdate = installedHooks.map((hook) => hook.name);
  } else if (hooks.length > 0) {
    // Validate that specified hooks exist locally
    const installedHookNames = installedHooks.map((hook) => hook.name);
    const notFound = hooks.filter((hook) => !installedHookNames.includes(hook));

    if (notFound.length > 0) {
      console.log(chalk.red(`Hooks not found locally: ${notFound.join(", ")}`));
      process.exit(1);
    }

    hooksToUpdate = hooks;
  } else {
    // Interactive selection
    const { selectedHooks } = await prompts({
      type: "multiselect",
      name: "selectedHooks",
      message: "Which hooks would you like to update?",
      choices: installedHooks.map((hook) => ({
        title: hook.name,
        value: hook.name,
        description: `Located at ${path.relative(cwd, hook.path)}`,
      })),
    });

    hooksToUpdate = selectedHooks || [];
  }

  if (hooksToUpdate.length === 0) {
    console.log(chalk.yellow("No hooks selected for update."));
    return;
  }

  const spinner = ora("Checking for updates...").start();
  const updatesAvailable: {
    hook: InstalledHook;
    newHook: any;
    hasChanges: boolean;
  }[] = [];

  try {
    for (const hookName of hooksToUpdate) {
      const installedHook = installedHooks.find((h) => h.name === hookName)!;
      const newHook = await getHook(hookName);

      if (!newHook) {
        spinner.warn(`Hook "${hookName}" not found in registry.`);
        continue;
      }

      // Get the hook file content from registry
      const hookFile = newHook.files.find((file) => file.type === "hook");
      if (!hookFile) {
        spinner.warn(`No hook file found for "${hookName}".`);
        continue;
      }

      const hasChanges = hasContentChanged(
        installedHook.currentContent,
        hookFile.content
      );

      updatesAvailable.push({
        hook: installedHook,
        newHook,
        hasChanges,
      });
    }

    spinner.stop();

    if (updatesAvailable.length === 0) {
      console.log(chalk.green("✅ All hooks are up to date!"));
      return;
    }

    // Show what will be updated
    console.log(chalk.cyan("\n📋 Update Summary:"));
    updatesAvailable.forEach(({ hook, hasChanges }) => {
      const status = hasChanges
        ? chalk.yellow("UPDATE AVAILABLE")
        : chalk.green("UP TO DATE");
      console.log(`   ${chalk.bold(hook.name)} - ${status}`);
    });

    const hooksWithUpdates = updatesAvailable.filter((u) => u.hasChanges);

    if (hooksWithUpdates.length === 0) {
      console.log(chalk.green("\n✅ All selected hooks are up to date!"));
      return;
    }

    // Confirm update
    if (!options.yes) {
      const { confirmUpdate } = await prompts({
        type: "confirm",
        name: "confirmUpdate",
        message: `Update ${hooksWithUpdates.length} hook(s)?`,
        initial: true,
      });

      if (!confirmUpdate) {
        console.log(chalk.yellow("Update cancelled."));
        return;
      }
    }

    // Perform updates
    const updateSpinner = ora("Updating hooks...").start();
    const backupPaths: string[] = [];

    try {
      for (const { hook, newHook, hasChanges } of hooksWithUpdates) {
        if (!hasChanges) continue;

        // Create backup
        const backupPath = await createBackup(hook.path);
        backupPaths.push(backupPath);

        // Update the file
        const hookFile = newHook.files.find(
          (file: any) => file.type === "hook"
        )!;
        await fs.writeFile(hook.path, hookFile.content);

        // Install new dependencies if any
        if (newHook.dependencies?.length) {
          await installDependencies(newHook.dependencies, cwd);
        }

        updateSpinner.succeed(`Updated ${chalk.green(hook.name)}`);
      }

      console.log(
        chalk.green(
          `\n✅ Successfully updated ${hooksWithUpdates.length} hook(s)!`
        )
      );

      if (backupPaths.length > 0) {
        console.log(chalk.gray(`\n💾 Backups created:`));
        backupPaths.forEach((backup) => {
          console.log(chalk.gray(`   ${path.relative(cwd, backup)}`));
        });
        console.log(
          chalk.gray(
            "   You can safely delete these backup files if the updates work correctly."
          )
        );
      }
    } catch (error) {
      updateSpinner.fail("Failed to update hooks");

      // Restore from backups on error
      if (backupPaths.length > 0) {
        console.log(chalk.yellow("Restoring from backups..."));
        for (const backupPath of backupPaths) {
          const originalPath = backupPath.replace(/\.backup\.\d+$/, "");
          await fs.copy(backupPath, originalPath);
        }
        console.log(chalk.green("Restored from backups."));
      }

      console.error(error);
      process.exit(1);
    }
  } catch (error) {
    spinner.fail("Failed to check for updates");
    console.error(error);
    process.exit(1);
  }
}
