# SnapAI ⚡

> AI-powered icon generation for React Native & Expo developers

Create stunning app icons in seconds using OpenAI + Gemini image generation. Perfect for developers who want professional icons without the design hassle! 🎨

## ✨ Features

🚀 **Lightning Fast** - Generate icons in seconds, not hours  
🎯 **iOS Optimized** - Perfect for App Store requirements  
🛡️ **Privacy First** - Zero data collection, API keys stay local  
📱 **Multiple Sizes** - Square, landscape, and portrait formats  
💎 **HD Quality** - Crystal clear icons for any device  
🔧 **Developer Friendly** - Simple CLI, perfect for CI/CD

## 🚀 Full Video Tutorial

<a href="https://youtu.be/R4hvt8iz_rE">
  <img src="https://i.ytimg.com/vi_webp/R4hvt8iz_rE/maxresdefault.webp" height="380" alt="YouTube Video Preview">
</a>

### Installation

```bash
# Install globally
npm install -g snapai

# Or use directly (no installation)
npx snapai
```

> [!IMPORTANT]  
> You'll need an OpenAI API key (for `gpt-image-1.5`) and/or a Google Studio API key (for `banana`) to generate icons.

### Setup Your API Key

```bash
snapai config --api-key sk-your-openai-api-key-here
snapai config --google-api-key your-google-studio-api-key-here
```

### Secrets for CI/CD (no home directory storage)

You can provide secrets without writing to `~/.snapai/config.json`:

**Environment variables:**

```bash
export SNAPAI_API_KEY="sk-..."
export SNAPAI_GOOGLE_API_KEY="..."

# Also supported:
# export OPENAI_API_KEY="sk-..."
# export GEMINI_API_KEY="..."
```

**Per-command flags (do not persist):**

```bash
snapai icon --api-key "sk-..." --prompt "modern app artwork"
snapai icon --model banana --google-api-key "..." --prompt "modern app artwork"
```

### Generate Your First Icon! 🎉

```bash
snapai icon --prompt "minimalist weather app with sun and cloud"
```

> [!NOTE]
> The generated file can be **1024×1024**, but the model may still draw the subject with **visual padding** (a big empty border) depending on wording.  
> Tip: avoid using the words **"icon"** or **"logo"** in your prompt if you want less border. You can opt-in to that wording with `--use-icon-words`.

## 🎨 See It In Action

**Real icons generated with SnapAI:**

| Prompt                                                                                                            | Result                                                       | Command                                                                              |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `glass-like color-wheel flower made of eight evenly spaced, semi-transparent petals`                              | ![Flower Icon](test-icons/icon-1750560657796.png)            | `snapai icon --prompt "glass-like color-wheel flower..."`                            |
| `glass-like sound wave pattern made of five curved, semi-transparent layers flowing in perfect harmony`           | ![Sound Wave Icon](test-icons/icon-sound-wave.png)           | `snapai icon --prompt "glass-like sound wave pattern..."`                            |
| `glass-like speech bubble composed of three overlapping, semi-transparent rounded rectangles with soft gradients` | ![Messaging Icon](test-icons/icon-messaging.png)             | `snapai icon --prompt "glass-like speech bubble..."`                                 |
| `glass-like camera aperture made of six triangular, semi-transparent blades forming a perfect hexagonal opening`  | ![Camera Glass Icon](test-icons/icon-camera-glass.png)       | `snapai icon --prompt "glass-like camera aperture..."`                               |
| `stylized camera lens with concentric circles in warm sunset colors orange pink and coral gradients`              | ![Camera Retro Icon](test-icons/icon-lens-retro.png)         | `snapai icon --prompt "stylized camera lens with concentric circles..."`             |
| `neon-outlined calculator with electric blue glowing numbers`                                                     | ![Neon Calculator Icon](test-icons/icon-calculator-neon.png) | `snapai icon --prompt "neon-outlined calculator with electric blue glowing numbers"` |

**Style-specific examples:**

