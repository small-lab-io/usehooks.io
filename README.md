<div align="center">
  <h1>usehooks.io</h1>
  <p><strong>A comprehensive collection of production-ready React hooks</strong></p>
  <p>Build better React applications with our curated library of reusable hooks and powerful CLI tool</p>
  
  <p>
    <a href="https://www.usehooks.io">🌐 Website</a> •
    <a href="#-quick-start">🚀 Quick Start</a> •
    <a href="#-available-hooks">📚 Hooks</a> •
    <a href="#-cli-tool">🛠️ CLI</a> •
    <a href="#-contributing">🤝 Contributing</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react" alt="React 18+" />
    <img src="https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat-square&logo=typescript" alt="TypeScript 5.8+" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
  </p>
</div>

---

## ✨ Features

- 🎯 **30+ Production-Ready Hooks** - Carefully crafted and battle-tested
- 🚀 **Zero Configuration** - Works out of the box with any React project
- 📦 **CLI Tool** - Add hooks to your project with a single command
- 🔍 **Smart Search** - Find hooks by name, description, or category
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive type definitions
- 📱 **Modern APIs** - Leverages latest browser APIs and React patterns
- 🎨 **Customizable** - Flexible configuration options for every use case
- 📋 **Well Documented** - Comprehensive docs with examples and best practices

## 🚀 Quick Start

### Using the CLI (Recommended)

```bash
# Initialize usehooks in your project
npx usehooks-cli@latest init

# Add a specific hook
npx usehooks-cli@latest add use-counter

# List all available hooks
npx usehooks-cli@latest list

# Get detailed information about a hook
npx usehooks-cli@latest info use-geolocation
```

## 📚 Available Hooks

Our collection includes 30+ hooks organized by category:

### 🏪 State Management

- useArray - Helper methods for array state manipulation
- useCounter - Counter state with increment, decrement, and reset
- useLocalStorage - Sync state with localStorage
- useSet - Comprehensive Set data structure management
- useToggle - Boolean toggle state with convenient methods

### 📡 Sensors & Device APIs

- useAudioRecorder - Audio recording with real-time analysis
- useBarcodeDetector - Barcode and QR code detection
- useDeviceOrientation - Device orientation data access
- useGeolocation - User location with GPS tracking
- useHover - Element hover detection with callbacks
- useMediaSession - Media notifications and control actions
- useNetworkInformation - Network connection monitoring
- useUserMedia - Camera and microphone access
- useVibration - Device vibration control

### 🌐 Browser APIs

- useBluetooth - Bluetooth Low Energy device interaction
- useClipboard - Clipboard operations with state management
- useContactPicker - Contact selection with user permission
- useFullscreen - Fullscreen mode management
- useStorage - Browser storage quotas and persistence
- useWebShare - Native sharing mechanisms
- useWindowSize - Window dimensions tracking

### 🔧 Utilities

- useDebounce - Value debouncing for performance
- useThrottle - Value throttling for rate limiting
- usePrevious - Access to previous state/prop values
- useIsMounted - Component mount status checking
- useTimeout - Timeout management with controls

### 🔄 Lifecycle

- useDeepCompareEffect - useEffect with deep equality check
- useUpdateEffect - useEffect that skips initial render

### 🌍 Network

- useFetch - HTTP requests with loading states and error handling

### 🔐 Authentication

- useRoleGuard - Role-based access control
  💡 Tip : Run npx usehooks-cli@latest list to see the complete list with descriptions and categories.

## 🛠️ CLI Tool

Our powerful CLI tool makes it easy to discover, install, and manage hooks in your projects.

### Key Features

- 🚀 Quick Installation - Add hooks with a single command
- 🔍 Smart Search - Find hooks by name, description, or category
- 📋 Detailed Information - Get comprehensive details about any hook
- 🔄 Update Management - Keep hooks up-to-date
- 🗑️ Clean Removal - Remove hooks and dependencies safely
- 📱 Interactive Mode - User-friendly prompts and confirmations

### Commands

```
# Initialize project
npx usehooks-cli@latest init

# Add hooks
npx usehooks-cli@latest add use-counter use-toggle

# List all hooks
npx usehooks-cli@latest list

# Get hook information
npx usehooks-cli@latest info use-geolocation

# Update hooks
npx usehooks-cli@latest update --all

# Remove hooks
npx usehooks-cli@latest remove use-counter
```

## 🏗️ Project Structure

This monorepo contains several packages:

```
usehooks.io/
├── packages/
│   ├── hooks/              # 🪝 Core hooks library
│   ├── usehooks-cli/       # 🛠️ CLI tool for hook management
│   ├── ui/                 # 🎨 Shared UI components
│   ├── eslint-config/      # 📏 ESLint configuration
│   └── typescript-config/  # 📝 TypeScript configuration
├── apps/
│   └── www/               # 🌐 Documentation website
└── docs/                  # 📚 Additional documentation
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding a New Hook

1. Fork and clone the repository
2. Create a new hook directory in packages/hooks/src/
3. Follow the hook template :
   ```
   use-your-hook/
   ├── index.ts      # Hook implementation
   ├── meta.json     # Hook metadata
   └── doc.json      # Documentation
   ```
4. Add comprehensive tests
5. Update the index.json file
6. Submit a pull request

### Guidelines

- ✅ TypeScript first - All hooks must be written in TypeScript
- ✅ Comprehensive tests - Include unit tests and edge cases
- ✅ Clear documentation - Provide examples and use cases
- ✅ Performance focused - Optimize for minimal re-renders
- ✅ Browser compatibility - Support modern browsers
- ✅ Accessibility - Consider a11y implications

## 📖 Documentation

- 🌐 Website : usehooks.io
- 📚 Hook Documentation : Each hook includes comprehensive docs with examples
- 🛠️ CLI Documentation : Run npx usehooks-cli@latest --help
- 🎯 Examples : Check the /examples directory in each hook

## 🔧 Requirements

- Node.js : 20 or higher
- React : 18 or higher
- TypeScript : 5.8 or higher (recommended)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
