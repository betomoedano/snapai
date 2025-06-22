# SnapAI - AI Icon Generation CLI

Generate beautiful app icons using AI, perfect for mobile developers using Expo and React Native.

## Quick Start

### Installation
```bash
npm install -g snapai
# or
pnpm install -g snapai
# or
npx snapai
```

### Local Development Setup

#### Quick Setup
```bash
cd /Users/beto/Desktop/apps/iconiq
pnpm install
pnpm run build

# Create alias for easy testing
alias snapai-dev="/Users/beto/Desktop/apps/iconiq/bin/dev.js"
```

#### Development with Hot Reload
For active development with automatic recompilation:

```bash
# Terminal 1: Start TypeScript compiler in watch mode
pnpm run dev

# Terminal 2: Test your changes (auto-rebuilds on save)
./bin/dev.js --help
./bin/dev.js icon --prompt "test icon"

# Or use the dev wrapper (same as above but shorter)
./dev-cli.js --help
./dev-cli.js icon --prompt "test icon"
```

#### One-off Testing
```bash
# Build and test immediately
pnpm run build && ./bin/dev.js --help
```

### Setup
Add your OpenAI API key (required):
```bash
snapai config --api-key sk-your-openai-api-key-here
```

### Generate Icons
```bash
# Generate an iOS app icon
snapai icon --prompt "minimalist calculator app icon"

# Custom output directory
snapai icon --prompt "fitness tracker app" --output ./assets/icons
```

## Commands

### `snapai config`
Manage configuration settings:
```bash
snapai config --api-key YOUR_KEY    # Set OpenAI API key
snapai config --show               # Show current settings
```

### `snapai icon`
Generate app icons:
```bash
snapai icon --prompt "your icon description"
snapai icon --prompt "..." --output ./custom/path
snapai icon --help                 # Show all options
```

## Requirements

- Node.js 18+
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

## Pricing

SnapAI is free to use - you only pay OpenAI for API usage:
- ~$0.04 per 1024x1024 icon (standard quality)
- ~$0.08 per 1024x1024 icon (HD quality)

## Privacy

SnapAI is completely privacy-focused:
- ✅ No data collection or tracking
- ✅ API keys stored locally only
- ✅ No telemetry or analytics
- ✅ Fully open source

## Support

- 🐛 Report issues: [GitHub Issues](https://github.com/betomoedano/snapai/issues)
- 📖 Documentation: [snapai.dev](https://snapai.dev)
- 💬 Community: [Discord](https://discord.gg/snapai)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Start for Contributors
```bash
git clone https://github.com/betomoedano/snapai.git
cd snapai
pnpm install
pnpm run build
./bin/dev.js --help
```

## License

MIT - see [LICENSE](LICENSE) file for details.