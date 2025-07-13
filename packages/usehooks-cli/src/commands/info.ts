import chalk from "chalk";
import fetch from "node-fetch";
import { getHook } from "../utils/registry";

interface InfoOptions {
  examples?: boolean;
  dependencies?: boolean;
  methods?: boolean;
}

/**
 * Get detailed documentation for a hook
 */
async function getHookDocumentation(hookName: string): Promise<any | null> {
  try {
    const docUrl = `https://raw.githubusercontent.com/small-lab-io/usehooks.io/main/packages/hooks/src/${hookName}/doc.json`;
    const response = await fetch(docUrl);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Format parameter information
 */
function formatParameters(parameters: any[]): string {
  if (!parameters || parameters.length === 0) {
    return chalk.gray("None");
  }

  return parameters
    .map((param) => {
      const optional = param.optional ? "?" : "";
      const defaultValue = param.default ? ` = ${param.default}` : "";
      return `${chalk.cyan(param.name)}${optional}: ${chalk.yellow(param.type)}${defaultValue}`;
    })
    .join("\n   ");
}

/**
 * Format method information
 */
function formatMethods(methods: any[]): string {
  if (!methods || methods.length === 0) {
    return chalk.gray("None");
  }

  return methods
    .map((method) => {
      const methodType =
        method.category === "state"
          ? "📊"
          : method.category === "mutation"
            ? "🔄"
            : "⚡";
      return `${methodType} ${chalk.bold.cyan(method.name)}: ${chalk.yellow(method.type)}\n     ${chalk.gray(method.description)}`;
    })
    .join("\n\n   ");
}

/**
 * Format examples
 */
function formatExamples(examples: any[]): string {
  if (!examples || examples.length === 0) {
    return chalk.gray("No examples available");
  }

  return examples
    .map((example, index) => {
      return `${chalk.bold.cyan(`${index + 1}. ${example.title}`)}\n   ${chalk.gray(example.description)}\n\n   ${chalk.dim("```typescript")}\n   ${example.code
        .split("\n")
        .map((line: string) => `   ${line}`)
        .join("\n")}\n   ${chalk.dim("```")}`;
    })
    .join("\n\n");
}

export async function infoCommand(hookName: string, options: InfoOptions = {}) {
  if (!hookName) {
    console.log(chalk.red("Please specify a hook name."));
    console.log(chalk.gray("Example: usehooks-cli info use-counter\n"));
    return;
  }

  const spinner = require("ora")("Loading hook information...").start();

  try {
    // Get basic hook metadata
    const hook = await getHook(hookName);
    if (!hook) {
      spinner.fail(`Hook "${hookName}" not found`);
      console.log(chalk.yellow("\nTry searching for available hooks:"));
      console.log(
        chalk.gray(`usehooks-cli search "${hookName.replace("use-", "")}"`)
      );
      console.log(chalk.gray("usehooks-cli list"));
      return;
    }

    // Get detailed documentation
    const documentation = await getHookDocumentation(hookName);

    spinner.stop();

    // Header
    console.log(chalk.blue("\n📖 Hook Information\n"));
    console.log(chalk.bold.green(`${hook.name}`));
    console.log(chalk.gray(hook.description));

    if (hook.category) {
      console.log(
        `\n${chalk.bold("Category:")} ${chalk.magenta(hook.category)}`
      );
    }

    // Dependencies
    if (hook.dependencies && hook.dependencies.length > 0) {
      console.log(`\n${chalk.bold("Dependencies:")}`);
      hook.dependencies.forEach((dep) => {
        console.log(`   ${chalk.yellow(dep)}`);
      });
    }

    // Detailed documentation if available
    if (documentation) {
      // Parameters
      if (documentation.parameters && documentation.parameters.length > 0) {
        console.log(`\n${chalk.bold("Parameters:")}`);
        console.log(`   ${formatParameters(documentation.parameters)}`);
      }

      // Return type
      if (documentation.returnType) {
        console.log(
          `\n${chalk.bold("Returns:")} ${chalk.yellow(documentation.returnType)}`
        );
      }

      // Methods/Properties
      if (
        documentation.methods &&
        documentation.methods.length > 0 &&
        !options.methods
      ) {
        console.log(`\n${chalk.bold("Available Methods & Properties:")}`);
        console.log(`   ${formatMethods(documentation.methods)}`);
      }

      // Examples
      if (
        documentation.examples &&
        documentation.examples.length > 0 &&
        !options.examples
      ) {
        console.log(`\n${chalk.bold("Examples:")}`);
        console.log(`\n${formatExamples(documentation.examples)}`);
      }

      // Notes
      if (documentation.notes && documentation.notes.length > 0) {
        console.log(`\n${chalk.bold("Notes:")}`);
        documentation.notes.forEach((note: string) => {
          console.log(`   ${chalk.gray("•")} ${note}`);
        });
      }

      // Imports
      if (documentation.imports && documentation.imports.length > 0) {
        console.log(`\n${chalk.bold("Required Imports:")}`);
        documentation.imports.forEach((imp: string) => {
          console.log(`   ${chalk.dim(imp)}`);
        });
      }
    }

    // Files
    console.log(`\n${chalk.bold("Files:")}`);
    hook.files.forEach((file) => {
      const icon =
        file.type === "hook" ? "🪝" : file.type === "example" ? "📝" : "🧪";
      console.log(`   ${icon} ${file.name} (${file.type})`);
    });

    // Action suggestions
    console.log(`\n${chalk.bold("💡 Quick Actions:")}`);
    console.log(
      chalk.gray(
        `   usehooks-cli add ${hookName}           Add this hook to your project`
      )
    );
    console.log(
      chalk.gray(
        `   usehooks-cli search "${hook.category}"     Find similar hooks`
      )
    );

    if (documentation && documentation.examples) {
      console.log(
        chalk.gray(
          `   usehooks-cli info ${hookName} --examples  Show only examples`
        )
      );
    }
  } catch (error) {
    spinner.fail("Failed to load hook information");
    console.error(chalk.red("Error:"), error);
    process.exit(1);
  }
}
