# Changelog

All notable changes to SnapAI are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and SnapAI uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Entries without a published GitHub Release were reconstructed from version commits and merged changes in the repository.

## [Unreleased]

## [1.0.0] - 2026-07-20

### Added

- Added the `gpt-2` alias plus support for the official and dated GPT Image 2 model IDs.
- Added GPT Image 2 support to feature graphic generation.
- Added `--output-compression` for OpenAI JPEG and WebP icon output and JPEG feature graphics.

### Changed

- Made GPT Image 2 the default model for icon and feature graphic generation.
- Made the legacy `gpt` alias follow the new GPT Image 2 default.
- Reorganized the README into a shorter project overview with direct links to focused guides for icon generation, feature graphics, configuration, the CLI, and examples.

### Fixed

- Added preflight validation for GPT Image 2 dimensions, transparent backgrounds, and output compression.
- Restored the npm trusted-publishing workflow used by the GitHub Release process.

## [0.9.0] - 2026-07-15

### Added

- Added `snapai feature-graphic`, with the `snapai fg` alias, for generating Google Play feature graphics at `1024x500`.
- Added optional app-name text and logo compositing with left, center, or right positioning.
- Added PNG and JPEG feature graphic output with OpenAI and Gemini model support.
- Added `openai_base_url` configuration and `OPENAI_BASE_URL` support for compatible OpenAI endpoints.

### Fixed

- Stopped OCLIF validation errors from being wrapped and printed as duplicate generation errors.
- Made `--prompt-only` enforce the same provider constraints as a real generation request.
- Prevented read-only config commands from creating an empty `~/.snapai/config.json`.
- Updated stale OpenAI flag descriptions and bundled the new Gemini runtime dependencies correctly.

## [0.8.0] - 2026-04-21

### Added

- Added `--model gpt-image-2` for app icon generation.
- Mapped the new CLI option to the OpenAI `gpt-image-2` model.
- Added GPT Image 2 examples and generated outputs.

### Changed

- Reused the existing OpenAI quality, output format, image count, and moderation controls for GPT Image 2.

### Fixed

- Added a clear validation error because GPT Image 2 does not support transparent backgrounds.

## [0.7.0] - 2026-03-03

### Added

- Added `--model banana-2` using `gemini-3.1-flash-image-preview`.
- Added `--thinking minimal|max` to control Banana 2 reasoning.
- Added Banana 2 support to prompt previews and Gemini image generation.

### Changed

- Standardized the model name as `banana-2` throughout the CLI and documentation.
- Limited Banana 2 to one 1K image per request to match provider behavior.

## [0.6.0] - 2026-02-11

### Added

- Added Google Gemini image generation alongside OpenAI.
- Added `--model banana` for `gemini-2.5-flash-image` and `--pro` for `gemini-3-pro-image-preview`.
- Added Google key support through `--google-api-key`, `SNAPAI_GOOGLE_API_KEY`, `GEMINI_API_KEY`, and local configuration.
- Added `--prompt-only` to preview the enhanced prompt and resolved configuration without spending API credits.
- Added 1K, 2K, and 4K quality tiers plus multiple variations for Banana Pro.
- Added a GitHub Actions workflow for release-based npm publishing.

### Changed

- Introduced the `gpt-1.5`, `gpt-1`, and `banana` model aliases.
- Refactored prompt generation into one provider-independent pipeline.
- Expanded the style system to accept custom hints in addition to presets.
- Improved icon constraints to avoid unwanted rounded corners, UI mockups, and visual padding.
- Added `-r` for `--raw-prompt`, `-s` for `--style`, and `-i` for `--use-icon-words`.
- Replaced `--num-images` with `-n` / `--n` and renamed `--api-key` to `--openai-api-key`; the old options remain as hidden aliases.

### Removed

- Removed configurable output sizes; icon output became fixed at `1024x1024`.
- Removed the icon composer and its related utilities.
- Removed the `pngjs` dependency.

## [0.5.0] - 2025-09-15

### Added

