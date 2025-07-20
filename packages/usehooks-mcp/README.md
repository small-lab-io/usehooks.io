# usehooks-mcp

A Model Context Protocol (MCP) server for accessing React hooks from usehooks.io.

## Features

- Access all hooks from the usehooks.io repository
- Search hooks by keyword
- Filter hooks by category
- Get detailed information about specific hooks including implementation code

## Installation

```bash
pnpm install
pnpm build
```

## Usage

### Starting the Server

```bash
pnpm start
```

Or you can run it directly:

```bash
node build/index.js
```

### Integration with Claude Desktop

To use this MCP server with Claude Desktop:

1. Start the server using `pnpm start`
2. In Claude Desktop, go to Settings > MCP Servers
3. Add a new MCP server with the following configuration:
   - Name: UseHooks
   - Command: `node /path/to/usehooks.io/packages/usehooks-mcp/build/index.js`

Once connected, Claude will have access to the hooks through the MCP tools.

## Available Tools

### list_hooks

Lists all available React hooks, optionally filtered by category.

**Parameters:**
- `category` (optional): Filter hooks by category (e.g., "state", "browser", "utility")

**Example:**
```json
{
  "server_name": "usehooks-mcp",
  "tool_name": "list_hooks",
  "args": {
    "category": "state"
  }
}
```

### search_hooks

Searches for hooks by keyword in name or description.

**Parameters:**
- `keyword`: Keyword to search for in hook names and descriptions

**Example:**
```json
{
  "server_name": "usehooks-mcp",
  "tool_name": "search_hooks",
  "args": {
    "keyword": "storage"
  }
}
```

### get_hook

Retrieves detailed information about a specific hook, including its implementation code.

**Parameters:**
- `name`: Name of the hook to retrieve (e.g., "use-counter", "use-local-storage")

**Example:**
```json
{
  "server_name": "usehooks-mcp",
  "tool_name": "get_hook",
  "args": {
    "name": "use-counter"
  }
}
```





## License

ISC
