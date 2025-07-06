#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("usehooks")
  .description("A CLI for adding React hooks to your project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize usehooks in your project")
  .action(initCommand);

program
  .command("add")
  .description("Add a hook to your project")
  .argument("[hooks...]", "hooks to add")
  .option("-y, --yes", "skip confirmation prompt")
  .option("-o, --overwrite", "overwrite existing files")
  .option("-c, --cwd <cwd>", "the working directory")
  .option("-p, --path <path>", "the path to add the hook")
  .action(addCommand);

program
  .command("list")
  .description("List all available hooks")
  .action(listCommand);

program.parse();
