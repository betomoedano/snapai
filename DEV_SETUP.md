# Local Development Setup

## Quick Setup for Testing

### Option 1: Shell Alias (Recommended)
Add this to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
# Add to ~/.zshrc or ~/.bashrc
alias iconiq-dev="cd /Users/beto/Desktop/apps/iconiq && pnpm run dev"
alias iconiq-build="cd /Users/beto/Desktop/apps/iconiq && pnpm run build && node dist/index.js"
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Option 2: Global Symlink
```bash
# After building the project
cd /Users/beto/Desktop/apps/iconiq
pnpm install
pnpm run build

# Create global symlink
sudo ln -sf /Users/beto/Desktop/apps/iconiq/dist/index.js /usr/local/bin/iconiq-dev
chmod +x /usr/local/bin/iconiq-dev
```

### Option 3: PNPM Link (Best for Development)
```bash
cd /Users/beto/Desktop/apps/iconiq
pnpm install
pnpm run build

# Link globally
pnpm link --global

# Now you can use 'iconiq' anywhere
iconiq --help
```

## Development Workflow

### 1. Initial Setup
```bash
cd /Users/beto/Desktop/apps/iconiq
pnpm install
```

### 2. Development Mode (with hot reload)
```bash
pnpm run dev icon --help
# or with alias
iconiq-dev icon --help
```

### 3. Test Compiled Version
```bash
pnpm run build
node dist/index.js --help
# or with alias
iconiq-build --help
```

### 4. Test Bundled/Obfuscated Version
```bash
pnpm run bundle
node bundle/iconiq.js --help
```

## Testing Commands

### Setup API Key
```bash
iconiq-dev config --api-key sk-your-openai-key-here
iconiq-dev config --show
```

### Generate Test Icon
```bash
iconiq-dev icon --prompt "simple calculator app icon" --output ./test-output
```

### Check Telemetry Settings
```bash
iconiq-dev config --show-telemetry
iconiq-dev config --telemetry false
```

## Debugging

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Watch mode
npx tsc --watch --noEmit
```

### OCLIF Debugging
```bash
# Enable debug mode
DEBUG=* iconiq-dev icon --help

# OCLIF specific debugging
DEBUG=@oclif* iconiq-dev icon --help
```

### Test Dependencies
```bash
# Check if all deps are installed
pnpm run build
node -e "console.log(require('./package.json').dependencies)"
```

## Troubleshooting

### "Command not found"
- Make sure you've run `pnpm run build`
- Check that the alias points to the correct path
- Verify file permissions: `chmod +x dist/index.js`

### "Module not found" errors
- Run `pnpm install` to ensure all dependencies are installed
- Check `node_modules` exists and contains required packages

### OpenAI API errors
- Verify API key is set: `iconiq-dev config --show`
- Test API key directly with OpenAI's examples
- Check account billing and usage limits

### File permission errors
- Ensure output directory is writable
- Check that ~/.iconiq directory can be created

## Build Process Testing

### Test Complete Build Pipeline
```bash
# Clean previous builds
pnpm run clean

# Full build process
pnpm run build          # TypeScript compilation
pnpm run bundle         # Webpack bundling + obfuscation
pnpm run prepare-publish # Complete build pipeline

# Test bundled version
node bundle/iconiq.js --help
```

### Verify NPM Package Structure
```bash
# Check what would be published
npm pack --dry-run

# Check .npmignore is working
tar -tzf iconiq-0.1.0.tgz
```

This setup allows you to test the CLI locally during development while maintaining the same commands that users will use in production.