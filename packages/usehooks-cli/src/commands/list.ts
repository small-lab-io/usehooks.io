import chalk from "chalk";
import { getHooksByCategory } from "../utils/registry";

export async function listCommand() {
  const hooksByCategory = await getHooksByCategory();
  const categories = Object.keys(hooksByCategory);

  if (categories.length === 0) {
    console.log(chalk.yellow("No hooks available."));
    return;
  }

  console.log(chalk.blue("Available hooks:\n"));

  categories.forEach((category) => {
    console.log(chalk.bold.cyan(`${category.toUpperCase()}`));
    hooksByCategory[category].forEach((hook) => {
      console.log(`${chalk.green("●")} ${chalk.bold(hook.name)}`);
      console.log(`  ${chalk.gray(hook.description)}`);
    });
    console.log();
  });

  const totalHooks = categories.reduce(
    (sum, cat) => sum + hooksByCategory[cat].length,
    0
  );
  console.log(chalk.blue(`Total: ${totalHooks} hooks available`));
}
