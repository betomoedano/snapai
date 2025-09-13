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

| Prompt                                                                                                            | Result                                                       | Command                                                                              |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `glass-like color-wheel flower made of eight evenly spaced, semi-transparent petals`                              | ![Flower Icon](test-icons/icon-1750560657796.png)            | `snapai icon --prompt "glass-like color-wheel flower..."`                            |
| `glass-like sound wave pattern made of five curved, semi-transparent layers flowing in perfect harmony`           | ![Sound Wave Icon](test-icons/icon-sound-wave.png)           | `snapai icon --prompt "glass-like sound wave pattern..."`                            |
| `glass-like speech bubble composed of three overlapping, semi-transparent rounded rectangles with soft gradients` | ![Messaging Icon](test-icons/icon-messaging.png)             | `snapai icon --prompt "glass-like speech bubble..."`                                 |
| `glass-like camera aperture made of six triangular, semi-transparent blades forming a perfect hexagonal opening`  | ![Camera Glass Icon](test-icons/icon-camera-glass.png)       | `snapai icon --prompt "glass-like camera aperture..."`                               |
| `stylized camera lens with concentric circles in warm sunset colors orange pink and coral gradients`              | ![Camera Retro Icon](test-icons/icon-lens-retro.png)         | `snapai icon --prompt "stylized camera lens with concentric circles..."`             |
| `neon-outlined calculator with electric blue glowing numbers`                                                     | ![Neon Calculator Icon](test-icons/icon-calculator-neon.png) | `snapai icon --prompt "neon-outlined calculator with electric blue glowing numbers"` |

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

#### Basic Usage

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

#### Advanced Options

##### Model Selection

```bash
# Use GPT-Image-1 (default, best quality)
snapai icon --prompt "modern app icon" --model gpt-image-1

# Use DALL-E 3 (creative, artistic)
snapai icon --prompt "artistic app icon" --model dall-e-3

# Use DALL-E 2 (fast, cost-effective)
snapai icon --prompt "simple app icon" --model dall-e-2
```

##### Multiple Images

```bash
# Generate 3 variations (gpt-image-1 only)
snapai icon --prompt "app icon" --num-images 3

# Generate 5 variations with high quality
snapai icon --prompt "logo design" --num-images 5 --quality high
```

##### Background & Format

```bash
# Transparent background (gpt-image-1 only)
snapai icon --prompt "logo" --background transparent --output-format png

# Different output formats (gpt-image-1 only)
snapai icon --prompt "web banner" --output-format webp
snapai icon --prompt "photo" --output-format jpeg
```

##### Quality & Moderation

```bash
# Ultra-high quality (gpt-image-1)
snapai icon --prompt "professional icon" --quality high

# Lower content filtering (gpt-image-1 only)
snapai icon --prompt "edgy design" --moderation low
```

#### All Available Flags

| Flag              | Short | Options                               | Default       | Description                          |
| ----------------- | ----- | ------------------------------------- | ------------- | ------------------------------------ |
| `--prompt`        | `-p`  | text                                  | _required_    | Description of the icon to generate  |
| `--output`        | `-o`  | path                                  | `./assets`    | Output directory for generated icons |
| `--model`         | `-m`  | `gpt-image-1`, `dall-e-3`, `dall-e-2` | `gpt-image-1` | AI model to use                      |
| `--size`          | `-s`  | See sizes table below                 | `1024x1024`   | Icon size (model-dependent)          |
| `--quality`       | `-q`  | See quality table below               | `auto`        | Image quality (model-dependent)      |
| `--background`    | `-b`  | `transparent`, `opaque`, `auto`       | `auto`        | Background type (gpt-image-1 only)   |
| `--output-format` | `-f`  | `png`, `jpeg`, `webp`                 | `png`         | Output format (gpt-image-1 only)     |
| `--num-images`    | `-n`  | 1-10                                  | `1`           | Number of images (dall-e-3 max: 1)   |
| `--moderation`    |       | `low`, `auto`                         | `auto`        | Content filtering (gpt-image-1 only) |
| `--raw-prompt`    |       | boolean                               | `false`       | Skip iOS enhancement                 |

#### Model Comparison

