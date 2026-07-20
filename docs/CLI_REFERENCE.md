# CLI reference

[← Back to the README](../README.md) · [Icon guide](ICON_GENERATION.md) · [Feature graphic guide](FEATURE_GRAPHICS.md)

Use `npx snapai <command> --help` to see the reference installed with your current package version.

## `snapai icon`

Generates square app icon artwork at `1024x1024`.

| Flag | Short | Default | Description |
| --- | --- | --- | --- |
| `--prompt` | `-p` | Required | Description of the artwork to generate |
| `--output` | `-o` | `./assets` | Output directory |
| `--model` | `-m` | `gpt-2` | `gpt-2`, `gpt-1.5`, `gpt-1`, `banana`, or `banana-2`; official GPT Image 2 IDs are also accepted |
| `--quality` | `-q` | `auto` | OpenAI: `auto`, `high`, `medium`, `low`; Banana Pro: `1k`, `2k`, `4k` |
| `--background` | `-b` | `auto` | `transparent`, `opaque`, or `auto` for OpenAI |
| `--output-format` | `-f` | `png` | `png`, `jpeg`, or `webp` for OpenAI |
| `--output-compression` |  | API: `100` | Compression from 0 to 100 for OpenAI JPEG or WebP |
| `--n` | `-n` | `1` | Number of images, from 1 to 10 |
| `--moderation` |  | `auto` | `low` or `auto` for OpenAI |
| `--prompt-only` |  | `false` | Preview the prompt and configuration without generating |
| `--raw-prompt` | `-r` | `false` | Disable SnapAI prompt enhancement |
| `--style` | `-s` |  | Built-in style name or custom style hint |
| `--use-icon-words` | `-i` | `false` | Include “icon” and “logo” in prompt enhancement |
| `--pro` | `-P` | `false` | Use Gemini Pro with `--model banana` |
| `--thinking` |  |  | `minimal` or `max` for `banana-2` |
| `--openai-api-key` | `-k` |  | OpenAI key override for this command |
| `--google-api-key` | `-g` |  | Google key override for this command |

Notes:

- `hd` and `standard` remain supported as aliases for OpenAI `high` and `medium`.
- `gpt-2` maps to `gpt-image-2`, which does not support a transparent background.
- `gpt-image-2` and `gpt-image-2-2026-04-21` are accepted as explicit model IDs.
- Output compression is only supported with JPEG and WebP.
- Regular `banana` and `banana-2` support `-n 1`.
- `banana-2` uses 1K output. `--thinking` is ignored by every other model.
- The legacy `gpt` alias follows the current OpenAI default (`gpt-2`); `--api-key` and `--num-images` remain hidden for backward compatibility.

## `snapai feature-graphic`

Alias: `snapai fg`

Generates Google Play feature graphics at `1024x500`.

| Flag | Short | Default | Description |
| --- | --- | --- | --- |
| `--prompt` | `-p` | Required | Description of the feature graphic |
| `--output` | `-o` | `./assets` | Output directory |
| `--model` | `-m` | `gpt-2` | `gpt-2`, `gpt-1.5`, `gpt-1`, `banana`, or `banana-2`; official GPT Image 2 IDs are also accepted |
| `--quality` | `-q` | `auto` | Quality level supported by the selected model |
| `--output-format` | `-f` | `png` | `png` or `jpeg` |
| `--output-compression` |  | API: `100` | Compression from 0 to 100 for OpenAI JPEG |
| `--n` | `-n` | `1` | Number of images, from 1 to 10 |
| `--moderation` |  | `auto` | `low` or `auto` for OpenAI |
| `--prompt-only` |  | `false` | Preview the final prompt without generating |
| `--raw-prompt` | `-r` | `false` | Disable SnapAI prompt enhancement |
| `--style` | `-s` |  | Built-in style name or custom style hint |
| `--app-name` |  |  | Ask the model to include the app name |
| `--logo` |  |  | Path to a logo to composite on the banner |
| `--logo-position` |  | `left` | `left`, `center`, or `right` |
| `--thinking` |  |  | `minimal` or `max` for `banana-2` |
| `--pro` | `-P` | `false` | Use Gemini Pro with `--model banana` |
| `--openai-api-key` | `-k` |  | OpenAI key override for this command |
| `--google-api-key` | `-g` |  | Google key override for this command |

Notes:

- WebP is intentionally unavailable for Google Play feature graphics.
- `gpt-2` maps to `gpt-image-2` and uses a native `1280x640` generation size before final resizing.
- Output compression is only supported with JPEG.
- Regular `banana` and `banana-2` support `-n 1`.

## `snapai config`

| Flag | Short | Description |
| --- | --- | --- |
| `--openai-api-key` | `-k` | Save an OpenAI API key |
| `--google-api-key` | `-g` | Save a Google AI Studio API key |
| `--openai-base-url` |  | Save a custom OpenAI-compatible API base URL |
| `--show` |  | Display the current configuration with masked keys |

Running `snapai config` without flags also displays the current configuration.

## Global help

```bash
npx snapai --help
npx snapai icon --help
npx snapai feature-graphic --help
npx snapai --version
```
