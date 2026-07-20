# Configuration, CI, and security

[← Back to the README](../README.md) · [Icon guide](ICON_GENERATION.md) · [Feature graphic guide](FEATURE_GRAPHICS.md)

SnapAI calls OpenAI or Google directly. It does not use a SnapAI backend, and it only needs the API key for the provider you choose.

## Local configuration

Store keys in `~/.snapai/config.json`:

```bash
snapai config --openai-api-key "sk-your-openai-api-key"
snapai config --google-api-key "your-google-ai-studio-key"
snapai config --show
```

`config --show` masks saved API keys.

## Environment variables

Environment variables are a better fit for CI and other temporary environments:

```bash
export SNAPAI_API_KEY="sk-..."
export SNAPAI_GOOGLE_API_KEY="..."
```

The provider-specific names are also supported:

```bash
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."
```

## Per-command keys

Pass a key for one command without writing it to disk:

```bash
npx snapai icon \
  --openai-api-key "sk-..." \
  --prompt "modern app artwork"

npx snapai icon \
  --model banana \
  --google-api-key "..." \
  --prompt "modern app artwork"
```

## Key precedence

SnapAI resolves credentials in this order:

| Provider | Highest to lowest priority |
| --- | --- |
| OpenAI | `--openai-api-key` → `SNAPAI_API_KEY` → `OPENAI_API_KEY` → local config |
| Google | `--google-api-key` → `SNAPAI_GOOGLE_API_KEY` → `GEMINI_API_KEY` → local config |

## Custom OpenAI-compatible endpoint

Point the OpenAI client at a compatible proxy, gateway, or local service:

```bash
snapai config --openai-base-url "https://my-proxy.example.com/v1"
```

Or set an environment variable, which takes precedence over local configuration:

```bash
export OPENAI_BASE_URL="https://my-proxy.example.com/v1"
```

To return to the default OpenAI endpoint, remove `openai_base_url` from `~/.snapai/config.json`.

Compatibility depends on whether the endpoint implements the image generation API and parameters used by the selected model.

## GitHub Actions

Store your API key as a repository secret, then expose it only to the generation step:

```yaml
- name: Generate app icon
  run: >
    npx snapai icon
    --prompt "minimalist weather app with sun and cloud"
    --output ./assets/icons
  env:
    SNAPAI_API_KEY: ${{ secrets.SNAPAI_API_KEY }}
```

The same pattern works with `SNAPAI_GOOGLE_API_KEY` and a Gemini model.

## Privacy and security

- SnapAI ships without telemetry or analytics.
- Prompts and images go directly between your machine and the selected provider.
- SnapAI does not run a backend and does not collect your prompts or generated files.
- Keys are only stored when you run `snapai config ...`.
- Never commit API keys or `~/.snapai/config.json` to Git.

See the [CLI reference](CLI_REFERENCE.md#snapai-config) for all configuration flags.
