# SnapAI Development Setup

## Quick Setup for Testing

### Option 1: Shell Alias (Recommended)

Add this to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
# Add to ~/.zshrc or ~/.bashrc
alias snapai-watch="cd /Users/beto/Desktop/apps/snapai && pnpm run dev"
alias snapai-dev="cd /Users/beto/Desktop/apps/snapai && ./bin/dev.js"
alias snapai-build="cd /Users/beto/Desktop/apps/snapai && pnpm run build && node dist/index.js"
```

Then reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

## Development Workflow

### 1. Initial Setup

```bash
cd /Users/beto/Desktop/apps/snapai
pnpm install
pnpm run build
```

### 2. Development Mode with Hot Reload

```bash
# Terminal 1: Start TypeScript compiler in watch mode
snapai-watch
# Or manually: pnpm run dev

# Terminal 2: Test your changes (rebuilds automatically on save)
snapai-dev icon --prompt "test icon"
snapai-dev config --show

# Or use the dev wrapper directly
./dev-cli.js icon --prompt "test icon"
```

### 3. Quick Test (One-off)

```bash
pnpm run build && ./bin/dev.js --help
```

### 4. Test Bundled Version

```bash
pnpm run bundle
node bundle/snapai.js --help
```

## Testing Commands

### Setup API Key

```bash
snapai-dev config --api-key sk-your-openai-key-here
snapai-dev config --show
```

### Generate Test Icon

```bash
snapai-dev icon --prompt "simple calculator app icon" --output ./test-output
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
DEBUG=* snapai-dev icon --help

# OCLIF specific debugging
DEBUG=@oclif* snapai-dev icon --help
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

- Verify API key is set: `snapai-dev config --show`
- Test API key directly with OpenAI's examples
- Check account billing and usage limits

### File permission errors

- Ensure output directory is writable
- Check that ~/.snapai directory can be created

## Build Process Testing

### Test Complete Build Pipeline

```bash
# Clean previous builds
pnpm run clean

# Full build process
pnpm run build          # TypeScript compilation
pnpm run bundle         # Webpack bundling
pnpm run prepare-publish # Complete build pipeline

# Test bundled version
node bundle/snapai.js --help
```

### Verify NPM Package Structure

```bash
# Check what would be published
npm pack --dry-run

# Check .npmignore is working
tar -tzf snapai-0.2.0.tgz
```

This setup allows you to test the CLI locally during development while maintaining the same commands that users will use in production.
