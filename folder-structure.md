# Iconiq Project Folder Structure

```
iconiq/
├── README.md                      # Project overview and quick start
├── PROJECT_PLAN.md               # Detailed project plan and strategy
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── LICENSE                       # Software license
├── 
├── src/                          # Source code
│   ├── index.ts                  # CLI entry point
│   ├── 
│   ├── commands/                 # CLI commands (OCLIF)
│   │   ├── icon.ts              # Icon generation command
│   │   ├── splash.ts            # Splash screen generation command
│   │   └── config.ts            # Configuration management command
│   │   
│   ├── services/                # Core business logic
│   │   ├── openai.ts            # OpenAI API integration
│   │   ├── image-processor.ts   # Image processing and optimization
│   │   ├── file-manager.ts      # File operations and asset management
│   │   ├── prompt-builder.ts    # Dynamic prompt generation
│   │   └── billing.ts           # Usage tracking and billing logic
│   │   
│   ├── utils/                   # Utility functions
│   │   ├── validation.ts        # Input validation helpers
│   │   ├── config.ts           # Configuration management
│   │   ├── logger.ts           # Logging utilities
│   │   ├── constants.ts        # Application constants
│   │   └── helpers.ts          # General helper functions
│   │   
│   ├── templates/               # Prompt templates
│   │   ├── ios-icon.ts         # iOS-specific prompts
│   │   ├── android-icon.ts     # Android-specific prompts
│   │   ├── splash-screen.ts    # Splash screen prompts
│   │   └── base-prompts.ts     # Common prompt components
│   │   
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.ts              # API response types
│   │   ├── config.ts           # Configuration types
│   │   ├── commands.ts         # Command parameter types
│   │   └── index.ts            # Type exports
│   │   
│   └── lib/                     # External integrations
│       ├── stripe.ts           # Payment processing (future)
│       ├── analytics.ts        # Usage analytics (future)
│       └── auth.ts             # User authentication (future)
│
├── assets/                      # Static assets and examples
│   ├── examples/               # Sample generated icons
│   │   ├── ios/               # iOS icon examples
│   │   ├── android/           # Android icon examples
│   │   └── splash/            # Splash screen examples
│   ├── templates/             # Icon templates
│   └── brand/                 # Iconiq branding assets
│
├── docs/                       # Documentation
│   ├── api.md                 # API documentation
│   ├── configuration.md       # Configuration guide
│   ├── prompts.md             # Prompt engineering guide
│   ├── monetization.md        # Business model details
│   └── security.md            # Security considerations
│
├── tests/                      # Test files
│   ├── unit/                  # Unit tests
│   │   ├── services/          # Service tests
│   │   ├── utils/             # Utility tests
│   │   └── commands/          # Command tests
│   ├── integration/           # Integration tests
│   ├── fixtures/              # Test fixtures and mock data
│   └── setup.ts               # Test configuration
│
├── scripts/                    # Build and deployment scripts
│   ├── build.sh              # Build script
│   ├── publish.sh            # NPM publish script
│   ├── test.sh               # Test runner
│   └── setup-dev.sh          # Development environment setup
│
├── config/                     # Configuration files
│   ├── development.json       # Development settings
│   ├── production.json        # Production settings
│   └── test.json             # Test settings
│
└── .github/                   # GitHub workflows and templates
    ├── workflows/             # CI/CD workflows
    │   ├── test.yml          # Test automation
    │   ├── build.yml         # Build automation
    │   └── publish.yml       # Publish automation
    ├── ISSUE_TEMPLATE.md     # Issue template
    └── PULL_REQUEST_TEMPLATE.md  # PR template
```

## Key Directories Explained

### `/src/commands/`
OCLIF command definitions. Each file represents a CLI command with its flags, arguments, and execution logic.

### `/src/services/`
Core business logic separated from CLI concerns. Contains API integrations, image processing, and file management.

### `/src/templates/`
Prompt templates for different icon types and platforms. Allows for easy customization and A/B testing of prompts.

### `/src/types/`
TypeScript definitions for type safety across the application.

### `/assets/examples/`
Sample outputs for documentation and testing. Helps users understand expected results.

### `/docs/`
Comprehensive documentation for users and contributors.

### `/tests/`
Complete test suite with unit, integration, and fixture files.

## Development Workflow

1. **Initial Setup**: Use `/scripts/setup-dev.sh` to initialize development environment
2. **Development**: Work in `/src/` with hot reloading
3. **Testing**: Run tests from `/tests/` using `/scripts/test.sh`
4. **Building**: Use `/scripts/build.sh` for production builds
5. **Publishing**: Deploy with `/scripts/publish.sh`

This structure supports scalability, maintainability, and follows TypeScript/Node.js best practices while keeping the weekend MVP scope achievable.