import chalk from "chalk";
import prompts from "prompts";
import { getAllHooks } from "../utils/registry";
import { addCommand } from "./add";

interface SearchOptions {
  category?: string;
  interactive?: boolean;
  add?: boolean;
}

/**
 * Fuzzy search function for matching hooks
 */
function fuzzyMatch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Fuzzy match - check if all characters in query exist in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

/**
 * Calculate relevance score for search results
 */
function calculateRelevance(query: string, hook: any): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Exact name match gets highest score
  if (hook.name.toLowerCase() === queryLower) {
    score += 100;
  } else if (hook.name.toLowerCase().includes(queryLower)) {
    score += 50;
  }

  // Description match
  if (hook.description.toLowerCase().includes(queryLower)) {
    score += 30;
  }

  // Category match
  if (hook.category && hook.category.toLowerCase().includes(queryLower)) {
    score += 20;
  }

  // Title match
  if (hook.title && hook.title.toLowerCase().includes(queryLower)) {
    score += 25;
  }

  return score;
}

export async function searchCommand(
  query: string,
  options: SearchOptions = {}
) {
  if (!query || query.trim().length === 0) {
    console.log(chalk.red("Please provide a search query."));
    console.log(chalk.gray('Example: usehooks-cli search "fetch"\n'));
    return;
  }

  const spinner = require("ora")("Searching hooks...").start();

  try {
    const allHooks = await getAllHooks();

    // Filter by category if specified
    let hooksToSearch = allHooks;
    if (options.category) {
      hooksToSearch = allHooks.filter(
        (hook) =>
          hook.category?.toLowerCase() === options?.category?.toLowerCase()
      );
    }

    // Search and score results
    const results = hooksToSearch
      .map((hook) => ({
        hook,
        relevance: calculateRelevance(query, hook),
        matches: {
          name: fuzzyMatch(query, hook.name),
          description: fuzzyMatch(query, hook.description),
          category: hook.category ? fuzzyMatch(query, hook.category) : false,
          title: hook.title ? fuzzyMatch(query, hook.title) : false,
        },
      }))
      .filter(
        (result) =>
          result.relevance > 0 || Object.values(result.matches).some(Boolean)
      )
      .sort((a, b) => b.relevance - a.relevance);

    spinner.stop();

    if (results.length === 0) {
      console.log(chalk.yellow(`No hooks found matching "${query}"`));
      console.log(chalk.gray("\nTry:"));
      console.log(chalk.gray("• Using different keywords"));
      console.log(
        chalk.gray("• Checking available categories with: usehooks-cli list")
      );
      console.log(
        chalk.gray(
          '• Searching by category: usehooks-cli search "state" --category=state'
        )
      );
      return;
    }

    console.log(
      chalk.blue(`\n🔍 Found ${results.length} hook(s) matching "${query}":\n`)
    );

    results.slice(0, 10).forEach((result, index) => {
      const { hook, matches } = result;

      // Hook name with match indicators
      let nameDisplay = chalk.bold.green(hook.name);
      if (matches.name) {
        nameDisplay =
          chalk.bold.yellow(hook.name) + chalk.gray(" [name match]");
      }

      console.log(`${chalk.gray(`${index + 1}.`)} ${nameDisplay}`);
      console.log(`   ${chalk.gray(hook.description)}`);

      // Show match types
      const matchTypes = [];
      if (matches.category) matchTypes.push("category");
      if (matches.description) matchTypes.push("description");
      if (matches.title) matchTypes.push("title");

      if (matchTypes.length > 0) {
        console.log(`   ${chalk.cyan(`Matches: ${matchTypes.join(", ")}`)}`);
      }

      if (hook.category) {
        console.log(`   ${chalk.magenta(`Category: ${hook.category}`)}`);
      }

      console.log();
    });

    if (results.length > 10) {
      console.log(chalk.gray(`... and ${results.length - 10} more results\n`));
    }

    // Interactive mode or add option
    if (options.interactive || options.add) {
      const { selectedHook } = await prompts({
        type: "select",
        name: "selectedHook",
        message: "Which hook would you like to add or get info about?",
        choices: [
          ...results.slice(0, 10).map((result, index) => ({
            title: `${result.hook.name} - ${result.hook.description}`,
            value: result.hook.name,
          })),
          { title: "Cancel", value: null },
        ],
      });

      if (selectedHook) {
        if (options.add) {
          await addCommand([selectedHook], {});
        } else {
          // Show detailed info
          const { infoCommand } = await import("./info");
          await infoCommand(selectedHook);
        }
      }
    }

    // Show helpful commands
    console.log(chalk.gray("💡 Helpful commands:"));
    console.log(
      chalk.gray(
        `   usehooks-cli info <hook-name>     Get detailed information`
      )
    );
    console.log(
      chalk.gray(
        `   usehooks-cli add <hook-name>      Add hook to your project`
      )
    );
    console.log(
      chalk.gray(
        `   usehooks-cli search --interactive  Interactive search mode`
      )
    );
  } catch (error) {
    spinner.fail("Search failed");
    console.error(chalk.red("Error during search:"), error);
    process.exit(1);
  }
}
