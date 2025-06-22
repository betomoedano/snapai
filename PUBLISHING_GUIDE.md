# Publishing Guide for SnapAI

## Pre-Publishing Checklist

### 1. Code Quality Check
```bash
# Build and test
pnpm run build
./bin/dev.js --help
./bin/dev.js config --show
```

### 2. Version Management
```bash
# Update version (choose one)
npm version patch   # Bug fixes
npm version minor   # New features  
npm version major   # Breaking changes
```

### 3. Build for Production
```bash
# Create production build
pnpm run prepare-publish
node bundle/snapai.js --help
```

## Publishing Process

### First Time Setup
```bash
# Login to NPM
npm login
npm whoami  # Verify login
```

### Publish Release
```bash
# Preview package contents
npm pack --dry-run

# Publish to NPM
npm publish
```

### Verify Release
```bash
# Test the published package
npx snapai@latest --help

# Check it's live
npm view snapai version
```

## Quick Release Workflow
```bash
# 1. Commit changes
git add .
git commit -m "feat: add new feature"

# 2. Bump version
npm version minor

# 3. Build and publish
pnpm run prepare-publish
npm publish

# 4. Push changes and tags
git push
git push --tags
```

That's it! 🎉

## Troubleshooting

### Common Issues
```bash
# Authentication error
npm logout && npm login

# Version already exists
npm version patch && npm publish

# Test before publishing
npm pack --dry-run
```

## Monitoring
- **NPM Stats**: https://www.npmjs.com/package/snapai
- **Check versions**: `npm view snapai versions --json`

## Security Notes
- Users provide their own OpenAI API keys
- No sensitive data is collected or stored