| Prompt                                                                             | Result                                         | Command                                                            |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `minimalist terminal with clean black background and white command prompt symbols` | ![Minimalist Terminal](test-icons/minimal.png) | `snapai icon --prompt "minimalist terminal..." --style minimalism` |
| `premium play button with glossy green surface and glass-like reflections`         | ![Glassy Play Button](test-icons/glassy.png)   | `snapai icon --prompt "premium play button..." --style glassy`     |
| `retro arcade joystick with pixelated red ball and classic gaming aesthetic`       | ![Pixel Joystick](test-icons/pixel.png)        | `snapai icon --prompt "retro arcade joystick..." --style pixel`    |

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

# Style-specific examples
snapai icon --prompt "minimalist calculator app with clean geometric numbers and soft blue gradients" --style minimalism
snapai icon --prompt "premium music player with glass-like sound waves and translucent purple elements" --style glassy
snapai icon --prompt "cyberpunk gaming app with electric neon borders and glowing green accents" --style neon
snapai icon --prompt "retro indie game with pixelated rocket ship and 8-bit style stars" --style pixel
snapai icon --prompt "modern Android app with Material Design floating action button and bold colors" --style material
```

## 🛠️ Command Reference

### Generate Icons

#### Basic Usage

```bash
# Basic usage
snapai icon --prompt "modern fitness tracker with heart rate monitor and clean geometric design"

# Custom output directory
snapai icon --prompt "professional banking app with secure lock icon and elegant blue gradients" --output ./assets/icons

# High quality (costs 2x but worth it!)
snapai icon --prompt "premium social media app with camera icon and vibrant gradient background" --quality hd

# Different sizes
snapai icon --prompt "wide landscape banner with company logo and modern typography" --size 1536x1024
snapai icon --prompt "tall portrait icon with vertical app interface and clean layout" --size 1024x1536

# Different styles
snapai icon --prompt "minimalist calculator with clean white background and subtle blue accents" --style minimalism
snapai icon --prompt "premium music player with glass-like equalizer bars and translucent elements" --style glassy
snapai icon --prompt "futuristic weather app with neon cloud icons and electric blue glow effects" --style neon
```

#### Advanced Options

##### Model Selection

```bash
# OpenAI (default)
snapai icon --prompt "modern app artwork" --model gpt-image-1.5

# Gemini Nano Banana (banana)
snapai icon --prompt "modern app artwork" --model banana                      # normal (1 image)
snapai icon --prompt "modern app artwork" --model banana --pro --q 2k --n 3   # pro (multiple images)
```

##### Multiple Images

```bash
# Generate 3 variations (OpenAI only)
snapai icon --prompt "app icon" --num-images 3

# Generate 5 variations with high quality
snapai icon --prompt "professional company logo with geometric shapes and modern typography" --num-images 5 --quality high
```

##### Background & Format

```bash
# Transparent background (OpenAI only)
snapai icon --prompt "logo" --background transparent --output-format png

# Different output formats (OpenAI only)
snapai icon --prompt "web banner" --output-format webp
snapai icon --prompt "photo" --output-format jpeg
```

##### Quality & Moderation

```bash
# Ultra-high quality (OpenAI)
snapai icon --prompt "professional icon" --quality high

