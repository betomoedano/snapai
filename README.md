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

**Style-specific examples:**

| Prompt                                                                             | Result                                         | Command                                                            |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `minimalist terminal with clean black background and white command prompt symbols` | ![Minimalist Terminal](test-icons/minimal.png) | `snapai icon --prompt "minimalist terminal..." --style minimalism` |
| `premium play button with glossy green surface and glass-like reflections`         | ![Glassy Play Button](test-icons/glassy.png)   | `snapai icon --prompt "premium play button..." --style glassy`     |
| `retro arcade joystick with pixelated red ball and classic gaming aesthetic`       | ![Pixel Joystick](test-icons/pixel.png)        | `snapai icon --prompt "retro arcade joystick..." --style pixel`    |

## 🎨 Amazing Example Prompts

> [!NOTE]
> Want to see how these prompts look with different styles? Add `--prompt-only` to any command below to preview for free!

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

#### Preview Prompts (No Generation)

Use `--prompt-only` to see the final enhanced prompt that will be sent to the AI model without generating images. Perfect for:

- Seeing how styles modify your prompt
- Debugging and refining prompts before paying for generation
- Understanding the iOS enhancement logic
- Testing different style combinations

```bash
# See the raw prompt (no enhancements)
snapai icon --prompt "calculator app with clean design" --prompt-only

# See how minimalism style enhances your prompt
snapai icon --prompt "calculator app" --style minimalism --prompt-only

# See the default iOS enhancement for app icons
snapai icon --prompt "modern fitness tracker" --prompt-only

# Compare different styles for the same concept
snapai icon --prompt "music player" --style glassy --prompt-only
snapai icon --prompt "music player" --style neon --prompt-only
snapai icon --prompt "music player" --style minimalism --prompt-only

# See the full configuration with model and size
snapai icon --prompt "banking app with secure lock" --style material --model gpt-image-1 --size 1024x1024 --prompt-only
```

**Example output:**
```
📝 Final Generated Prompt:

Create a full-bleed 1024x1024 px iOS app icon: banking app with secure lock. Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. IMPORTANT: Fill the entire canvas edge-to-edge with the design, no padding, no margins. Design elements should be centered with appropriate spacing from edges but the background must cover 100% of the canvas. Add subtle depth with inner highlights, avoid hard shadows. Clean, minimal, Apple-style design. No borders, frames, or rounded corners.

🎨 Style: minimalism
   Clean, simple lines with maximum 2-3 colors. Ultra-clean, Apple-inspired minimalism.

🤖 Model: gpt-image-1

📐 Size: 1024x1024
```

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
# Use GPT-Image-1 (default, best quality)
snapai icon --prompt "professional task manager with checkmark icon and clean minimalist design" --model gpt-image-1

# Use DALL-E 3 (creative, artistic)
snapai icon --prompt "artistic photo editing app with paintbrush and vibrant color palette" --model dall-e-3

# Use DALL-E 2 (fast, cost-effective)
snapai icon --prompt "simple note-taking app with pencil icon and clean white background" --model dall-e-2
```

##### Multiple Images

```bash
# Generate 3 variations (gpt-image-1 only)
snapai icon --prompt "modern fitness app with dumbbell icon and energetic design" --num-images 3

# Generate 5 variations with high quality
snapai icon --prompt "professional company logo with geometric shapes and modern typography" --num-images 5 --quality high
```

##### Background & Format

```bash
# Transparent background (gpt-image-1 only)
snapai icon --prompt "modern company logo with geometric shapes and clean typography" --background transparent --output-format png

# Different output formats (gpt-image-1 only)
snapai icon --prompt "wide web banner with company branding and call-to-action elements" --output-format webp
snapai icon --prompt "professional headshot with clean background and business attire" --output-format jpeg
```

##### Style Selection

```bash
# Minimalist design (clean, Apple-inspired)
snapai icon --prompt "minimalist calculator with clean white background and subtle blue number buttons" --style minimalism

# Glass-like aesthetic (semi-transparent, premium)
snapai icon --prompt "premium music player with glass-like equalizer bars and translucent purple elements" --style glassy

# Neon cyberpunk style (electric colors, glowing)
snapai icon --prompt "futuristic gaming app with neon laser effects and electric green glow" --style neon

# Material Design (Google's design language)
snapai icon --prompt "modern Android app with Material Design floating action button and bold orange accent" --style material

