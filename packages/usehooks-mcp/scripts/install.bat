@echo off
setlocal enabledelayedexpansion

echo 🚀 UseHooks MCP Server Installation
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16.0.0 or higher first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version %NODE_VERSION% detected
echo.

REM Install the package globally
echo 📦 Installing mcp-usehooks globally...

REM Check if pnpm is available
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    pnpm add -g mcp-usehooks
    goto :check_installation
)

REM Check if yarn is available
yarn --version >nul 2>&1
if %errorlevel% equ 0 (
    yarn global add mcp-usehooks
    goto :check_installation
)

REM Use npm as fallback
npm install -g mcp-usehooks
if %errorlevel% neq 0 (
    echo ❌ Installation failed. Please check your npm configuration.
    pause
    exit /b 1
)

:check_installation
echo ✅ mcp-usehooks installed successfully!
echo.

REM Test the installation
echo 🧪 Testing installation...
mcp-usehooks --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ mcp-usehooks command is available
) else (
    echo ❌ mcp-usehooks command not found. Installation may have failed.
    pause
    exit /b 1
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo Next steps:
echo 1. Configure your IDE to use the MCP server
echo 2. See IDE_INTEGRATION.md for detailed setup instructions
echo 3. For VSCode: Install Claude Desktop or Cline extension
echo 4. For Windsurf: Go to Settings → Extensions → MCP Servers
echo.
echo Configuration command: mcp-usehooks
echo Documentation: https://github.com/small-lab-io/usehooks.io/tree/main/packages/usehooks-mcp
echo.
echo Happy coding! 🎯
echo.
pause