| Feature             | GPT-Image-1                           | DALL-E 3                        | DALL-E 2                    |
| ------------------- | ------------------------------------- | ------------------------------- | --------------------------- |
| **Quality**         | ⭐⭐⭐⭐⭐                            | ⭐⭐⭐⭐                        | ⭐⭐⭐                      |
| **Speed**           | ⭐⭐⭐⭐                              | ⭐⭐⭐                          | ⭐⭐⭐⭐⭐                  |
| **Cost**            | Medium                                | High                            | Low                         |
| **Sizes**           | 1024x1024, 1536x1024, 1024x1536, auto | 1024x1024, 1792x1024, 1024x1792 | 256x256, 512x512, 1024x1024 |
| **Quality Options** | auto, high, medium, low               | standard, hd                    | standard only               |
| **Multiple Images** | 1-10                                  | 1 only                          | 1-10                        |
| **Transparent BG**  | ✅                                    | ❌                              | ❌                          |
| **Format Options**  | png, jpeg, webp                       | png only                        | png only                    |

#### Size Guide

**GPT-Image-1 & DALL-E 2:**

- `1024x1024` - Square (perfect for app icons)
- `1536x1024` - Landscape
- `1024x1536` - Portrait
- `auto` - Let AI decide best size (gpt-image-1 only)

**DALL-E 3:**

- `1024x1024` - Square
- `1792x1024` - Wide landscape
- `1024x1792` - Tall portrait

**DALL-E 2:**

- `256x256` - Small square
- `512x512` - Medium square
- `1024x1024` - Large square

#### Quality Guide

**GPT-Image-1:**

- `auto` - AI optimizes quality vs speed
- `high` - Maximum quality, slower
- `medium` - Balanced quality and speed
- `low` - Fast generation, lower quality

**DALL-E 3:**

- `standard` - Good quality, faster
- `hd` - High definition, costs 2x more

**DALL-E 2:**

- API does not support quality option

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

### Model Pricing

| Model           | Quality     | Size      | Price per Image | Best For                |
| --------------- | ----------- | --------- | --------------- | ----------------------- |
| **GPT-Image-1** | auto/medium | 1024x1024 | ~$0.04          | Balanced quality & cost |
| **GPT-Image-1** | high        | 1024x1024 | ~$0.08          | Professional icons      |
| **GPT-Image-1** | low         | 1024x1024 | ~$0.02          | Quick iterations        |
| **DALL-E 3**    | standard    | 1024x1024 | ~$0.04          | Creative designs        |
| **DALL-E 3**    | hd          | 1024x1024 | ~$0.08          | High-detail artwork     |
| **DALL-E 2**    | standard    | 1024x1024 | ~$0.02          | Fast & economical       |

### Cost Optimization Tips

```bash
# 💡 Cost-effective workflow
# 1. Start with DALL-E 2 for quick iterations
snapai icon --prompt "app icon concept" --model dall-e-2

# 2. Generate multiple variations with GPT-Image-1
snapai icon --prompt "refined app icon" --model gpt-image-1 --num-images 3

# 3. Final high-quality version with DALL-E 3
snapai icon --prompt "final app icon" --model dall-e-3 --quality hd
```

> [!TIP]
> Use `--model dall-e-2` for testing, then `--model gpt-image-1` for variations, and `--model dall-e-3 --quality hd` for production!

## 🚀 Advanced Usage

### CI/CD Integration

```bash
# Perfect for automation with different models
npx snapai icon --prompt "$(cat icon-prompt.txt)" --output ./dist/icons --model gpt-image-1

# Generate multiple formats for web
npx snapai icon --prompt "web logo" --background transparent --output-format webp --output ./web-assets
```

### Batch Generation

```bash
# Generate multiple variations with single command
snapai icon --prompt "app icon variations" --num-images 5 --model gpt-image-1 --output ./icons

# Generate different sizes for different platforms
snapai icon --prompt "social media logo" --size 1024x1024 --output ./social --model dall-e-3
snapai icon --prompt "banner logo" --size 1792x1024 --output ./banners --model dall-e-3
```

### Professional Workflow

```bash
# 1. Concept phase - quick & cheap
snapai icon --prompt "fitness app icon concept" --model dall-e-2 --num-images 5

# 2. Refinement phase - multiple high-quality options
snapai icon --prompt "fitness app icon with dumbbell" --model gpt-image-1 --quality high --num-images 3

# 3. Final production - transparent background for overlays
snapai icon --prompt "final fitness app icon" --model gpt-image-1 --background transparent --quality high

# 4. Platform-specific versions
snapai icon --prompt "app store icon" --model dall-e-3 --quality hd --size 1024x1024
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
