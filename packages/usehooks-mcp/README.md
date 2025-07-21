# mcp-usehooks

A Model Context Protocol (MCP) server for accessing React hooks from usehooks.io with enhanced formatting options and caching.

## Features

- Access all hooks from the usehooks.io repository
- Search hooks by keyword or category
- Get detailed information about specific hooks including implementation code
- View examples with code snippets
- Format output as JSON or Markdown
- Efficient caching for improved performance
- Comprehensive error handling

## Installation

```bash
npm install -g mcp-usehooks
```

Or install locally:

```bash
npm install mcp-usehooks
```

## Usage

### Starting the Server

If installed globally:

```bash
mcp-usehooks
```

If installed locally:

```bash
npx mcp-usehooks
```

Or run it directly from the repository:

```bash
node mcp_usehooks_server.js
```

### Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

### Integration with Claude Desktop

To use this MCP server with Claude Desktop:

1. Install the package globally: `npm install -g mcp-usehooks`
2. In Claude Desktop, go to Settings > MCP Servers
3. Add a new MCP server with the following configuration:
   - Name: UseHooks
   - Command: `mcp-usehooks`

Once connected, Claude will have access to the hooks through the MCP tools.

## Available Tools

### list_hooks

Lists all available React hooks, optionally filtered by category.

**Parameters:**

- `category` (optional): Filter hooks by category (e.g., "state", "browser", "utility")
- `format` (optional): Output format, either "json" or "markdown" (default: "markdown")

**Example:**

```json
{
  "server_name": "usehooks",
  "tool_name": "list_hooks",
  "args": {
    "category": "state",
    "format": "markdown"
  }
}
```

### get_categories

Retrieves all available hook categories.

**Parameters:**

- `with_counts` (optional): Include the number of hooks in each category (default: false)

**Example:**

```json
{
  "server_name": "usehooks",
  "tool_name": "get_categories",
  "args": {
    "with_counts": true
  }
}
```

### search_hooks

Searches for hooks by keyword in name, title, or description.

**Parameters:**

- `keyword`: Keyword to search for in hook names, titles, and descriptions
- `category` (optional): Filter search results by category
- `format` (optional): Output format, either "json" or "markdown" (default: "markdown")

**Example:**

```json
{
  "server_name": "usehooks",
  "tool_name": "search_hooks",
  "args": {
    "keyword": "storage",
    "category": "browser",
    "format": "markdown"
  }
}
```

### get_hook

Retrieves detailed information about a specific hook, including its implementation code and examples.

**Parameters:**

- `name`: Name of the hook to retrieve (e.g., "use-counter", "use-local-storage")
- `format` (optional): Output format, either "json" or "markdown" (default: "markdown")
- `include_examples` (optional): Include example code snippets (default: true)

**Example:**

```json
{
  "server_name": "usehooks",
  "tool_name": "get_hook",
  "args": {
    "name": "use-counter",
    "format": "markdown",
    "include_examples": true
  }
}
```

## Features in Detail

### Caching

The server implements an efficient caching mechanism with a 5-minute TTL (Time To Live) to improve performance and reduce API calls. The cache includes:

- List of all hooks
- Hooks organized by category
- Individual hook details

### Markdown Formatting

All tools support markdown output format for better readability when used with AI assistants. The markdown output includes:

- Properly formatted headings
- Code blocks with syntax highlighting
- Lists and descriptions
- Examples with code snippets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
