#!/bin/bash

# UseHooks MCP Server Installation Script
# This script helps you install and configure the UseHooks MCP server for your IDE

set -e

echo "🚀 UseHooks MCP Server Installation"
echo "===================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if ! node -e "process.exit(process.version.slice(1).split('.').map(Number).reduce((a,b,i)=>(a||0)*1000+b,0) >= '$REQUIRED_VERSION'.split('.').map(Number).reduce((a,b,i)=>(a||0)*1000+b,0) ? 0 : 1)"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to version $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"
echo

# Install the package globally
echo "📦 Installing mcp-usehooks globally..."
if command -v pnpm &> /dev/null; then
    pnpm add -g mcp-usehooks
elif command -v yarn &> /dev/null; then
    yarn global add mcp-usehooks
else
    npm install -g mcp-usehooks
fi

echo "✅ mcp-usehooks installed successfully!"
echo

# Test the installation
echo "🧪 Testing installation..."
if command -v mcp-usehooks &> /dev/null; then
    echo "✅ mcp-usehooks command is available"
else
    echo "❌ mcp-usehooks command not found. Installation may have failed."
    exit 1
fi

echo
echo "🎉 Installation completed successfully!"
echo
echo "Next steps:"
echo "1. Configure your IDE to use the MCP server"
echo "2. See IDE_INTEGRATION.md for detailed setup instructions"
echo "3. For VSCode: Install Claude Desktop or Cline extension"
echo "4. For Windsurf: Go to Settings → Extensions → MCP Servers"
echo
echo "Configuration command: mcp-usehooks"
echo "Documentation: https://github.com/small-lab-io/usehooks.io/tree/main/packages/usehooks-mcp"
echo
echo "Happy coding! 🎯"