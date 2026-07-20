# App icon generation

[← Back to the README](../README.md) · [CLI reference](CLI_REFERENCE.md) · [Examples](EXAMPLES.md)

SnapAI generates square app icon artwork at `1024x1024`. The prompt enhancer is tuned for mobile app artwork and avoids adding rounded corners, UI mockups, or device frames.

## Basic usage

```bash
npx snapai icon --prompt "minimalist weather app with sun and cloud"
```

Images are saved to `./assets` by default. Use `--output` to choose another directory:

```bash
npx snapai icon \
  --prompt "professional banking app with secure lock" \
  --output ./assets/icons
```

## Use SnapAI with an AI agent

The easiest way to use SnapAI in an Expo project is through the [Code with Beto App Icon skill](https://github.com/Code-with-Beto/skills/tree/main/plugins/cwb-app-icon). The skill generates the artwork with SnapAI, prepares the iOS 26 `.icon` folder and Android adaptive icon assets, and updates your Expo configuration.

### Any skills-compatible agent

```bash
npx skills add https://github.com/code-with-beto/skills --skill app-icon
```

You can run that command directly or give it to your agent. After installation, ask for the result in natural language:

```text
Create an app icon for my Expo app. It is a personal finance app that should
feel trustworthy and modern. Show me a few concepts, then configure the
selected icon for iOS and Android.
```

### Codex

Add the Code with Beto marketplace:

```bash
codex plugin marketplace add Code-with-Beto/skills
```

Run `/plugins`, install the App Icon plugin from the **Code with Beto** marketplace, and start a new session.

### Claude Code

Run these commands inside Claude Code:

```text
/plugin marketplace add Code-with-Beto/skills
/plugin install cwb-app-icon@cwb-plugins
```

For the complete platform workflow and advanced Expo icon setup, read the [App Icon plugin documentation](https://github.com/Code-with-Beto/skills/blob/main/plugins/cwb-app-icon/README.md).

## Models

| SnapAI option | Provider model | Variations | Notes |
| --- | --- | ---: | --- |
| `--model gpt-2` | `gpt-image-2` | Up to 10 | Default OpenAI model; no transparent backgrounds |
| `--model gpt-1.5` | `gpt-image-1.5` | Up to 10 | Previous OpenAI generation |
| `--model gpt-1` | `gpt-image-1` | Up to 10 | Previous OpenAI generation |
| `--model banana` | `gemini-2.5-flash-image` | 1 | Fast Gemini generation |
| `--model banana-2` | `gemini-3.1-flash-image-preview` | 1 | Supports `--thinking minimal|max` |
| `--model banana --pro` | `gemini-3-pro-image-preview` | Up to 10 | Supports `1k`, `2k`, and `4k` quality |

`gpt-2` is SnapAI's friendly alias for `gpt-image-2`. You can also pass the official `gpt-image-2` ID or the pinned `gpt-image-2-2026-04-21` snapshot.

See [configuration](CONFIGURATION.md) for API key setup and precedence.

## Generate variations

OpenAI models and Banana Pro can generate multiple options:

```bash
npx snapai icon \
  --prompt "fitness tracker with a heart-rate symbol" \
  --model gpt-1.5 \
  -n 3

npx snapai icon \
  --prompt "friendly budgeting app" \
  --model banana \
  --pro \
  --quality 2k \
  -n 3
```

Regular `banana` and `banana-2` generation support one image per command.

## Quality, background, and format

OpenAI models accept `--quality auto|high|medium|low`. The older aliases `hd` and `standard` map to `high` and `medium`.

```bash
npx snapai icon \
  --prompt "premium finance app, shield and checkmark" \
  --quality high
```

OpenAI also supports `png`, `jpeg`, and `webp`, plus background controls:

```bash
npx snapai icon \
  --prompt "simple leaf mark" \
  --model gpt-1.5 \
  --background transparent \
  --output-format png
```

JPEG and WebP output can use `--output-compression 0-100`:

```bash
npx snapai icon \
  --prompt "minimal 3D star with soft studio lighting" \
  --model gpt-2 \
  --output-format webp \
  --output-compression 80
```

`gpt-2` rejects `--background transparent`; use `opaque` or `auto`. Output compression is not supported with PNG.

GPT Image 2 supports flexible image dimensions, but `snapai icon` intentionally keeps the request at `1024x1024` so generated icon artwork remains square.

## Prompt enhancement

By default, SnapAI expands your prompt with constraints that help image models create usable app artwork. It also avoids forcing the words “icon” and “logo,” which can cause extra visual padding.

Add `--use-icon-words` when you specifically want icon or logo framing:

```bash
npx snapai icon \
  --prompt "music player with an abstract sound wave" \
  --use-icon-words
```

### Preview before spending credits

`--prompt-only` prints the final prompt and resolved configuration without calling an image provider:

```bash
npx snapai icon \
  --prompt "calculator app" \
  --style minimalism \
  --prompt-only
```

### Use the prompt exactly as written

`--raw-prompt` disables SnapAI’s normal prompt enhancement. A supplied `--style` is still applied as a dominant constraint.

```bash
npx snapai icon \
  --prompt "a single red circle centered on a cream background" \
  --raw-prompt
```

## Styles

Use `--style` with one of the built-in presets or a custom rendering hint:

```bash
npx snapai icon --prompt "calculator app" --style minimalism
npx snapai icon --prompt "music player" --style glassy
npx snapai icon --prompt "weather app" --style neon
```

Built-in styles:

`minimalism`, `glassy`, `woven`, `geometric`, `neon`, `gradient`, `flat`, `material`, `ios-classic`, `android-material`, `pixel`, `game`, `clay`, `holographic`, `kawaii`, and `cute`.

The chosen style takes priority over conflicting prompt language. For example, avoid combining `--style minimalism` with a request for neon glow.

## Prompt tips

- Describe the product first, then its visual direction: “a finance app, shield and checkmark, clean gradients.”
- Prefer one dominant symbol over a list of unrelated objects.
- If the result has too much empty space, remove “icon” and “logo” from your prompt and ask the artwork to fill the frame.
- Use `--prompt-only` to inspect the enhanced prompt while iterating.
- Start at the default quality, then increase quality once the concept is right.

For every option, see the [`snapai icon` flag reference](CLI_REFERENCE.md#snapai-icon).
