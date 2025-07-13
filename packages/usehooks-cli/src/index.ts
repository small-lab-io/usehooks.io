import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { updateCommand } from "./commands/update.js";
import { removeCommand } from "./commands/remove.js";
import { searchCommand } from "./commands/search";
import { infoCommand } from "./commands/info";

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
  .command("update")
  .description("Update hooks to their latest versions")
  .argument("[hooks...]", "hooks to update")
  .option("-a, --all", "update all installed hooks")
  .option("-y, --yes", "skip confirmation prompt")
  .option("-c, --cwd <cwd>", "the working directory")
  .action(updateCommand);

program
  .command("remove")
  .description("Remove hooks from your project")
  .argument("[hooks...]", "hooks to remove")
  .option("-y, --yes", "skip confirmation prompt")
  .option("-c, --cwd <cwd>", "the working directory")
  .option("--clean-deps", "remove unused dependencies")
  .action(removeCommand);

program
  .command("list")
  .description("List all available hooks")
  .action(listCommand);

// Search command
program
  .command("search")
  .description("Search for hooks by name, description, or category")
  .argument("<query>", "Search query")
  .option("-c, --category <category>", "Filter by category")
  .option("-i, --interactive", "Interactive search mode")
  .option("-a, --add", "Add selected hook after search")
  .action(searchCommand);

// Info command
program
  .command("info")
  .description("Get detailed information about a specific hook")
  .argument("<hook-name>", "Name of the hook")
  .option("-e, --examples", "Show only examples")
  .option("-d, --dependencies", "Show only dependencies")
  .option("-m, --methods", "Show only methods")
  .action(infoCommand);

program.parse();
