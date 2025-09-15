# Changelog

All notable changes to SnapAI will be documented in this file.

## [UNRELEASED] - 2025-09-15 🇲🇽

### 🎨 Style System & Enhanced Prompts

#### New Features

- **Style System**: 14 distinct visual styles for icon generation

  - `--style` flag with options: minimalism, glassy, woven, geometric, neon, gradient, flat, material, ios-classic, android-material, pixel, game, clay, holographic
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

## [0.4.0] - 2025-07-05

### 🎨 Multi-Model Support & Advanced Features

#### New Features

- **Multi-Model Support**: Choose between GPT-Image-1, DALL-E 3, and DALL-E 2

  - `--model` flag to select AI model (default: gpt-image-1)
  - Model-specific parameter validation
  - Intelligent quality mapping per model

- **Enhanced Size Options**: Expanded size support

  - Added 256x256, 512x512 for DALL-E 2
  - Added 1792x1024, 1024x1792 for DALL-E 3
  - Added 'auto' size option for GPT-Image-1

- **Advanced Image Options**:

  - `--background`: Transparent/opaque backgrounds (GPT-Image-1 only)
  - `--output-format`: PNG, JPEG, WebP support (GPT-Image-1 only)
  - `--num-images`: Generate 1-10 variations in one command
  - `--moderation`: Content filtering levels (GPT-Image-1 only)

- **Quality Control**: Expanded quality options
  - auto, high, medium, low for GPT-Image-1
  - standard, hd for DALL-E 3
  - Model-appropriate quality defaults

#### Improvements

- **Better CLI Help**: Reorganized help text with grouped flags and clearer descriptions
- **Enhanced Documentation**: Comprehensive README with model comparison tables and cost guides
- **Multiple Image Support**: Proper file naming when generating multiple images
- **Improved UX**: Branding message now appears during generation (when users are waiting)

#### Technical

- Strong TypeScript interfaces for all new parameters
- Model-specific parameter validation
- Better error messages for invalid parameter combinations

## [0.3.1] - 2025-06-22

### 🚀 Initial Release

- **NEW**: AI-powered icon generation using OpenAI's gpt-image-1
- **NEW**: OCLIF v4 based CLI
- **NEW**: Local API key management
- **NEW**: Support for multiple icon sizes (1024x1024, 1536x1024, 1024x1536)
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