- Added the `--style` option and a full prompt style system.
- Added presets for minimalism, glassy, woven, geometric, neon, gradient, flat, material, iOS classic, Android Material, pixel, game, clay, holographic, kawaii, and cute.
- Added style-specific prompt rules, descriptions, examples, and validation.

### Changed

- Made a selected style the dominant visual constraint when it conflicts with other prompt wording.
- Expanded documentation with style exploration and prompt guidance.

## [0.4.1] - 2025-09-13

### Fixed

- Switched DALL-E responses to base64 image data for consistent handling across supported OpenAI models.
- Prevented unsupported quality parameters from being sent to DALL-E 2.
- Improved quality validation and TypeScript parameter handling.
- Adjusted CLI module loading to address unsupported ESM URL behavior on Windows.

## [0.4.0] - 2025-07-04

### Added

- Added model selection for GPT Image 1, DALL-E 3, and DALL-E 2.
- Added model-specific sizes and quality options.
- Added transparent or opaque backgrounds, PNG/JPEG/WebP output, moderation controls, and up to 10 generated variations where supported.

### Changed

- Reorganized CLI help around basic and advanced options.
- Added model-specific validation and clearer errors for invalid parameter combinations.
- Improved filenames when saving multiple images.
- Expanded the README with model comparisons, workflow examples, and cost guidance.

## [0.3.5] - 2025-06-23

### Fixed

- Corrected the package entry point to use `dist/index.js`.
- Fixed CLI imports and command discovery for installed and `npx` usage.

## [0.3.2] - 2025-06-23

### Fixed

- Changed the executable to load the built CLI through a dynamic import.
- Removed unnecessary files from the published package.

## [0.3.1] - 2025-06-22

### Added

- Added a Code with Beto message to the icon and configuration commands.

### Changed

- Simplified the package publishing guide.

## [0.3.0] - 2025-06-22

### Added

- Added raw prompt mode to bypass SnapAI prompt enhancement.
- Added new tracked example outputs and clearer prompt examples.

### Changed

- Improved the iOS-oriented icon prompt and design constraints.
- Completed the Iconiq-to-SnapAI command and documentation migration.
- Removed the `node-fetch` dependency in favor of the Node.js runtime implementation.

## [0.2.0] - 2025-06-22

### Added

- Published the complete source code and a contributor guide.

### Changed

- Simplified the build and package structure for the open-source release.
- Reduced the bundled output size.

### Removed

- Removed telemetry, analytics, and code obfuscation.

## [0.1.0] - 2025-06-22

### Added

- Introduced the OCLIF-based SnapAI CLI with Node.js 18 support.
- Added AI app icon generation with OpenAI GPT Image 1.
- Added `snapai icon` and `snapai config`.
- Added local API key management, prompt enhancement, output directory controls, validation, and friendly errors.
- Added base64 image handling and multiple icon sizes.

[Unreleased]: https://github.com/betomoedano/snapai/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/betomoedano/snapai/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/betomoedano/snapai/compare/25c1ed4...v0.9.0
[0.8.0]: https://github.com/betomoedano/snapai/compare/20affcd...25c1ed4
[0.7.0]: https://github.com/betomoedano/snapai/compare/v0.6.0...20affcd
[0.6.0]: https://github.com/betomoedano/snapai/releases/tag/v0.6.0
[0.5.0]: https://github.com/betomoedano/snapai/compare/2500694...0cb8eb2
[0.4.1]: https://github.com/betomoedano/snapai/compare/ed1b311...2500694
[0.4.0]: https://github.com/betomoedano/snapai/compare/bcb7209...ed1b311
[0.3.5]: https://github.com/betomoedano/snapai/compare/9a57dda...bcb7209
[0.3.2]: https://github.com/betomoedano/snapai/compare/eb90766...9a57dda
[0.3.1]: https://github.com/betomoedano/snapai/compare/60383b1...eb90766
[0.3.0]: https://github.com/betomoedano/snapai/compare/d8c5e9d...60383b1
[0.2.0]: https://github.com/betomoedano/snapai/compare/62d1537...d8c5e9d
[0.1.0]: https://github.com/betomoedano/snapai/commit/62d1537
