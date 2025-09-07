# IDE Integration Guide for UseHooks MCP Server

This guide explains how to integrate the UseHooks MCP server with popular IDEs like VSCode and Windsurf IDE.

## Overview

The UseHooks MCP server provides access to React hooks from usehooks.io through the Model Context Protocol (MCP). This allows AI assistants in your IDE to browse, search, and fetch React hooks with detailed implementation code and examples.

## Prerequisites

- Node.js 16.0.0 or higher
- npm or pnpm package manager
- VSCode or Windsurf IDE with MCP support

## Installation

### Global Installation (Recommended)

```bash
npm install -g mcp-usehooks
```

### Local Installation

```bash
npm install mcp-usehooks
```

## IDE Configuration

### VSCode Integration

#### Method 1: Using Claude Desktop Extension

1. Install the Claude Desktop extension in VSCode
2. Open VSCode settings (Cmd/Ctrl + ,)
3. Search for "MCP" or "Claude"
4. Add the following MCP server configuration:

```json
{
  "claude.mcpServers": {
    "usehooks": {
      "command": "mcp-usehooks",
      "args": [],
      "env": {}
    }
  }
}
```

#### Method 2: Using Cline Extension (formerly Claude Dev)

1. Install the Cline extension in VSCode
2. Open the extension settings
3. Navigate to MCP Servers configuration
4. Add a new server with:
   - **Name**: `usehooks`
   - **Command**: `mcp-usehooks`
   - **Args**: `[]` (empty array)

#### Method 3: Manual Configuration File

Create or edit your MCP configuration file (usually `~/.config/claude-desktop/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "usehooks": {
      "command": "mcp-usehooks",
      "args": []
    }
  }
}
```

### Windsurf IDE Integration

#### Using Built-in MCP Support

1. Open Windsurf IDE
2. Go to Settings → Extensions → MCP Servers
3. Click "Add New Server"
4. Configure the server:
   - **Server Name**: `UseHooks`
   - **Command**: `mcp-usehooks`
   - **Arguments**: Leave empty or `[]`
   - **Working Directory**: Leave default

#### Alternative Configuration

If Windsurf uses a configuration file, add this to your MCP config:

```json
{
  "servers": {
    "usehooks": {
      "command": "mcp-usehooks",
      "args": [],
      "env": {}
    }
  }
}
```

## Local Development Setup

If you're working with the source code locally:

1. Clone the repository:
```bash
git clone https://github.com/small-lab-io/usehooks.io.git
cd usehooks.io/packages/usehooks-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Use the local path in your IDE configuration:
```json
{
  "usehooks": {
    "command": "node",
    "args": ["/path/to/usehooks.io/packages/usehooks-mcp/mcp_usehooks_server.js"]
  }
}
```

## Verification

To verify the integration is working:

1. Restart your IDE after configuration
2. Open a chat with your AI assistant
3. Ask questions like:
   - "Show me available React hooks"
   - "Search for storage-related hooks"
   - "Get details about the use-counter hook"

## Available Commands

Once integrated, your AI assistant can use these tools:

- **list_hooks**: List all available React hooks, optionally filtered by category
- **search_hooks**: Search hooks by keyword in name, title, or description
- **get_hook**: Get detailed information about a specific hook with implementation code
- **get_categories**: Get all available hook categories

## Troubleshooting

### Common Issues

1. **Command not found**: Ensure `mcp-usehooks` is installed globally or use the full path
2. **Permission denied**: Check file permissions and ensure Node.js is properly installed
3. **Server not starting**: Verify Node.js version (16.0.0+) and dependencies are installed

### Debug Mode

Run the server manually to check for errors:

```bash
# Global installation
mcp-usehooks

# Local installation
npx mcp-usehooks

# From source
node mcp_usehooks_server.js
```

### Logs

Check your IDE's MCP server logs for connection issues. Most IDEs provide MCP server status in their settings or developer tools.

## Configuration Options

### Environment Variables

You can configure the server behavior using environment variables:

```json
{
  "usehooks": {
    "command": "mcp-usehooks",
    "args": [],
    "env": {
      "DEBUG": "true",
      "CACHE_TTL": "300"
    }
  }
}
```

### Custom Port (if needed)

Some configurations might require specifying a port:

```json
{
  "usehooks": {
    "command": "mcp-usehooks",
    "args": ["--port", "3001"]
  }
}
```

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/small-lab-io/usehooks.io/issues)
2. Create a new issue with:
   - Your IDE and version
   - Configuration used
   - Error messages or logs
   - Steps to reproduce

## Contributing

Contributions to improve IDE integration are welcome! Please submit pull requests or issues on the [GitHub repository](https://github.com/small-lab-io/usehooks.io).