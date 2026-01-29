# SnapAI

![SnapAI](./test-icons/OG-SnapAI.webp)

Generate high-quality **square app icon artwork** from the terminal — built for **React Native** and **Expo**.

SnapAI is a developer-friendly CLI that talks directly to:

- **OpenAI Images** (`gpt-1.5` → `gpt-image-1.5`, `gpt-1` → `gpt-image-1`)
- **Google Nano Banana** _(Gemini image models)_ — selected via `--model banana`

The workflow is intentionally **square-only**: **always `1024x1024` (1:1)** to match iOS/Android icon needs and avoid resizing headaches.

## Features ✨

- **Fast**: generate icons in seconds. No UI. No accounts.
- **Latest image models**:
  - OpenAI:
    - `gpt-1.5` _(uses `gpt-image-1.5` under the hood)_
    - `gpt-1` _(uses `gpt-image-1` under the hood)_
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
> - **OpenAI** (for `gpt-1.5` → `gpt-image-1.5`, `gpt-1` → `gpt-image-1`)
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

| Provider                    | SnapAI flag            | Underlying model             | Notes                                                     |
| --------------------------- | ---------------------- | ---------------------------- | --------------------------------------------------------- |
| OpenAI (latest)             | `--model gpt-1.5`      | `gpt-image-1.5`              | Always 1:1 square `1024x1024`, background/output controls |
| OpenAI (previous)           | `--model gpt-1`        | `gpt-image-1`                | Same controls as above                                    |
| Google Nano Banana (normal) | `--model banana`       | `gemini-2.5-flash-image`     | Always 1 image, square output                             |
| Google Nano Banana (pro)    | `--model banana --pro` | `gemini-3-pro-image-preview` | Quality tiers via `--quality 1k/2k/4k`, multiple via `-n` |

> **Tip** 💡  
> If you want **multiple variations** quickly, use **OpenAI** (`-n`) or **Banana Pro** (`--pro -n ...`).

## Setup 🔐

You can store keys locally (developer machine), or provide them at runtime (CI/CD).

### Local config (writes to `~/.snapai/config.json`)

```bash
snapai config --api-key "sk-your-openai-api-key"
snapai config --google-api-key "your-google-ai-studio-key"

snapai config --show
```

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
```

### OpenAI (`gpt-1.5` / `gpt-1`)

```bash
# Multiple variations
npx snapai icon --prompt "app icon concept" --model gpt-1.5 -n 3

# Higher quality
npx snapai icon --prompt "premium app icon" --quality high

# Transparent background + output format
npx snapai icon --prompt "logo mark" --background transparent --output-format png
```

### Google Nano Banana (`--model banana`)

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

## Prompt tips (small changes, big impact) 📝

- **Describe the product first**, then the style:
  - “a finance app, shield + checkmark, modern, clean gradients”
- If you see too much empty border:
  - remove the words `"icon"` / `"logo"` (default behavior), or keep them off and be explicit about “fill the frame”
- Use `--style` for rendering/material hints (examples: `minimalism`, `material`, `pixel`, `kawaii`, `cute`, `glassy`, `neon`)

## Command reference 📚

### `snapai icon` flags

| Flag               | Short | Default    | Description                                                                     |
| ------------------ | ----- | ---------- | ------------------------------------------------------------------------------- |
| `--prompt`         | `-p`  | required   | Description of the icon to generate                                             |
| `--output`         | `-o`  | `./assets` | Output directory                                                                |
| `--model`          | `-m`  | `gpt-1.5`  | `gpt-1.5`/`gpt-1` (OpenAI) or `banana` (Google Nano Banana)                     |
| `--quality`        | `-q`  | `auto`     | GPT: `auto/high/medium/low` (aliases: `hd`, `standard`). Banana Pro: `1k/2k/4k` |
| `--background`     | `-b`  | `auto`     | Background (`transparent`, `opaque`, `auto`) (OpenAI only)                      |
| `--output-format`  | `-f`  | `png`      | Output format (`png`, `jpeg`, `webp`) (OpenAI only)                             |
| `--n`              | `-n`  | `1`        | Number of images (max 10). For Banana normal, must be `1`.                      |
| `--moderation`     |       | `auto`     | Content filtering (`low`, `auto`) (OpenAI only)                                 |
| `--raw-prompt`     | `-r`  | `false`    | Skip SnapAI prompt enhancement                                                  |
| `--style`          | `-s`  |            | Rendering style hint appended after enhancement                                 |
| `--use-icon-words` | `-i`  | `false`    | Include `"icon"` / `"logo"` in enhancement (may increase padding)               |
| `--pro`            | `-P`  | `false`    | Enable Nano Banana Pro (banana only)                                            |
| `--openai-api-key` | `-k`  |            | OpenAI API key override (does not persist)                                      |
| `--google-api-key` | `-g`  |            | Google API key override (does not persist)                                      |

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
