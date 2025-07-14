# usehooks CLI

A powerful command-line interface tool for seamlessly integrating React hooks into your projects. Inspired by [shadcn/ui](https://ui.shadcn.com/)'s component workflow, usehooks CLI makes it easy to add, manage, and discover hooks in your React applications. Visit [usehooks.io](https://www.usehooks.io)

## Features

- 🚀 **Quick Installation**: Add hooks to your project with a single command
- 📦 **Curated Collection**: Production-ready hooks from the usehooks.io library
- 🔍 **Smart Search**: Find hooks by name, description, or category
- 📋 **Detailed Information**: Get comprehensive details about any hook
- 🔄 **Update Management**: Keep your hooks up-to-date with the latest versions
- 🗑️ **Clean Removal**: Remove hooks and their dependencies safely
- ⚡️ **Zero Configuration**: Works out of the box with smart project detection
- 🎨 **Customizable**: Flexible configuration options
- 🛡️ **Type Safe**: Full TypeScript support
- 📱 **Interactive Mode**: User-friendly prompts and confirmations

## Requirements

- Node.js 18.0.0 or higher
- A React project (Next.js, Vite, Create React App, etc.)

## Installation

No installation required! Use npx to run the CLI directly:

```bash
npx usehooks-cli@latest init
```

## Usage

### add

After initializing your project with `npx usehooks-cli@latest init`, you can start adding hooks to your components:

```bash
npx usehooks-cli@latest add [hooks]
```

Options:

- -y, --yes - Skip confirmation prompt
- -o, --overwrite - Overwrite existing files
- -c, --cwd <cwd> - Specify working directory
- -p, --path <path> - Custom path for hook installation

### Example

```bash
npx usehooks-cli@latest add use-counter
```

This command will scaffold the necessary files and update your component to use the `use-counter` hook.

### update

Update hooks to their latest versions.

```
npx usehooks-cli@latest update [hooks...]
```

Options:

- -a, --all - Update all installed hooks
- -y, --yes - Skip confirmation prompt
- -c, --cwd <cwd> - Specify working directory
  Examples:

```
# Update a specific hook
npx usehooks-cli@latest update use-counter

# Update all hooks
npx usehooks-cli@latest update --all

# Update multiple specific hooks
npx usehooks-cli@latest update use-counter use-fetch
```

Features:

- Content comparison to detect changes
- Automatic backup creation
- Dependency management
- Error recovery with rollback
- Interactive selection mode

### remove

Remove hooks from your project.

```
npx usehooks-cli@latest remove [hooks...]
```

Options:

- -y, --yes - Skip confirmation prompt
- -c, --cwd <cwd> - Specify working directory
- --clean-deps - Remove unused dependencies
  Examples:

```
# Remove a specific hook
npx usehooks-cli@latest remove use-counter

# Remove multiple hooks
npx usehooks-cli@latest remove use-counter use-fetch

# Remove with dependency cleanup
npx usehooks-cli@latest remove use-counter --clean-deps
```

Features:

- Smart dependency detection
- Usage checking to prevent accidental removal
- Interactive selection mode
- Safe dependency cleanup

### list

View all available hooks in the registry.

```
npx usehooks-cli@latest list
```

Features:

- Categorized hook listing
- Hook descriptions and metadata
- Installation status indicators
- Filterable by category

### search

Search for hooks by name, description, or category.

```
npx usehooks-cli@latest search <query>
```

Options:

- -c, --category <category> - Filter by specific category
- -i, --interactive - Interactive search mode
- -a, --add - Add selected hook after search
  Examples:

```
# Search for hooks related to "fetch"
npx usehooks-cli@latest search "fetch"

# Search within a specific category
npx usehooks-cli@latest search "state" --category "State"

# Interactive search with option to add
npx usehooks-cli@latest search "counter" --interactive --add
```

Features:

- Fuzzy matching
- Relevance scoring
- Multi-criteria search (name, description, category)
- Interactive selection
- Quick add functionality

### info

Get detailed information about a specific hook.

```
npx usehooks-cli@latest info <hook-name>
```

Options:

- -e, --examples - Show only examples
- -d, --dependencies - Show only dependencies
- -m, --methods - Show only methods
  Examples:

```
# Get full information about a hook
npx usehooks-cli@latest info use-fetch

# Show only examples
npx usehooks-cli@latest info use-fetch --examples

# Show only dependencies
npx usehooks-cli@latest info use-fetch --dependencies
```

Features:

- Comprehensive hook documentation
- Parameter and return type information
- Usage examples
- Dependency information
- Method descriptions
- Rich formatting

## Hooks

usehooks CLI comes with a curated collection of production-ready hooks. To view the full list, run:

```bash
npx usehooks-cli@latest list
```

## License

usehooks CLI is open-source software licensed under the MIT License.
