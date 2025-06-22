# Iconiq - AI Icon Generation CLI

Generate beautiful app icons using AI, perfect for mobile developers using Expo and React Native.

## Quick Start

### Installation
```bash
npm install -g iconiq
# or
pnpm install -g iconiq
# or
npx iconiq
```

### Local Development Setup

#### Quick Setup
```bash
cd /Users/beto/Desktop/apps/iconiq
pnpm install
pnpm run build

# Create alias for easy testing
alias iconiq-dev="/Users/beto/Desktop/apps/iconiq/bin/dev.js"
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
iconiq config --api-key sk-your-openai-api-key-here
```

### Generate Icons
```bash
# Generate an iOS app icon
iconiq icon --prompt "minimalist calculator app icon"

# Custom output directory
iconiq icon --prompt "fitness tracker app" --output ./assets/icons
```

## Commands

### `iconiq config`
Manage configuration settings:
```bash
iconiq config --api-key YOUR_KEY    # Set OpenAI API key
iconiq config --show               # Show current settings
iconiq config --telemetry false    # Disable usage tracking
```

### `iconiq icon`
Generate app icons:
```bash
iconiq icon --prompt "your icon description"
iconiq icon --prompt "..." --output ./custom/path
iconiq icon --help                 # Show all options
```

## Requirements

- Node.js 16+
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

## Pricing

Iconiq is free to use - you only pay OpenAI for API usage:
- ~$0.04 per 1024x1024 icon (standard quality)
- ~$0.08 per 1024x1024 icon (HD quality)

## Privacy

Iconiq collects anonymous usage statistics to improve the tool. No personal data, API keys, or prompt content is collected. You can opt out anytime:

```bash
iconiq config --telemetry false
```

## Support

- 🐛 Report issues: [GitHub Issues](https://github.com/yourusername/iconiq/issues)
- 📖 Documentation: [iconiq.dev](https://iconiq.dev)
- 💬 Community: [Discord](https://discord.gg/iconiq)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see [LICENSE](LICENSE) file for details.