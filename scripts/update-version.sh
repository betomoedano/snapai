#!/bin/bash

# Iconiq Version Update Script
set -e

# Function to show usage
show_usage() {
    echo "Usage: $0 [patch|minor|major]"
    echo ""
    echo "Examples:"
    echo "  $0 patch  # 0.1.0 → 0.1.1 (bug fixes)"
    echo "  $0 minor  # 0.1.0 → 0.2.0 (new features)"
    echo "  $0 major  # 0.1.0 → 1.0.0 (breaking changes)"
    exit 1
}

# Check if version type is provided
if [ $# -eq 0 ]; then
    show_usage
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "❌ Invalid version type: $VERSION_TYPE"
    show_usage
fi

echo "🔄 Updating version ($VERSION_TYPE)..."

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Update version
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: $NEW_VERSION"

# Stage the version change
echo "📝 Staging package.json changes..."
git add package.json

echo ""
echo "🎯 Next steps:"
echo "1. Commit changes: git commit -m 'bump version to $NEW_VERSION'"
echo "2. Create git tag: git tag v$NEW_VERSION"
echo "3. Push changes: git push && git push --tags"
echo "4. Publish: ./scripts/publish.sh"
echo ""
echo "Or run the publish script directly to build and publish:"
echo "  ./scripts/publish.sh"