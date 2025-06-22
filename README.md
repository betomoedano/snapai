# SnapAI ⚡

> AI-powered icon generation for React Native & Expo developers

Create stunning app icons in seconds using OpenAI's latest image generation models. Perfect for developers who want professional icons without the design hassle! 🎨

## ✨ Features

🚀 **Lightning Fast** - Generate icons in seconds, not hours  
🎯 **iOS Optimized** - Perfect for App Store requirements  
🛡️ **Privacy First** - Zero data collection, API keys stay local  
📱 **Multiple Sizes** - Square, landscape, and portrait formats  
💎 **HD Quality** - Crystal clear icons for any device  
🔧 **Developer Friendly** - Simple CLI, perfect for CI/CD

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g snapai

# Or use directly (no installation)
npx snapai
```

> [!IMPORTANT]  
> You'll need an OpenAI API key to generate icons. Get one at [platform.openai.com](https://platform.openai.com) - it costs ~$0.04 per icon!

### Setup Your API Key

```bash
snapai config --api-key sk-your-openai-api-key-here
```

### Generate Your First Icon! 🎉

```bash
snapai icon --prompt "minimalist weather app with sun and cloud"
```

## 🎨 See It In Action

**Real icons generated with SnapAI:**

| Prompt                                                                               | Result                                                | Command                                                   |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| `minimalist calculator app icon`                                                     | ![Calculator Icon](test-icons/icon-1750603172468.png) | `snapai icon --prompt "minimalist calculator app icon"`   |
| `glass-like color-wheel flower made of eight evenly spaced, semi-transparent petals` | ![Flower Icon](test-icons/icon-1750560657796.png)     | `snapai icon --prompt "glass-like color-wheel flower..."` |

## 🎨 Amazing Example Prompts

Try these proven prompts that create stunning icons:

```bash
# Glass-like design (trending!)
snapai icon --prompt "glass-like color-wheel flower made of eight evenly spaced, semi-transparent petals forming a perfect circle"

# Minimalist apps
snapai icon --prompt "minimalist calculator app with clean geometric numbers and soft gradients"
snapai icon --prompt "fitness tracker app with stylized running figure using vibrant gradient colors"

# Creative concepts
snapai icon --prompt "weather app with glass-like sun and translucent cloud elements"
snapai icon --prompt "music player app with abstract sound waves in soft pastel hues"
snapai icon --prompt "banking app with secure lock symbol and professional gradients"
```

> [!TIP]
> Use descriptive words like "glass-like", "minimalist", "vibrant gradients", and "soft pastel hues" for better results!

## 🛠️ Command Reference

### Generate Icons

```bash
# Basic usage
snapai icon --prompt "your amazing icon idea"

# Custom output directory
snapai icon --prompt "fitness app" --output ./assets/icons

# High quality (costs 2x but worth it!)
snapai icon --prompt "premium app icon" --quality hd

# Different sizes
snapai icon --prompt "landscape banner" --size 1536x1024
snapai icon --prompt "portrait icon" --size 1024x1536
```

### Configuration

```bash
snapai config --show              # Check your setup
snapai config --api-key YOUR_KEY  # Set/update API key
```

> [!NOTE]  
> Icons are saved as PNG files with timestamps. Perfect for version control!

## 🔐 Privacy & Security

**Your data stays yours** 🛡️

- ✅ **Zero tracking** - We collect absolutely nothing
- ✅ **Local storage** - API keys never leave your machine
- ✅ **No telemetry** - No analytics, no phone-home
- ✅ **Open source** - Inspect every line of code
- ✅ **No accounts** - Just install and use

> [!WARNING]  
> Keep your OpenAI API key secure! Never commit it to version control or share it publicly.

## 💰 Pricing

**SnapAI is 100% free!** You only pay OpenAI for generation:

| Quality  | Size      | Price  | Best For              |
| -------- | --------- | ------ | --------------------- |
| Standard | 1024x1024 | ~$0.04 | Testing, iterations   |
| HD       | 1024x1024 | ~$0.08 | Production, App Store |

> [!TIP]
> Start with standard quality for testing, then use HD for your final icons!

## 🚀 Advanced Usage

### CI/CD Integration

```bash
# Perfect for automation
npx snapai icon --prompt "$(cat icon-prompt.txt)" --output ./dist/icons
```

### Batch Generation

```bash
# Generate multiple variations
snapai icon --prompt "app icon variant 1" --output ./icons
snapai icon --prompt "app icon variant 2" --output ./icons
snapai icon --prompt "app icon variant 3" --output ./icons
```

## 🛠️ For Developers

Need help setting up for development? Check out our detailed guides:

- 📚 [Development Setup](DEV_SETUP.md) - Local development workflow
- 📦 [Publishing Guide](PUBLISHING_GUIDE.md) - For maintainers

```bash
# Quick dev setup
git clone https://github.com/betomoedano/snapai.git
cd snapai && pnpm install && pnpm run build
./bin/dev.js --help
```

## 📚 Learn More

**Want to master React Native & Expo development?** 🚀

Visit [**Code with Beto**](https://codewithbeto.dev) for premium courses:

- 📱 **React Native with Expo** - Build real-world apps
- ⚡ **React with TypeScript** - Type-safe development
- 🔧 **GitHub Mastery** - Professional workflows
- 🔥 **LiveStore Course** _(Coming Soon)_ - Local-first apps

_Build the skills that top developers use in production!_ ✨

## 🤝 Contributing

Love SnapAI? Help make it even better!

- 🐛 [Report bugs](https://github.com/betomoedano/snapai/issues)
- 💡 [Suggest features](https://github.com/betomoedano/snapai/issues)
- 📝 [Improve docs](CONTRIBUTING.md)
- 🔧 [Submit code](CONTRIBUTING.md)

## 📄 License

MIT License - build amazing things! 🎉
