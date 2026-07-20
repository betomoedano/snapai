# SnapAI

![SnapAI](./test-icons/OG-SnapAI.webp)

Generate high-quality **app icon artwork** and **Google Play feature graphics** from the terminal — built for **React Native** and **Expo**.

SnapAI is a developer-friendly CLI that talks directly to:

- **OpenAI Images** (`gpt-1.5` → `gpt-image-1.5`, `gpt-1` → `gpt-image-1`, `gpt-image-2` → `gpt-image-2`)
- **Google Nano Banana** _(Gemini image models)_ — selected via `--model banana` or `--model banana-2`

Two commands, two fixed sizes:

- `snapai icon` — **square-only**, **always `1024x1024` (1:1)**, to match iOS/Android icon needs and avoid resizing headaches.
- `snapai feature-graphic` (alias `fg`) — **always `1024x500`**, sized for the Google Play Store feature graphic slot.

## Features ✨

- **Fast**: generate icons in seconds. No UI. No accounts.
- **Google Play feature graphics**: `snapai feature-graphic` (alias `fg`) generates 1024x500 banners, with optional app-name text and logo compositing.
- **Latest image models**:
  - OpenAI:
    - `gpt-1.5` _(uses `gpt-image-1.5` under the hood)_
    - `gpt-1` _(uses `gpt-image-1` under the hood)_
    - `gpt-image-2` _(OpenAI GPT Image 2; same Image API path as above)_
  - Google Nano Banana (Gemini):
    - normal: `gemini-2.5-flash-image`
    - pro: `gemini-3-pro-image-preview`
- **iOS + Android oriented**: prompt enhancement tuned for app-icon style outputs.
- **Quality controls**:
  - OpenAI: `--quality auto|high|medium|low` (aliases: `hd` → `high`, `standard` → `medium`)
  - Nano Banana Pro: `--quality 1k|2k|4k`
- **DX-friendly**: just a CLI (great for CI/CD too).
- **Privacy-first**: no telemetry, no tracking. Uses your API keys and sends requests directly to the provider you choose.

## Video tutorial 🎥

