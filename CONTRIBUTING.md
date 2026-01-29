# Contributing to SnapAI

Thank you for your interest in contributing to SnapAI! 🎉

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key for testing

### Setup
```bash
# Clone the repository
git clone https://github.com/betomoedano/snapai.git
cd snapai

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Test the CLI
./bin/dev.js --help
```

### Development Workflow
```bash
# Start TypeScript compiler in watch mode
pnpm run dev

# In another terminal, test your changes
./bin/dev.js config --openai-api-key sk-your-test-key
./bin/dev.js icon --prompt "test icon"
```

## Project Structure

```
src/
├── commands/           # CLI commands
│   ├── icon.ts        # Icon generation command
│   └── config.ts      # Configuration command
├── services/          # Core services
│   ├── openai.ts      # OpenAI API integration
│   └── config.ts      # Configuration management
├── utils/             # Utility functions
│   ├── prompts.ts     # Prompt templates
│   └── validation.ts  # Input validation
├── types.ts           # TypeScript definitions
└── index.ts           # CLI entry point
```

## How to Contribute

### 1. 🐛 Bug Reports
- Use the GitHub issue tracker
- Include clear reproduction steps
- Provide error messages and logs

### 2. ✨ Feature Requests
- Check existing issues first
- Describe the use case clearly
- Explain why it would be valuable

### 3. 🔧 Code Contributions

#### Small Changes
- Fix typos, improve documentation
- Submit a pull request directly

#### Larger Changes
- Open an issue first to discuss
- Get feedback before implementing
- Keep changes focused and atomic

## Development Guidelines

### Code Style
- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use meaningful variable names

### Testing
```bash
# Run linting
pnpm run lint

# Build to check for errors
pnpm run build

# Test CLI functionality
./bin/dev.js --help
```

### Commit Messages
- Use conventional commits format
- Examples:
  - `feat: add Android icon support`
  - `fix: handle API rate limiting`
  - `docs: update installation guide`

## What We're Looking For

### High Priority
- 🤖 Better prompt engineering
- 📱 Android adaptive icon support
- 🎨 Additional icon sizes/formats
- 📚 Better documentation
- 🐛 Bug fixes and improvements

### Medium Priority
- 🚀 Performance optimizations
- 🎨 Splash screen generation
- 🔧 Better error handling
- ✨ CLI UX improvements

### Ideas Welcome
- 🌟 New creative features
- 🔌 Integration with design tools
- 📊 Usage analytics (privacy-focused)
- 🎯 Platform-specific optimizations

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages
6. **Push** to your branch
7. **Open** a pull request

### PR Checklist
- [ ] Code builds without errors
- [ ] Changes are tested manually
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] PR description explains the changes

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers feel welcome
- Celebrate diverse perspectives

## Getting Help

- 💬 **GitHub Discussions**: Ask questions, share ideas
- 🐛 **GitHub Issues**: Report bugs, request features  
- 📧 **Email**: Contact maintainers for sensitive topics

## Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Credited in documentation

Thank you for helping make SnapAI better! 🚀