# Pixel art (retro 8-bit/16-bit gaming)
snapai icon --prompt "retro indie game with pixelated spaceship and 8-bit style starfield background" --style pixel
```

##### Quality & Moderation

```bash
# Ultra-high quality (gpt-image-1)
snapai icon --prompt "professional banking app with secure lock icon and elegant gold gradients" --quality high

# Lower content filtering (gpt-image-1 only)
snapai icon --prompt "edgy gaming app with dark theme and bold red accent colors" --moderation low
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
| `--style`         |       | See style table below                 | _none_        | Icon design style                    |
| `--prompt-only`   |       | boolean                               | `false`       | Output final prompt without generating images |


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

- `standard` - Only option available
- API does not support quality option

#### Style Guide

SnapAI offers 14 distinct visual styles to match your app's personality and target audience:

| Style                | Description                                                                                       | Best For                                          | Example Use                |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------- |
| **minimalism**       | Clean, simple lines with maximum 2-3 colors. Ultra-clean, Apple-inspired minimalism.              | Productivity apps, utilities, professional tools  | `--style minimalism`       |
| **glassy**           | Glass-like, semi-transparent elements with soft color blending. Modern, premium glass aesthetic.  | Social apps, media players, lifestyle apps        | `--style glassy`           |
| **woven**            | Textile-inspired patterns with woven textures and organic flowing lines. Warm, tactile materials. | Craft apps, lifestyle, wellness, organic products | `--style woven`            |
| **geometric**        | Only geometric shapes with bold, angular compositions. Mathematical precision and symmetry.       | Finance apps, productivity, technical tools       | `--style geometric`        |
| **neon**             | Electric neon colors with glowing effects. Cyberpunk, futuristic aesthetic.                       | Gaming apps, tech tools, nightlife apps           | `--style neon`             |
| **gradient**         | Smooth, vibrant gradients as primary design element. Modern, Instagram-inspired aesthetic.        | Social media, photo apps, creative tools          | `--style gradient`         |
| **flat**             | Solid colors, no gradients, no shadows. Clean, modern, Microsoft-inspired flat design.            | Business apps, utilities, professional tools      | `--style flat`             |
| **material**         | Google Material Design principles with bold colors and geometric shapes.                          | Android apps, Google services, productivity       | `--style material`         |
| **ios-classic**      | Traditional iOS design with subtle gradients and Apple's signature color palette.                 | iOS apps, Apple ecosystem, premium apps           | `--style ios-classic`      |
| **android-material** | Android Material Design 3 with dynamic colors and modern Android styling.                         | Android apps, Google services, modern mobile      | `--style android-material` |
| **pixel**            | Pixel-perfect, retro 8-bit/16-bit game art style with sharp, blocky pixels.                       | Indie games, retro apps, nostalgic tools          | `--style pixel`            |
| **game**             | Vibrant, energetic gaming aesthetics with bold colors and playful elements.                       | Mobile games, gaming platforms, entertainment     | `--style game`             |
| **clay**             | Soft, malleable clay-like textures with organic, handcrafted appearance.                          | Kids apps, creative tools, playful utilities      | `--style clay`             |
| **holographic**      | Iridescent, rainbow-shifting colors with metallic finishes and prismatic effects.                 | Futuristic apps, AR/VR, premium tech              | `--style holographic`      |

##### Style Examples

```bash
# Clean productivity app
snapai icon --prompt "minimalist task manager with clean white checkmark icon and subtle blue accent" --style minimalism

# Premium social media app
snapai icon --prompt "premium photo sharing app with glass-like camera icon and translucent elements" --style glassy

# Retro gaming app
snapai icon --prompt "retro space shooter with pixelated rocket ship and 8-bit style stars" --style pixel

# Modern Android app
snapai icon --prompt "modern weather app with sun and cloud icons using Material Design principles" --style android-material

# Futuristic AR app
snapai icon --prompt "futuristic augmented reality app with holographic glasses and rainbow effects" --style holographic
```

> [!TIP]
> Combine styles with different models for unique results! Try `--style neon --model dall-e-3` for creative cyberpunk designs or `--style minimalism --model gpt-image-1 --quality high` for ultra-clean professional icons.

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
# 0. Preview prompts for FREE before paying
snapai icon --prompt "fitness app concept" --style minimalism --prompt-only
snapai icon --prompt "fitness app concept" --style glassy --prompt-only
snapai icon --prompt "fitness app concept" --style neon --prompt-only

