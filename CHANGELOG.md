# Changelog

All notable changes to SnapAI will be documented in this file.

## [0.6.0] - 2026-02-11

### 🤖 Multi-Provider Support & Prompt Preview

#### New Features

- **Google Gemini Integration**: Generate icons with Gemini alongside OpenAI
  - `--model banana` for Gemini 2.5 Flash Image generation
  - `--pro` flag to use Gemini 3 Pro Image Preview for higher quality
  - `--google-api-key` flag and `GEMINI_API_KEY` / `SNAPAI_GOOGLE_API_KEY` env vars
  - Quality tiers for Gemini Pro: `--quality 1k|2k|4k`

- **Prompt-Only Mode**: Preview prompts before spending API credits
  - `--prompt-only` flag shows the final enhanced prompt/config without generating images
  - Works with all flags (`--style`, `--raw-prompt`, etc.) for easy prompt iteration

- **Google API Key Management**: `snapai config --google-api-key` to store and manage Gemini keys alongside OpenAI keys

- **GitHub Actions CI/CD**: Automated npm publishing workflow
  - Publishes on GitHub release events
  - Automatic `beta` dist-tag for pre-releases
  - Manual `workflow_dispatch` trigger with custom dist-tag

#### Improvements

- **Updated Model Naming**: Clearer model aliases
  - `gpt-1.5` (default, best quality), `gpt-1` (fast), `banana` (Gemini)
  - Legacy alias `gpt` still supported for backward compatibility

- **Refactored Prompt Engine**: Shared context and technical rules for more consistent icon output
  - Design constraints prevent common failures (no rounded corners, no UI elements)
  - Better platform-specific prompt enhancement
  - Style applied as dominant constraint when combined with `--raw-prompt`

- **Expanded Style System**: Style flag now accepts any string hint, beyond the built-in presets
  - Massively expanded style templates with richer descriptions
  - Dangerous style detection blocks photorealistic/portrait requests

- **Improved CLI Flags**:
  - `-r` shorthand for `--raw-prompt`
  - `-s` shorthand for `--style`
  - `-i` / `--use-icon-words` to optionally include "icon"/"logo" in the enhancer
  - `-n` shorthand for image count (replaces `--num-images`)
  - `-k` / `--openai-api-key` replaces `--api-key` (old flag kept as hidden alias)

- **ESLint Configuration**: Added `.eslintrc.cjs` for consistent code quality

#### Breaking Changes

- Deprecated size options removed — output is always 1024x1024
- `--api-key` flag renamed to `--openai-api-key` (old flag still works but is hidden)
- `--num-images` flag replaced by `-n` / `--n` (old flag still works but is hidden)
- Icon composer command and related utilities removed

#### Technical

- New `GeminiService` with streaming support and binary image extraction
- `buildFinalIconPrompt` utility for unified prompt generation across providers
- Google API key validation in `ValidationService`
- TypeScript interfaces for Gemini options and binary image types
- Removed `pngjs` dependency

## [0.5.0] - 2025-09-15 🇲🇽

### 🎨 Style System & Enhanced Prompts

#### New Features

- **Style System**: distinct visual styles for icon generation
  - `--style` presets: minimalism, glassy, woven, geometric, neon, gradient, flat, material, ios-classic, android-material, pixel, game, clay, holographic, kawaii, cute
  - Style-specific prompt enhancement for consistent visual identity
  - Intelligent style descriptions and use case recommendations

- **Enhanced Prompt Examples**: Comprehensive documentation improvements
  - More descriptive and detailed prompt examples throughout documentation
  - Style-specific examples in "See It In Action" section
  - Professional workflow examples with style exploration
  - Cost optimization tips including style testing

#### Improvements

- **Better Documentation**:
  - Added comprehensive Style Guide with all 14 styles
  - Enhanced command reference with style flag
  - Updated all workflow examples with descriptive prompts
  - Added style examples to CI/CD and batch generation sections

- **Enhanced User Experience**:
  - More descriptive prompts help users create better icons
  - Style-specific examples show visual differences clearly
  - Professional workflow includes style exploration phase

#### Technical

- Style templates with intelligent prompt enhancement
- TypeScript interfaces for style system
- Style validation and description system

## [0.3.1] - 2025-06-22

### 🚀 Initial Release

- **NEW**: AI-powered icon generation using OpenAI image models
- **NEW**: OCLIF v4 based CLI
- **NEW**: Local API key management
- **NEW**: Square icon output (1024x1024)
- **NEW**: Quality options (standard/HD)
- **NEW**: Enhanced prompts for iOS-style icons
- **NEW**: TypeScript codebase with full type safety

### Commands

- `snapai icon` - Generate app icons with AI
- `snapai config` - Manage OpenAI API key and settings

### Features

- Base64 image handling (no temporary URLs)
- Custom output directories
- Input validation
- Error handling and user-friendly messages
- Cross-platform support (Node.js 18+)
