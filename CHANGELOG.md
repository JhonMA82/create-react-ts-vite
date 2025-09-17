# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-09-16

### Added
- **Interactive menu**: Added readline import for user interaction
- **Post-creation options**: Users can now choose what to do after project creation
- **VS Code integration**: Options to automatically open VS Code after project creation
- **Flexible development workflow**: Choose between opening editor, starting dev server, or both

### Changed
- **Enhanced CLI experience**: Replaced automatic dev server start with interactive menu
- **Improved user control**: Users now have more control over post-creation workflow
- **Better code organization**: Separated interactive functionality into dedicated function
- **Enhanced error handling**: Added proper input validation and error recovery

### Technical
- Added readline module import for terminal user interaction
- Created `showInteractiveOptions()` function for menu handling
- Improved CLI user experience with choice-based workflow
- Added proper shell execution for VS Code opening
- Enhanced input validation with recursive fallback for invalid choices

---

## [1.0.3] - 2025-09-16

### Fixed
- **Critical bug fix**: Corrected vite.config.ts template to use ES modules instead of CommonJS
  - Changed `import path from 'path'` to `import { fileURLToPath, URL } from 'node:url'`
  - Updated path resolution from `path.resolve(__dirname, './src')` to `fileURLToPath(new URL('./src', import.meta.url))`
- **Added dependency**: Added `@types/node` to development dependencies for proper TypeScript support

### Technical
- Template generator now produces ES modules compliant vite.config.ts
- Improved TypeScript configuration with proper Node.js types
- Enhanced template compatibility with modern ES modules standards

---

## [1.0.2] - 2025-09-16

### Changed
- Version increment to 1.0.2
- Updated package-lock.json and pnpm-lock.yaml
- Package.json repository URL normalization
- Added pnpm-release-manager configuration

### Technical
- Switched from npm to pnpm package management
- Added automated release management workflow
- Improved package.json metadata consistency

---

## [1.0.1] - 2025-09-16

### Added
- ASCII art header and success messages for better visual presentation
- Bold formatting for important CLI messages
- Enhanced success notification with bordered text sections
- Better organized command list in the success message

### Changed
- Improved CLI user interface with styled output
- Normalized package.json repository URL format (git+https://)
- Updated CLI messages to use chalk.bold() for emphasis
- Better organized final output with clear sections

### Technical
- Normalized bin path in package.json (removed leading ./)
- Updated package-lock.json with new version
- Added comprehensive success messaging system

---

## [1.0.0] - 2025-09-16

### Added
- Initial release
- CLI template generator for React + Vite + TypeScript + Vitest projects
- Automatic project setup with modern toolchain
- Pre-configured development dependencies (vitest, @testing-library/react, etc.)
- Production dependencies (dompurify, zustand, axios, etc.)
- Git repository initialization
- Automatic development server startup
- ESLint and Prettier configuration
- Comprehensive package.json scripts