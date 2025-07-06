import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { getConfig } from "../utils/config";
import { getHook, getAllHooks } from "../utils/registry";

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd?: string;
  path?: string;
}

export async function addCommand(hooks: string[], options: AddOptions) {
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

  // If no hooks specified, prompt for selection
  if (!hooks.length) {
    const availableHooks = await getAllHooks();

    if (!availableHooks.length) {
      console.log(chalk.yellow("No hooks available."));
      return;
    }

    const { selectedHooks } = await prompts({
      type: "multiselect",
      name: "selectedHooks",
      message: "Which hooks would you like to add?",
      choices: availableHooks.map((hook) => ({
        title: hook.name,
        value: hook.name,
        description: hook.description,
      })),
    });
    hooks = selectedHooks || [];
  }

  if (!hooks.length) {
    console.log(chalk.yellow("No hooks selected."));
    return;
  }

  const spinner = ora("Adding hooks...").start();

  try {
    for (const hookName of hooks) {
      const hook = await getHook(hookName);
      if (!hook) {
        spinner.warn(`Hook "${hookName}" not found.`);
        continue;
      }

      // Determine target directory
      const targetDir = options.path
        ? path.resolve(cwd, options.path)
        : path.resolve(cwd, config.aliases.hooks);

      // Ensure directory exists
      await fs.ensureDir(targetDir);

      // Write hook files (only hook type files, not examples)
      const hookFiles = hook.files.filter((file) => file.type === "hook");

      for (const file of hookFiles) {
        // Use hook name instead of file.name for the output filename
        const fileExtension = path.extname(file.name); // Get extension from original file (.ts, .js, etc.)
        const outputFileName = `${hookName}${fileExtension}`; // e.g., "use-counter.ts"
        const filePath = path.join(targetDir, outputFileName);
        const fileExists = await fs.pathExists(filePath);

        if (fileExists && !options.overwrite && !options.yes) {
          const { overwrite } = await prompts({
            type: "confirm",
            name: "overwrite",
            message: `File ${outputFileName} already exists. Overwrite?`,
            initial: false,
          });

          if (!overwrite) {
            continue;
          }
        }

        await fs.writeFile(filePath, file.content);
      }

      spinner.succeed(`Added ${chalk.green(hookName)}`);
    }
  } catch (error) {
    spinner.fail("Failed to add hooks");
    console.error(error);
    process.exit(1);
  }

  console.log(chalk.green("\n✅ Hooks added successfully!"));
}
