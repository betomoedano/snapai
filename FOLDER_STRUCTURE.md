# Iconiq - Simplified MVP Folder Structure

This document describes the actual implemented folder structure for the MVP version of Iconiq.

## Current Structure

```
iconiq/
├── README.md                     # Public documentation for NPM users
├── PROJECT_PLAN.md              # Internal project planning (not published)
├── npm-publishing-strategy.md   # Internal strategy docs (not published)
├── telemetry-plan.md            # Internal telemetry docs (not published)
├── FOLDER_STRUCTURE.md          # This file (not published)
├── 
├── package.json                 # Package configuration with pnpm scripts
├── pnpm-workspace.yaml          # Monorepo workspace configuration
├── tsconfig.json                # TypeScript compiler configuration
├── webpack.config.js            # Bundling and obfuscation config (not published)
├── .npmignore                   # Exclude source files from NPM package
├── 
├── bin/
│   └── iconiq                   # CLI executable (published)
├── 
├── src/ (NOT PUBLISHED)         # Source code kept private
│   ├── index.ts                 # CLI entry point
│   ├── types.ts                 # TypeScript type definitions
│   ├── 
│   ├── commands/                # OCLIF commands
│   │   ├── icon.ts             # Main icon generation command
│   │   └── config.ts           # Configuration management command
│   ├── 
│   ├── services/               # Core business logic
│   │   ├── openai.ts           # OpenAI API integration
│   │   ├── telemetry.ts        # Anonymous usage tracking
│   │   └── config.ts           # Local configuration management
│   └── 
│   └── utils/                  # Utility functions
│       ├── validation.ts       # Input validation helpers
│       └── prompts.ts          # Prompt templates and enhancement
├── 
├── dist/ (BUILD ARTIFACT)       # Compiled TypeScript (not published)
├── bundle/ (BUILD ARTIFACT)     # Webpack bundled code (published)
└── node_modules/               # Dependencies
```

## What Gets Published to NPM

### Published Package Structure
```
npm-package/
├── bundle/
│   └── iconiq.js              # Obfuscated, bundled JavaScript
├── bin/
│   └── iconiq                 # CLI executable
├── package.json               # Package metadata only
└── README.md                  # Usage instructions
```

### Excluded from NPM (Private)
- `src/` - All TypeScript source code
- `dist/` - Compiled JavaScript
- `*.md` files (except README.md)
- Configuration files (tsconfig.json, webpack.config.js)
- Development dependencies

## Build Process

### Development Workflow
```bash
pnpm install                   # Install dependencies
pnpm run dev                   # Development with ts-node
pnpm run build                 # Compile TypeScript to dist/
pnpm run bundle                # Bundle and obfuscate to bundle/
pnpm run publish-package       # Build and publish to NPM
```

### Protection Strategy
1. **Source Code**: TypeScript source remains private
2. **Bundling**: Webpack combines all modules into single file
3. **Obfuscation**: JavaScript obfuscator scrambles code structure
4. **NPM Exclusion**: .npmignore prevents source code publication

## Key Features Implemented

### Commands
- `iconiq icon` - Generate iOS app icons with AI
- `iconiq config` - Manage API keys and settings

### Services
- **OpenAI Integration**: DALL-E 3 API with enhanced prompts
- **Configuration Management**: Local JSON config storage
- **Telemetry**: Anonymous usage tracking with opt-out

### Privacy & Security
- User-provided API keys (stored locally)
- Anonymous telemetry with clear opt-out
- Source code protection via obfuscation
- No personal data collection

## Next Steps for Development

### Phase 1 Completion
- [ ] Complete image download/save functionality
- [ ] Add error handling and retry logic
- [ ] Test build and publish process
- [ ] Set up telemetry endpoint

### Phase 2 Enhancements
- [ ] Android adaptive icon support
- [ ] Multiple icon sizes
- [ ] Batch generation
- [ ] Better prompt engineering

## Development Notes

This simplified structure focuses on shipping an MVP quickly while maintaining:
- **Privacy**: User API keys, anonymous telemetry
- **Security**: Source code protection
- **Scalability**: Monorepo structure with pnpm
- **User Experience**: Simple CLI with clear commands

The approach balances rapid development with future monetization potential through usage data collection and premium feature opportunities.