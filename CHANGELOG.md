# Changelog

All notable changes to SnapAI will be documented in this file.

## [0.2.0] - 2025-06-22

### 🎉 Open Source Release

- **BREAKING**: Removed telemetry and analytics
- **BREAKING**: Removed obfuscation for transparency
- **NEW**: Fully open source codebase
- **NEW**: CONTRIBUTING.md guide for contributors
- **IMPROVED**: Simplified codebase and build process
- **IMPROVED**: Better privacy focus - no data collection
- **IMPROVED**: Smaller bundle size (85% reduction)

### Technical Changes
- Removed `telemetry.ts` service
- Removed JavaScript obfuscation from webpack
- Simplified configuration (no telemetry settings)
- Updated documentation for open source
- Cleaner package.json and dependencies

## [0.1.0] - 2025-06-22

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