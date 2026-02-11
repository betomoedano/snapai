# Publishing Guide for SnapAI

Publishing is handled automatically via GitHub Actions. When you create a GitHub Release, the workflow builds the package and publishes it to npm.

## Step-by-Step Publishing

### 1. Make sure your changes are committed and pushed

```bash
git add .
git commit -m "feat: add new feature"
git push
```

### 2. Bump the version

Choose the appropriate version bump based on the type of change:

```bash
npm version patch   # Bug fixes (1.0.0 -> 1.0.1)
npm version minor   # New features (1.0.0 -> 1.1.0)
npm version major   # Breaking changes (1.0.0 -> 2.0.0)
```

This updates `package.json` and creates a git tag automatically.

### 3. Push the version commit and tag

```bash
git push && git push --tags
```

### 4. Create a GitHub Release

1. Go to https://github.com/betomoedano/snapai/releases/new
2. Select the tag you just pushed (e.g. `v1.1.0`)
3. Add a title and release notes
4. For pre-releases (beta), check the **"Set as a pre-release"** box — this publishes to the `beta` dist-tag instead of `latest`
5. Click **"Publish release"**

The GitHub Actions workflow will automatically build and publish the package to npm.

### 5. Verify the release

```bash
# Check the published version
npm view snapai version

# Test it
npx snapai@latest --help
```

## Publishing a Beta Version

Use beta releases to test changes before promoting them to `latest`.

### 1. Bump the version with a beta prerelease tag

```bash
# From a stable version (e.g. 1.1.0 -> 1.2.0-beta.0)
npm version preminor --preid beta

# For subsequent beta iterations (e.g. 1.2.0-beta.0 -> 1.2.0-beta.1)
npm version prerelease --preid beta
```

### 2. Push the version commit and tag

```bash
git push && git push --tags
```

### 3. Create a GitHub Release marked as pre-release

1. Go to https://github.com/betomoedano/snapai/releases/new
2. Select the beta tag you just pushed (e.g. `v1.2.0-beta.0`)
3. Add a title and release notes
4. Check the **"Set as a pre-release"** box — this is what tells the workflow to publish under the `beta` dist-tag
5. Click **"Publish release"**

### 4. Verify the beta release

```bash
# Check the beta version
npm view snapai dist-tags

# Test it (users must explicitly opt in to beta)
npx snapai@beta --help
```

### Promoting beta to stable

Once the beta is ready for general release:

```bash
# Bump to the stable version (e.g. 1.2.0-beta.3 -> 1.2.0)
npm version minor

# Push and create a regular (non-pre-release) GitHub Release
git push && git push --tags
```

Then create a new GitHub Release **without** the pre-release checkbox.

## Publishing Manually (workflow_dispatch)

You can also trigger a publish manually from the Actions tab without creating a release:

1. Go to https://github.com/betomoedano/snapai/actions/workflows/publish.yml
2. Click **"Run workflow"**
3. Optionally set a dist-tag (defaults to `latest`)
4. Click **"Run workflow"**

## Local Testing Before Publishing

Before bumping the version, it's a good idea to verify everything works locally:

```bash
# Build and test
pnpm run build
./bin/dev.js --help
./bin/dev.js config --show

# Full production build
pnpm run prepare-publish
node bundle/snapai.js --help

# Preview package contents
npm pack --dry-run
```

## Troubleshooting

### Common Issues

```bash
# Version already exists on npm
npm version patch   # Bump again and re-publish

# Test before publishing
npm pack --dry-run

# Check workflow logs
# Go to https://github.com/betomoedano/snapai/actions
```

## Monitoring

- **NPM Stats**: https://www.npmjs.com/package/snapai
- **Check versions**: `npm view snapai versions --json`
- **Workflow runs**: https://github.com/betomoedano/snapai/actions

## Security Notes

- The `NPM_TOKEN` secret is stored in GitHub repository settings
- Users provide their own OpenAI API keys
- No sensitive data is collected or stored
