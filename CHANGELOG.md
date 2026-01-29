# Changelog

All notable changes to SnapAI will be documented in this file.

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
