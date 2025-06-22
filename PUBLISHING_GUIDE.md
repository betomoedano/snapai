# Publishing Guide for SnapAI

## Pre-Publishing Checklist

### 1. Code Quality Check
```bash
# Lint and type check
pnpm run lint
pnpm run build

# Test all commands
./bin/dev.js --help
./bin/dev.js config --help
./bin/dev.js icon --help
./bin/dev.js config --show
```

### 2. Version Management
Update version in `package.json` following semantic versioning:
- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

```bash
# Update version (choose one)
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0  
npm version major   # 0.1.0 → 1.0.0
```

### 3. Build for Production
```bash
# Clean previous builds
pnpm run clean

# Build TypeScript
pnpm run build

# Create bundled/obfuscated version
pnpm run bundle

# Test bundled version
node bundle/snapai.js --help
```

## Publishing Process

### Initial NPM Setup (First Time Only)

1. **Create NPM Account**
   - Visit https://www.npmjs.com/signup
   - Verify email address

2. **Login to NPM**
   ```bash
   npm login
   # Enter username, password, email, and 2FA if enabled
   ```

3. **Verify Login**
   ```bash
   npm whoami
   # Should show your username
   ```

### Publishing Steps

#### Option 1: Manual Publishing (Recommended for first release)

```bash
# 1. Final quality check
pnpm run build
pnpm run bundle

# 2. Test what will be published
npm pack --dry-run

# 3. Review package contents
npm pack
tar -tzf snapai-*.tgz
rm snapai-*.tgz

# 4. Publish to NPM
npm publish

# For scoped packages (if using @username/snapai):
# npm publish --access public
```

#### Option 2: Automated Publishing Script

```bash
# Use the prepared script
pnpm run publish-package
```

### Post-Publishing Verification

1. **Check NPM Registry**
   ```bash
   npm view snapai
   npm view snapai versions --json
   ```

2. **Test Installation**
   ```bash
   # In a different directory
   cd /tmp
   npx snapai@latest --help
   
   # Or install globally
   npm install -g snapai@latest
   snapai --help
   ```

3. **Verify Package Contents**
   ```bash
   npm pack snapai@latest
   tar -tzf snapai-*.tgz
   ```

## Updating and Re-Publishing

### 1. Version Bump Process

```bash
# After making changes
git add .
git commit -m "feat: add new feature"

# Bump version automatically
npm version patch  # or minor/major
# This creates a git tag automatically

# Push changes and tags
git push
git push --tags
```

### 2. Re-publish Updated Version

```bash
# Build and test
pnpm run build
pnpm run bundle
./bin/dev.js --help

# Publish new version
npm publish
```

### 3. Update Documentation

Update README.md with:
- New features
- Breaking changes
- Migration guide (if needed)

## File Structure for Publishing

### What Gets Published (via .npmignore)
```
snapai/
├── bundle/
│   └── snapai.js           # Obfuscated bundle (main executable)
├── bin/
│   ├── dev.js              # Development binary
│   └── run.js              # Production binary
├── package.json            # Package metadata
├── README.md               # User documentation
└── LICENSE                 # License file
```

### What Stays Private (excluded by .npmignore)
```
snapai/
├── src/                    # Source TypeScript code
├── dist/                   # Compiled JavaScript
├── *.md (except README)    # Internal documentation
├── tsconfig.json           # TypeScript config
├── webpack.config.js       # Build configuration
├── dev-cli.js              # Development wrapper
└── Development files       # Tests, configs, etc.
```

## Troubleshooting

### Common Publishing Issues

1. **Authentication Errors**
   ```bash
   npm logout
   npm login
   ```

2. **Version Already Exists**
   ```bash
   npm version patch  # Bump version first
   npm publish
   ```

3. **Package Name Taken**
   - Change name in package.json
   - Consider scoped package: `@username/snapai`

4. **Bundle Size Too Large**
   ```bash
   # Check bundle size
   ls -lh bundle/snapai.js
   
   # Optimize webpack config if needed
   ```

### Testing Before Publishing

```bash
# 1. Test in isolated environment
cd /tmp
mkdir test-snapai
cd test-snapai

# 2. Install from local package
npm install /Users/beto/Desktop/apps/snapai

# 3. Test installation
npx snapai --help
```

## Monitoring After Publishing

### 1. NPM Statistics
- Check download stats: https://www.npmjs.com/package/snapai
- Monitor issues and feedback

### 2. Version Management
```bash
# List all published versions
npm view snapai versions --json

# Check latest version
npm view snapai version
```

### 3. Deprecating Old Versions (if needed)
```bash
# Deprecate a specific version
npm deprecate snapai@0.1.0 "Please upgrade to latest version"
```

## Security Considerations

### 1. API Key Protection
- Never commit API keys to repository
- Users provide their own OpenAI keys
- No server-side key storage

### 2. Source Code Protection
- Source code stays in private repository
- Only obfuscated bundle published to NPM
- Use .npmignore to exclude sensitive files

### 3. Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

## Release Strategy

### 1. Release Channels
- **Latest**: Stable releases (default)
- **Beta**: Pre-release testing
- **Alpha**: Early development

```bash
# Publish to beta channel
npm publish --tag beta

# Install beta version
npm install snapai@beta
```

### 2. Semantic Versioning
- **0.x.x**: Pre-1.0, breaking changes allowed in minor versions
- **1.x.x**: Stable API, breaking changes only in major versions

### 3. Release Notes
Create release notes for each version:
- New features
- Bug fixes
- Breaking changes
- Migration instructions

This guide ensures a smooth publishing process while maintaining security and code quality standards.