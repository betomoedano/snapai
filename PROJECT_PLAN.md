# Iconiq - AI Icon Generation CLI Tool

## Project Overview
Iconiq is a simplified CLI tool built with OCLIF that generates high-quality app icons using OpenAI's DALL-E 3 API. Users provide their own OpenAI API keys, making it free to use while we gather usage data for future monetization.

## Key Features (MVP)
- Generate iOS app icons (1024x1024px)
- User provides their own OpenAI API key
- Save icons directly to project assets folder  
- Support for custom prompts
- Basic usage telemetry (anonymous)
- Simple configuration management

## Simplified Project Structure (MVP)
```
iconiq/
├── src/
│   ├── commands/
│   │   └── icon.ts        # Main icon generation command
│   ├── services/
│   │   ├── openai.ts      # OpenAI API integration
│   │   ├── telemetry.ts   # Anonymous usage tracking
│   │   └── config.ts      # API key management
│   ├── utils/
│   │   ├── prompts.ts     # iOS icon prompt templates
│   │   └── validation.ts  # Input validation
│   ├── types.ts           # TypeScript definitions
│   └── index.ts           # Entry point
├── dist/                  # Compiled JS (published to NPM)
├── package.json
├── tsconfig.json
├── .npmignore             # Exclude source files from NPM
├── webpack.config.js      # Bundle and obfuscate for NPM
└── README.md
```

## CLI Usage Examples
```bash
# First time setup (add OpenAI API key)
npx iconiq config --api-key sk-your-openai-api-key

# Generate iOS icon
npx iconiq icon --prompt "minimalist calculator app icon"

# Custom output directory
npx iconiq icon --prompt "fitness tracker app" --output ./assets/icons

# Different sizes (future)
npx iconiq icon --prompt "..." --size 512
```

## Technical Implementation

### User API Key Approach
- Users provide their own OpenAI API key
- API keys stored locally in config file (~/.iconiq/config.json)
- No cost to users beyond their OpenAI API usage
- Users pay OpenAI directly: $0.04 per 1024x1024 image

### Anonymous Telemetry
- Track usage patterns (anonymous)
- Number of generations per day/week
- Popular prompt patterns
- Error rates and success metrics
- No personal data or API keys collected

### Private Source Code + NPM Publishing Strategy
**Build Process:**
1. Compile TypeScript to JavaScript
2. Bundle with Webpack into single file
3. Obfuscate compiled code
4. Publish only `/dist` folder to NPM
5. Exclude `/src` via `.npmignore`

**Protection Methods:**
- Source code remains private in repository
- NPM package contains only compiled/obfuscated code
- Webpack bundle obscures internal structure
- TypeScript definitions removed from published package

## Development Phases

### Phase 1: MVP (Weekend Project)
- [x] Project planning and structure
- [ ] Basic OCLIF setup with TypeScript
- [ ] OpenAI API integration with user keys
- [ ] iOS icon generation (1024x1024)
- [ ] Local config management
- [ ] Basic telemetry implementation
- [ ] Build/bundle process for NPM

### Phase 2: Enhancement (Future)
- Android adaptive icons
- Multiple icon sizes
- Better prompt engineering
- Enhanced error handling
- Usage analytics dashboard

### Phase 3: Monetization (Future)
- Analyze telemetry data
- Implement paid tiers
- Premium prompt templates
- Bulk generation features

## Build & Publish Strategy

### Development
```bash
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm run bundle       # Webpack bundle + obfuscation
npm run publish      # Publish to NPM
```

### NPM Package Structure
```
published-package/
├── dist/
│   └── index.js     # Bundled + obfuscated
├── bin/
│   └── iconiq       # CLI executable
├── package.json     # Minimal dependencies
└── README.md        # Usage instructions only
```

## Success Metrics (Future)
- Weekly active users
- Generation success rate
- Popular prompt patterns
- Geographic usage distribution
- CLI adoption in Expo projects

## Technical Stack
- **CLI Framework**: OCLIF
- **Language**: TypeScript
- **AI Service**: OpenAI DALL-E 3 API
- **Bundling**: Webpack + JavaScript Obfuscator
- **Config**: Local JSON files
- **Telemetry**: Simple HTTP POST (anonymous)