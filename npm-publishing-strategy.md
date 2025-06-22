# Private Source Code + NPM Publishing Strategy

## Overview
This document outlines how to keep your source code private while publishing a functional CLI tool to NPM. The approach uses compilation, bundling, and obfuscation to protect intellectual property.

## Key Files for NPM Publishing Protection

### 1. `.npmignore`
```
# Source code (keep private)
src/
*.ts
tsconfig.json
webpack.config.js

# Development files
.env*
.vscode/
*.log
node_modules/
coverage/

# Documentation (optional - keep private)
docs/
PROJECT_PLAN.md
npm-publishing-strategy.md

# Only publish compiled code
!dist/
!bin/
!package.json
!README.md
```

### 2. `webpack.config.js` (Bundle + Obfuscate)
```javascript
const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'iconiq.js',
    library: {
      type: 'commonjs2'
    }
  },
  externals: {
    // Keep these as external dependencies
    '@oclif/core': '@oclif/core',
    '@oclif/plugin-help': '@oclif/plugin-help',
    'openai': 'openai'
  },
  plugins: [
    new JavaScriptObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.8,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    }, [])
  ],
  resolve: {
    extensions: ['.js']
  }
};
```

### 3. `package.json` Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "bundle": "webpack --config webpack.config.js",
    "prepare-publish": "npm run build && npm run bundle",
    "publish-package": "npm run prepare-publish && npm publish",
    "dev": "ts-node src/index.ts"
  }
}
```

### 4. `tsconfig.json` (Production Build)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": false,
    "sourceMap": false,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "bundle"]
}
```

## Publishing Workflow

### Step 1: Development
```bash
# Normal development with TypeScript
npm run dev
```

### Step 2: Build for Production
```bash
# Compile TypeScript to JavaScript
npm run build

# Bundle and obfuscate
npm run bundle
```

### Step 3: Publish to NPM
```bash
# Prepare and publish
npm run publish-package
```

## What Gets Published to NPM

### Published Structure
```
your-npm-package/
├── bundle/
│   └── iconiq.js           # Obfuscated bundle
├── bin/
│   └── iconiq              # CLI executable
├── package.json            # Package metadata only
└── README.md               # Usage instructions
```

### What's Excluded (Stays Private)
- `src/` - All TypeScript source code
- `dist/` - Compiled JavaScript (pre-bundle)
- `tsconfig.json` - TypeScript configuration
- `webpack.config.js` - Build configuration
- Development documentation
- Environment files

## Protection Level Analysis

### What's Protected ✅
- Original TypeScript source code
- File structure and organization
- Comments and documentation
- Development configurations
- Internal variable names (obfuscated)
- String literals (encoded)

### What's Still Visible ❌
- NPM package dependencies
- CLI command structure (help text)
- Public API surface
- External API calls (to OpenAI)
- General application flow

## Additional Security Measures

### 1. License Protection
Add restrictive license to discourage copying:
```json
// package.json
{
  "license": "UNLICENSED",
  "private": false
}
```

### 2. Dependency Minimization
Keep external dependencies minimal in published package:
```json
{
  "dependencies": {
    "@oclif/core": "^2.0.0",
    "openai": "^4.0.0"
  }
}
```

### 3. Runtime Validation
Add checks in obfuscated code to detect tampering:
```javascript
// In your bundled code (before obfuscation)
const validateRuntime = () => {
  if (process.env.NODE_ENV === 'development') return;
  // Add integrity checks
};
```

## Monitoring Usage

### Telemetry Implementation
Even with obfuscation, you can track usage:
```javascript
// Simple anonymous telemetry
const trackUsage = async (command, success) => {
  try {
    await fetch('https://your-analytics-endpoint.com/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command,
        success,
        timestamp: Date.now(),
        version: process.env.npm_package_version
      })
    });
  } catch (e) {
    // Fail silently
  }
};
```

## Future Monetization Path

### Phase 1: Free with Telemetry
- Users provide API keys
- Track usage anonymously
- Build user base

### Phase 2: Freemium Model
- Keep basic features free
- Add premium features requiring server-side API
- Offer hosted API key management

### Phase 3: Full SaaS
- Move core logic to server-side API
- CLI becomes thin client
- Full usage-based billing

## Risk Assessment

### Low Risk
- Casual copying deterred by obfuscation
- Source code structure hidden
- Development process protected

### Medium Risk
- Determined developers can reverse engineer
- Core algorithm logic may be discoverable
- Dependencies reveal technology choices

### Mitigation Strategies
1. Keep critical IP in future server-side components
2. Use this as MVP to validate market
3. Build brand recognition early
4. Create network effects with user community

This strategy balances protection with accessibility, allowing you to ship quickly while maintaining some intellectual property protection.