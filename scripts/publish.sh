#!/bin/bash

# Iconiq Publishing Script
set -e

echo "🚀 Starting Iconiq publish process..."

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
pnpm run clean

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 3. Build TypeScript
echo "🔨 Building TypeScript..."
pnpm run build

# 4. Create bundle
echo "📦 Creating bundle..."
pnpm run bundle

# 5. Test bundled version
echo "🧪 Testing bundled version..."
if ! node ./bin/iconiq --help > /dev/null 2>&1; then
    echo "❌ Bundle test failed!"
    exit 1
fi

echo "✅ Bundle test passed!"

# 6. Check package contents
echo "📋 Checking package contents..."
npm pack --dry-run

# 7. Ask for confirmation
echo ""
echo "📦 Package contents above will be published."
echo "🤔 Do you want to continue? (y/N)"
read -r confirmation

if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled."
    exit 1
fi

# 8. Publish to NPM
echo "📤 Publishing to NPM..."
npm publish

# 9. Verify publication
echo "✅ Package published successfully!"
echo "🔍 Verifying publication..."

# Wait a moment for NPM to process
sleep 3

# Check if package is available
PACKAGE_VERSION=$(npm view iconiq version 2>/dev/null || echo "not found")
if [ "$PACKAGE_VERSION" = "not found" ]; then
    echo "⚠️  Package not yet available on NPM (may take a few minutes)"
else
    echo "✅ Package available: iconiq@$PACKAGE_VERSION"
fi

echo ""
echo "🎉 Publishing complete!"
echo "📖 Test installation with: npx iconiq@latest --help"
echo "🌐 View on NPM: https://www.npmjs.com/package/iconiq"