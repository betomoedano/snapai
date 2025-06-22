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
If you're developing locally, create an alias for easy testing:

```bash
# In your shell profile (.zshrc, .bashrc, etc.)
alias iconiq-dev="/Users/beto/Desktop/apps/iconiq/bin/dev.js"

# Or create a symlink
ln -sf /Users/beto/Desktop/apps/iconiq/bin/dev.js /usr/local/bin/iconiq-dev

# After building the project
cd /Users/beto/Desktop/apps/iconiq
pnpm install
pnpm run build
iconiq-dev --help
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