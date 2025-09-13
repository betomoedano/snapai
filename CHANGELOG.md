# Changelog

All notable changes to SnapAI will be documented in this file.

## [0.4.1] - 2025-09-13

#### Improvements

- **Enhanced DALL-E model response handling**:
  - Added base64 response format (`b64_json`) for DALL-E models
  - Improved image data handling for better reliability
  - Ensures consistent response format across DALL-E 2 and DALL-E 3
- **Fixed DALL-E 2 quality parameter handling**:
  - Removed default "auto" quality assignment for DALL-E 2
  - Added validation to reject any quality parameter for DALL-E 2
  - Ensured quality parameter is never sent in DALL-E 2 API requests
  - Fixed TypeScript typing issues in parameter validation
- **Possible fix for #11**:
  - Possible fix for unsupported esm url issue on windows (need to confirm with windows users)

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