# Lower content filtering (OpenAI only)
snapai icon --prompt "edgy design" --moderation low
```

#### All Available Flags

| Flag               | Short | Options                         | Default         | Description                                                                                                                                   |
| ------------------ | ----- | ------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--prompt`         | `-p`  | text                            | _required_      | Description of the icon to generate                                                                                                           |
| `--output`         | `-o`  | path                            | `./assets`      | Output directory for generated icons                                                                                                          |
| `--model`          | `-m`  | `gpt-image-1.5`, `banana`       | `gpt-image-1.5` | Model to use                                                                                                                                  |
| `--size`           | `-s`  | See sizes table below           | `1024x1024`     | Icon size (model-dependent)                                                                                                                   |
| `--quality`        | `-q`  | See quality table below         | `auto`          | Image quality (model-dependent)                                                                                                               |
| `--background`     | `-b`  | `transparent`, `opaque`, `auto` | `auto`          | Background type (OpenAI only)                                                                                                                 |
| `--output-format`  | `-f`  | `png`, `jpeg`, `webp`           | `png`           | Output format (OpenAI only)                                                                                                                   |
| `--num-images`     |       | 1-10                            | `1`             | Number of images (OpenAI only)                                                                                                                |
| `--moderation`     |       | `low`, `auto`                   | `auto`          | Content filtering (OpenAI only)                                                                                                               |
| `--raw-prompt`     |       | boolean                         | `false`         | Skip iOS enhancement                                                                                                                          |
| `--style`          |       | text                            |                 | Rendering style hint applied after the concept is defined (supports presets like `glassy`, `minimalism`, `clay`, `holographic`, `game`, etc.) |
| `--use-icon-words` |       | boolean                         | `false`         | Include the words "icon/logo" in enhancement (may add borders)                                                                                |
| `--pro`            |       | boolean                         | `false`         | Gemini Pro (banana only)                                                                                                                      |
| `--n`              | `-n`  | 1-10                            | `1`             | Number of images (banana pro only)                                                                                                            |
| `--q`              |       | `1k`, `2k`, `4k`                | `1k`            | Quality (banana pro only)                                                                                                                     |
| `--api-key`        |       | text                            |                 | OpenAI API key override (does not persist)                                                                                                    |
| `--google-api-key` |       | text                            |                 | Google API key override (does not persist)                                                                                                    |

#### Model Notes

- **`gpt-image-1.5` (OpenAI)**: supports `--num-images`, sizes, background, output format.
- **`banana` (Gemini)**: always square; `--pro` enables higher quality (`--q`) and multiple images (`--n`).
- **DALL·E**: no longer supported (insufficient quality for production app icons).

#### Size Guide

**GPT-Image-1.5:**

- `1024x1024` - Square (file size is correct; subject may still include visual padding depending on prompt wording)
- `1536x1024` - Landscape
- `1024x1536` - Portrait
- `auto` - Let AI decide best size (OpenAI only)

#### Quality Guide

**GPT-Image-1.5 (OpenAI):**

- `auto` - AI optimizes quality vs speed
- `high` - Maximum quality, slower
- `medium` - Balanced quality and speed
- `low` - Fast generation, lower quality

**Gemini (banana pro):**

- `--q 1k|2k|4k` controls output image size via Gemini `imageConfig.imageSize`

### Configuration

```bash
snapai config --show              # Check your setup
snapai config --api-key YOUR_KEY  # Set/update API key
snapai config --google-api-key YOUR_KEY # Set/update Google API key
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

**SnapAI is 100% free.** You only pay the model provider you use:

- OpenAI (`gpt-image-1.5`)
- Google Gemini (“banana” normal / pro)

For current pricing, check the official provider pricing pages.

## 🚀 Advanced Usage

### CI/CD Integration

```bash
# Perfect for automation (no local config needed)
export SNAPAI_API_KEY="sk-..."
export SNAPAI_GOOGLE_API_KEY="..."

npx snapai icon --prompt "$(cat icon-prompt.txt)" --output ./dist/icons --model gpt-image-1.5
npx snapai icon --prompt "$(cat icon-prompt.txt)" --output ./dist/icons --model banana --pro --q 2k --n 3

# Generate multiple formats for web
npx snapai icon --prompt "modern web logo with company branding and clean geometric design" --background transparent --output-format webp --output ./web-assets --style glassy
```

### Batch Generation

```bash
# Generate multiple variations with a single command
snapai icon --prompt "app icon variations" --num-images 5 --model gpt-image-1.5 --output ./icons
```

### Professional Workflow

```bash
# 1. Refinement phase - multiple high-quality options
snapai icon --prompt "fitness app icon with dumbbell" --model gpt-image-1.5 --quality high --num-images 3

# 2. Final production - transparent background for overlays
snapai icon --prompt "final fitness app icon" --model gpt-image-1.5 --background transparent --quality high
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
