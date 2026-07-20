# Google Play feature graphics

[← Back to the README](../README.md) · [CLI reference](CLI_REFERENCE.md) · [Configuration](CONFIGURATION.md)

SnapAI generates Google Play feature graphics at exactly `1024x500`. It creates the artwork with OpenAI or Gemini, then resizes it to the required store dimensions.

Use either the full command or its `fg` alias:

```bash
npx snapai feature-graphic --prompt "fitness tracker app"
npx snapai fg --prompt "fitness tracker app"
```

## Add an app name

Use `--app-name` to ask the model to render the product name as part of the banner:

```bash
npx snapai fg \
  --prompt "energetic fitness tracker with bold green gradients" \
  --app-name "FitTrack"
```

Image models can still misspell text. Inspect the result before uploading it to Google Play.

## Composite an existing logo

Use `--logo` when you already have a logo and want SnapAI to place it on the generated banner:

```bash
npx snapai fg \
  --prompt "clean productivity banner with a blue-to-purple gradient" \
  --logo ./assets/icon.png \
  --logo-position left
```

`--logo-position` accepts `left`, `center`, or `right`.

## Choose a model

Feature graphics support:

- `gpt-2` using OpenAI `gpt-image-2`
- `gpt-1.5` using OpenAI `gpt-image-1.5`
- `gpt-1` using OpenAI `gpt-image-1`
- `banana` using Gemini `gemini-2.5-flash-image`
- `banana-2` using Gemini `gemini-3.1-flash-image-preview`
- `banana --pro` using Gemini `gemini-3-pro-image-preview`

`gpt-2` is the default and SnapAI's friendly alias for `gpt-image-2`. The official `gpt-image-2` ID and `gpt-image-2-2026-04-21` snapshot are also accepted. SnapAI requests a native `1280x640` GPT Image 2 canvas before cropping and resizing it to the required `1024x500` output.

```bash
npx snapai fg \
  --prompt "weather app with dramatic clouds and clear negative space" \
  --model gpt-2
```

## Format and variations

Google Play feature graphics can be written as PNG or JPEG. WebP is intentionally unavailable for this command.

```bash
npx snapai fg \
  --prompt "travel planner with a warm editorial style" \
  --model gpt-2 \
  --output-format jpeg \
  --output-compression 85
```

`--output-compression 0-100` is available for OpenAI JPEG output. It is not supported with PNG.

OpenAI models and Banana Pro support up to 10 variations through `-n`. Regular `banana` and `banana-2` support one image.

```bash
npx snapai fg \
  --prompt "music player with an energetic neon sound wave" \
  --model gpt-1.5 \
  -n 3
```

## Prompt controls

Feature graphics support the same core prompt controls as icon generation:

- `--style` adds a built-in or custom visual direction.
- `--raw-prompt` disables SnapAI’s prompt enhancement.
- `--prompt-only` previews the final prompt without generating an image.

```bash
npx snapai fg \
  --prompt "calculator app" \
  --style minimalism \
  --prompt-only
```

## Design tips

- Keep the core subject away from the edges so resizing does not make the composition feel cramped.
- Leave deliberate negative space for a logo or app name.
- Use a short app name if asking the model to render text.
- Prefer `--logo` for an existing brand mark instead of asking the model to recreate it.
- Preview the enhanced prompt with `--prompt-only` before generating expensive variations.

For every option, see the [`snapai feature-graphic` flag reference](CLI_REFERENCE.md#snapai-feature-graphic).