# 1. Start with DALL-E 2 for quick iterations
snapai icon --prompt "modern fitness app icon concept with dumbbell and clean design" --model dall-e-2

# 2. Test different styles with GPT-Image-1 (low cost)
snapai icon --prompt "minimalist calculator app with clean white background and blue accents" --style minimalism --model gpt-image-1 --quality low
snapai icon --prompt "premium calculator app with glass-like elements and translucent effects" --style glassy --model gpt-image-1 --quality low

# 2.1 Generate multiple variations with GPT-Image-1
snapai icon --prompt "refined app icon" --model gpt-image-1 --num-images 3

# 3. Generate multiple variations with GPT-Image-1
snapai icon --prompt "refined fitness app icon with dumbbell and energetic gradient design" --model gpt-image-1 --num-images 3 --style minimalism

# 4. Final high-quality version with DALL-E 3
snapai icon --prompt "final fitness app icon with professional dumbbell design and clean minimalist style" --model dall-e-3 --quality hd --style minimalism
```

> [!TIP]
> Use `--model dall-e-2` for testing, then `--model gpt-image-1` for style exploration and variations, and `--model dall-e-3 --quality hd` for production! Combine with `--style` for consistent visual identity. Use `--prompt-only` to preview and refine prompts for FREE before generating!

## 🚀 Advanced Usage

### CI/CD Integration

```bash
# Preview prompts in CI/CD pipelines before generation
npx snapai icon --prompt "$(cat icon-prompt.txt)" --prompt-only --style minimalism

# Perfect for automation with different models
npx snapai icon --prompt "$(cat icon-prompt.txt)" --output ./dist/icons --model gpt-image-1 --style minimalism

# Generate multiple formats for web
npx snapai icon --prompt "modern web logo with company branding and clean geometric design" --background transparent --output-format webp --output ./web-assets --style glassy

# Use in scripts to validate prompts
#!/bin/bash
PROMPT=$(cat icon-concept.txt)
echo "Testing prompt variations..."
npx snapai icon --prompt "$PROMPT" --style minimalism --prompt-only > prompts-minimal.txt
npx snapai icon --prompt "$PROMPT" --style glassy --prompt-only > prompts-glassy.txt
```

### Batch Generation

```bash
# Generate multiple variations with single command
snapai icon --prompt "modern fitness app icon variations with dumbbell and energetic design" --num-images 5 --model gpt-image-1 --output ./icons --style minimalism

# Generate different sizes for different platforms
snapai icon --prompt "vibrant social media logo with gradient background and modern typography" --size 1024x1024 --output ./social --model dall-e-3 --style gradient
snapai icon --prompt "premium banner logo with glass-like elements and translucent effects" --size 1792x1024 --output ./banners --model dall-e-3 --style glassy
```

### Professional Workflow

```bash
# 0. Prompt Design & Preview (FREE)
snapai icon --prompt "fitness app with dumbbell" --style minimalism --prompt-only
snapai icon --prompt "fitness app with dumbbell" --style glassy --prompt-only
snapai icon --prompt "fitness app with dumbbell" --style neon --prompt-only

# 1. Concept phase - quick & cheap
snapai icon --prompt "modern fitness app icon concept with dumbbell and clean geometric design" --model dall-e-2 --num-images 5

# 2. Style exploration - try different visual approaches
snapai icon --prompt "minimalist fitness app with clean white dumbbell icon and subtle blue accents" --style minimalism --model gpt-image-1
snapai icon --prompt "premium fitness app with glass-like dumbbell and translucent purple elements" --style glassy --model gpt-image-1
snapai icon --prompt "energetic fitness app with neon dumbbell and electric green glow effects" --style neon --model gpt-image-1

# 3. Refinement phase - multiple high-quality options
snapai icon --prompt "professional fitness app icon with dumbbell and clean minimalist design" --model gpt-image-1 --quality high --num-images 3 --style minimalism

# 4. Final production - transparent background for overlays
snapai icon --prompt "final fitness app icon with professional dumbbell design and clean white background" --model gpt-image-1 --background transparent --quality high --style minimalism

# 5. Platform-specific versions
snapai icon --prompt "iOS app store fitness icon with classic Apple design and subtle gradients" --model dall-e-3 --quality hd --style ios-classic
snapai icon --prompt "Android play store fitness icon with Material Design and bold colors" --model dall-e-3 --quality hd --style android-material
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
