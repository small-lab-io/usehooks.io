import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import prompts from "prompts";
import { saveConfig, type Config } from "../utils/config";

export async function initCommand() {
  const cwd = process.cwd();

  console.log(chalk.blue("Initializing usehooks in your project..."));

  const responses = await prompts([
    {
      type: "text",
      name: "hooksPath",
      message: "Where would you like to store your hooks?",
      initial: "./hooks",
    },
    {
      type: "text",
      name: "utilsPath",
      message: "Where is your utils file?",
      initial: "./lib/utils",
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Are you using TypeScript?",
      initial: true,
    },
  ]);

  const config: Config = {
    style: "default",
    rsc: false,
    tsx: responses.typescript,
    aliases: {
      hooks: responses.hooksPath,
      utils: responses.utilsPath,
    },
  };

  // Create hooks directory
  const hooksDir = path.resolve(cwd, responses.hooksPath);
  await fs.ensureDir(hooksDir);

  // Save config
  await saveConfig(config, cwd);

  console.log(chalk.green("\n✅ usehooks initialized successfully!"));
  console.log(
    chalk.gray(`Configuration saved to ${path.join(cwd, "usehooks.json")}`)
  );
  console.log(chalk.gray(`Hooks directory created at ${hooksDir}`));
  console.log(
    chalk.blue("\nYou can now add hooks using: usehooks add [hook-name]")
  );
}