[Watch on YouTube](https://youtu.be/R4hvt8iz_rE)

[Read: Introducing Code With Beto Skills](https://codewithbeto.dev/blog/introducing-code-with-beto-skills)

## Install 📦

```bash
# Recommended (no install)
npx snapai --help

# Or install globally
npm install -g snapai
```

> **Important** 🔑  
> You need **at least one** API key:
>
> - **OpenAI** (for `gpt-1.5` → `gpt-image-1.5`, `gpt-1` → `gpt-image-1`, `gpt-image-2` → `gpt-image-2`)
> - **Google AI Studio** (for Google Nano Banana / Gemini via `--model banana`)
>
> SnapAI is **CLI-only** and sends requests **directly** to the provider you select.

## Quickstart (first icon) ⚡

```bash
npx snapai icon --prompt "minimalist weather app with sun and cloud"
```

Output defaults to `./assets` (timestamped filenames).

> **Note** 📝  
> Models can still draw the subject with **visual padding** (an empty border). This is normal.  
> SnapAI avoids forcing the words `"icon"` / `"logo"` by default to reduce padding.  
> If you want more “icon-y” framing, opt in with `--use-icon-words`.

## Providers & models (what “banana” means) 🧠

SnapAI exposes providers via `--model`:

| Provider                    | SnapAI flag              | Underlying model                   | Notes                                                     |
| --------------------------- | ------------------------ | ---------------------------------- | --------------------------------------------------------- |
| OpenAI (latest)             | `--model gpt-1.5`        | `gpt-image-1.5`                    | Always 1:1 square `1024x1024`, background/output controls |
| OpenAI (previous)           | `--model gpt-1`          | `gpt-image-1`                      | Same controls as above                                    |
| OpenAI (GPT Image 2)        | `--model gpt-image-2`    | `gpt-image-2`                      | Same size/quality/format/moderation flags; **`--background transparent` is not supported** (use `opaque` or `auto`) |
| Google Nano Banana (normal) | `--model banana`         | `gemini-2.5-flash-image`           | Always 1 image, square output                             |
| Google Nano Banana 2        | `--model banana-2`       | `gemini-3.1-flash-image-preview`   | 1 image, thinking config, 1K output                      |
| Google Nano Banana (pro)    | `--model banana --pro`   | `gemini-3-pro-image-preview`       | Quality tiers via `--quality 1k/2k/4k`, multiple via `-n` |

> **Tip** 💡  
> If you want **multiple variations** quickly, use **OpenAI** (`-n`) or **Banana Pro** (`--pro -n ...`).

## Setup 🔐

You can store keys locally (developer machine), or provide them at runtime (CI/CD).

### Local config (writes to `~/.snapai/config.json`)

```bash
snapai config --openai-api-key "sk-your-openai-api-key"
snapai config --google-api-key "your-google-ai-studio-key"

snapai config --show
```

### Custom OpenAI-compatible endpoint (optional)

Point SnapAI at an OpenAI-compatible service (Azure OpenAI, OpenRouter, a local server, etc.) instead of `api.openai.com`:

```bash
snapai config --openai-base-url "https://my-proxy.example.com/v1"

# Or via environment variable (takes precedence over the local config):
export OPENAI_BASE_URL="https://my-proxy.example.com/v1"
```

To go back to the default endpoint, remove `openai_base_url` from `~/.snapai/config.json`.

### CI/CD secrets (recommended)

Use environment variables so nothing is written to disk:

```bash
export SNAPAI_API_KEY="sk-..."
export SNAPAI_GOOGLE_API_KEY="..."

# Also supported:
# export OPENAI_API_KEY="sk-..."
# export GEMINI_API_KEY="..."
```

**GitHub Actions example:**

```yaml
- name: Generate app icon
  run: npx snapai icon --prompt "minimalist weather app with sun and cloud" --output ./assets/icons
  env:
    SNAPAI_API_KEY: ${{ secrets.SNAPAI_API_KEY }}
```

You can also pass keys per command (does not persist):

```bash
npx snapai icon --openai-api-key "sk-..." --prompt "modern app artwork"
npx snapai icon --model banana --google-api-key "..." --prompt "modern app artwork"
```

## Usage 🚀

### Common (recommended)

```bash
# Default (OpenAI)
npx snapai icon --prompt "modern fitness tracker with heart rate monitor"

# Output directory
npx snapai icon --prompt "professional banking app with secure lock" --output ./assets/icons

# Style hint (appended after enhancement)
npx snapai icon --prompt "calculator app" --style minimalism

# Preview the final generated prompt (no image generation)
npx snapai icon --prompt "calculator app" --raw-prompt --prompt-only
npx snapai icon --prompt "calculator app" --prompt-only
npx snapai icon --prompt "calculator app" --style minimalism --prompt-only
```

### OpenAI (`gpt-1.5` / `gpt-1` / `gpt-image-2`)

```bash
# Multiple variations
npx snapai icon --prompt "app icon concept" --model gpt-1.5 -n 3

# Higher quality
npx snapai icon --prompt "premium app icon" --quality high

# GPT Image 2 (same CLI; transparent background is rejected — use opaque or auto)
npx snapai icon --prompt "minimal 3D star icon, soft glossy plastic" --model gpt-image-2

# Transparent background + output format (gpt-1.5 / gpt-1 only — not gpt-image-2)
npx snapai icon --prompt "logo mark" --model gpt-1.5 --background transparent --output-format png
```

### Google Gemini (`gemini-2.5-flash-image / gemini-3-pro-image-preview`)

```bash
# Normal (1 image)
npx snapai icon --prompt "modern app artwork" --model banana

# Pro (multiple images + quality tiers)
npx snapai icon --prompt "modern app artwork" --model banana --pro --quality 2k -n 3
```

Nano Banana notes:

- **Normal mode** always generates **1 image** (no `-n`, no `--quality` tiers).
- **Pro mode** supports **multiple images** (`-n`) and **HD tiers** (`--quality 1k|2k|4k`).
- Output is always **square**.

### Feature graphics (`snapai feature-graphic` / `snapai fg`)

Generates a **1024x500** Google Play Store feature graphic using the same OpenAI/Gemini models as `icon`.

```bash
# Basic
npx snapai feature-graphic --prompt "fitness tracker app"

# Render an app name as text on the banner
npx snapai fg --prompt "fitness tracker" --app-name "FitTrack"

# Style hint + explicit model
npx snapai fg --prompt "music player" --style neon --model gpt-1.5

# Nano Banana 2, jpeg output (no webp — not accepted by Google Play)
npx snapai fg --prompt "weather app" --model banana-2 --output-format jpeg

# Composite a logo onto the banner
npx snapai fg --prompt "tracker" --logo ./assets/icon.png --logo-position left

# Preview the enhanced prompt without generating images
npx snapai fg --prompt "calculator app" --prompt-only
```

## Prompt tips (small changes, big impact) 📝

- **Describe the product first**, then the style:
  - “a finance app, shield + checkmark, modern, clean gradients”
- If you see too much empty border:
  - remove the words `"icon"` / `"logo"` (default behavior), or keep them off and be explicit about “fill the frame”
- Use `--style` for rendering/material hints (examples: `minimalism`, `material`, `pixel`, `kawaii`, `cute`, `glassy`, `neon`)

> **Note** 📝  
> If you pass `--style`, the style system is treated as a **hard constraint** and will take priority over other wording in your prompt.  
> Try to avoid prompts that _conflict_ with the chosen style (e.g. `--style minimalism` + “neon glow”), or the model may produce inconsistent results.

## Command reference 📚

### `snapai icon` flags

| Flag               | Short | Default    | Description                                                                       |
| ------------------ | ----- | ---------- | --------------------------------------------------------------------------------- |
| `--prompt`         | `-p`  | required   | Description of the icon to generate                                               |
| `--output`         | `-o`  | `./assets` | Output directory                                                                  |
| `--model`          | `-m`  | `gpt-1.5`  | `gpt-1.5`/`gpt-1`/`gpt-image-2` (OpenAI) or `banana` / `banana-2` (Google Nano Banana) |
| `--quality`        | `-q`  | `auto`     | GPT: `auto/high/medium/low` (aliases: `hd`, `standard`). Banana Pro: `1k/2k/4k`   |
| `--background`     | `-b`  | `auto`     | Background (`transparent`, `opaque`, `auto`) (OpenAI only; **`transparent` invalid for `gpt-image-2`**) |
| `--output-format`  | `-f`  | `png`      | Output format (`png`, `jpeg`, `webp`) (OpenAI only)                               |
| `--n`              | `-n`  | `1`        | Number of images (max 10). For Banana normal, must be `1`.                        |
| `--moderation`     |       | `auto`     | Content filtering (`low`, `auto`) (OpenAI only)                                   |
| `--prompt-only`    |       | `false`    | Preview final prompt + config without generating images                           |
| `--raw-prompt`     | `-r`  | `false`    | Send prompt as-is (no SnapAI enhancement/constraints). Style still applies if set |
| `--style`          | `-s`  |            | Rendering style hint appended after enhancement                                   |
| `--use-icon-words` | `-i`  | `false`    | Include `"icon"` / `"logo"` in enhancement (may increase padding)                 |
| `--pro`            | `-P`  | `false`    | Enable Nano Banana Pro (banana only)                                              |
| `--openai-api-key` | `-k`  |            | OpenAI API key override (does not persist)                                        |
| `--google-api-key` | `-g`  |            | Google API key override (does not persist)                                        |

### `snapai feature-graphic` flags (alias `fg`)

| Flag               | Short | Default    | Description                                                                       |
| ------------------ | ----- | ---------- | --------------------------------------------------------------------------------- |
| `--prompt`         | `-p`  | required   | Description of the feature graphic to generate                                   |
| `--output`         | `-o`  | `./assets` | Output directory                                                                  |
| `--model`          | `-m`  | `gpt-1.5`  | `gpt-1.5`/`gpt-1` (OpenAI) or `banana` / `banana-2` (Google Nano Banana)          |
| `--quality`        | `-q`  | `auto`     | Quality level (depends on model)                                                  |
| `--output-format`  | `-f`  | `png`      | Output format: `png` or `jpeg` (no `webp` — not accepted by Google Play)          |
| `--n`              | `-n`  | `1`        | Number of images (max 10)                                                         |
| `--moderation`     |       | `auto`     | Content filtering (`low`, `auto`) (OpenAI only)                                   |
| `--prompt-only`    |       | `false`    | Preview final prompt without generating images                                    |
| `--raw-prompt`     | `-r`  | `false`    | Send prompt as-is (no enhancement)                                                |
| `--style`          | `-s`  |            | Optional style hint                                                               |
| `--app-name`       |       |            | App name to render as text on the banner                                          |
| `--logo`           |       |            | Path to a logo file to composite onto the banner                                  |
| `--logo-position`  |       | `left`     | Logo position (`left`, `center`, `right`)                                         |
| `--thinking`       |       |            | Thinking level for `banana-2` (`minimal`, `max`)                                  |
| `--pro`            | `-P`  | `false`    | Use Gemini Pro model (`banana` only)                                              |
| `--openai-api-key` | `-k`  |            | OpenAI API key override (does not persist)                                        |
| `--google-api-key` | `-g`  |            | Google API key override (does not persist)                                        |

## Examples (real outputs) 🖼️

| Prompt                                                                  | Result                                                                                                                                                        | Command                                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `minimalist weather app with sun and cloud`                             | ![Weather Icon](<test-icons/npx snapai icon --prompt "minimalist weather app with sun and cloud" --model gpt-1.5.webp>)                                       | `npx snapai icon --prompt "minimalist weather app with sun and cloud" --model gpt-1.5`                                  |
| `premium banking app, shield + checkmark, clean gradients`              | ![Banking Icon](<test-icons/npx snapai icon --prompt "premium banking app, shield + checkmark, clean gradients" --model gpt-1.5.webp>)                        | `npx snapai icon --prompt "premium banking app, shield + checkmark, clean gradients" --model gpt-1.5`                   |
| `calendar app, simple date grid, clean illustration`                    | ![Calendar Icon](<test-icons/npx snapai icon --prompt "calendar app, simple date grid, clean illustration" --model gpt-1.webp>)                               | `npx snapai icon --prompt "calendar app, simple date grid, clean illustration" --model gpt-1`                           |
| `notes app, pen + paper, minimal, friendly`                             | ![Notes Icon](<test-icons/npx snapai icon --prompt "notes app, pen + paper, minimal, friendly" --model gpt-1.webp>)                                           | `npx snapai icon --prompt "notes app, pen + paper, minimal, friendly" --model gpt-1`                                    |
| `music player app, abstract sound wave, clean shapes`                   | ![Music Icon](<test-icons/npx snapai icon --prompt "music player app, abstract sound wave, clean shapes" --model banana.webp>)                                | `npx snapai icon --prompt "music player app, abstract sound wave, clean shapes" --model banana`                         |
| `camera app, lens icon, simple concentric circles`                      | ![Camera Icon](<test-icons/npx snapai icon --prompt "camera app, lens icon, simple concentric circles" --model banana.webp>)                                  | `npx snapai icon --prompt "camera app, lens icon, simple concentric circles" --model banana`                            |
| `finance app, secure lock, clean illustration, bold silhouette`         | ![Finance Lock Icon](<test-icons/npx snapai icon --prompt "finance app, secure lock, clean illustration, bold silhouette" --model banana --pro.webp>)         | `npx snapai icon --prompt "finance app, secure lock, clean illustration, bold silhouette" --model banana --pro`         |
| `photo editor app, magic wand + spark, simple shapes, modern gradients` | ![Photo Editor Icon](<test-icons/npx snapai icon --prompt "photo editor app, magic wand + spark, simple shapes, modern gradients" --model banana --pro.webp>) | `npx snapai icon --prompt "photo editor app, magic wand + spark, simple shapes, modern gradients" --model banana --pro` |
| `Minimal 3D star icon, soft glossy plastic, clean lighting, centered, square, no text` | ![GPT Image 2 star](<test-icons/gpt-image-2/Minimal 3D star icon, soft glossy plastic, clean lighting, centered, square, no text.webp>) | `npx snapai icon --prompt "Minimal 3D star icon, soft glossy plastic, clean lighting, centered, square, no text" --model gpt-image-2` |
| `Single smooth 3D pebble shape, subtle shine, pastel gradient, lots of empty space, app icon` | ![GPT Image 2 pebble](<test-icons/gpt-image-2/Single smooth 3D pebble shape, subtle shine, pastel gradient, lots of empty space, app icon.webp>) | `npx snapai icon --prompt "Single smooth 3D pebble shape, subtle shine, pastel gradient, lots of empty space, app icon" --model gpt-image-2` |
| `Tiny 3D crystal gem, faceted, glassy highlights, minimal, centered on plain background` | ![GPT Image 2 gem](<test-icons/gpt-image-2/Tiny 3D crystal gem, faceted, glassy highlights, minimal, centered on plain background.webp>) | `npx snapai icon --prompt "Tiny 3D crystal gem, faceted, glassy highlights, minimal, centered on plain background" --model gpt-image-2` |
| `One rounded 3D cube, isometric, soft shadows, matte-gloss mix, very simple composition` | ![GPT Image 2 cube](<test-icons/gpt-image-2/One rounded 3D cube, isometric, soft shadows, matte-gloss mix, very simple composition.webp>) | `npx snapai icon --prompt "One rounded 3D cube, isometric, soft shadows, matte-gloss mix, very simple composition" --model gpt-image-2` |
| `Minimal 3D ring or orbit shape, metallic sheen, floating in space, clean and calm` | ![GPT Image 2 orbit](<test-icons/gpt-image-2/Minimal 3D ring or orbit shape, metallic sheen, floating in space, clean and calm.webp>) | `npx snapai icon --prompt "Minimal 3D ring or orbit shape, metallic sheen, floating in space, clean and calm" --model gpt-image-2` |

## Built by Code with Beto 👋

SnapAI is made by [Beto](https://x.com/betomoedano) — I build open-source tools and teach React Native. If you're learning React Native, I have a [comprehensive course](https://cwb.sh/rn?r=snapai-readme) with real-world projects, lifetime access, and a private Discord community. Hundreds of developers are already in.

[YouTube](https://cwb.sh/youtube) · [Discord](https://cwb.sh/discord) · [Newsletter](https://cwb.sh/newsletter)

## Privacy & security 🔒

- SnapAI does **not** ship telemetry or analytics.
- SnapAI sends requests **directly** to OpenAI or Google (depending on `--model`).
- SnapAI does not run a backend and does not collect your prompts/images.
- API keys are stored locally only if you run `snapai config ...` (or provided at runtime via env vars/flags).

> **Warning** ⚠️  
> Never commit API keys to git. Use environment variables in CI.

## Development 🛠️

- [Development Setup](DEV_SETUP.md)
- [Publishing Guide](PUBLISHING_GUIDE.md)

```bash
git clone https://github.com/betomoedano/snapai.git
cd snapai && pnpm install && pnpm run build
./bin/dev.js --help
```

## Contributing 🤝

- Report bugs: [GitHub Issues](https://github.com/betomoedano/snapai/issues)
- Suggest features: [GitHub Issues](https://github.com/betomoedano/snapai/issues)
- Improve docs / code: see `CONTRIBUTING.md`

## License 📄

MIT
