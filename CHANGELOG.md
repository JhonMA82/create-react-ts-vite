# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation

- Actualiza configuración de agentes y añade documentación completa de Claude Code
- Mejora la integración con Claude Code y documentación del flujo de trabajo

## [1.2.2] - 2025-09-19

### Changed

- Reemplaza script PowerShell de configuración con agente Claude para git commits
- Elimina el script setup-conventional-release.ps1 que automatizaba la configuración de Husky, Commitlint y release-please
- Transición a enfoque más moderno y automatizado para la gestión de commits y releases

## [1.2.1] - 2025-09-19

### Added

- Comprehensive gitignore template for generated projects
- Complete .gitignore template with Node.js, React, and Vite patterns
- Testing, build, and environment variable exclusions
- Claude Code specific cache and log exclusions
- Editor configurations and OS generated files

### Changed

- Improved developer experience for generated projects
- Enhanced template handling with npm publishing compatibility

## [1.2.0](https://github.com/JhonMA82/create-react-ts-vite/compare/create-react-ts-vite-v1.1.0...create-react-ts-vite-v1.2.0) (2025-09-19)


### Features

* add automated release workflow configuration ([92b9337](https://github.com/JhonMA82/create-react-ts-vite/commit/92b9337c9aa87fefc60a18b8b309bc0694fe4c69))
* add intelligent analysis to release command with auto-detection ([04e2d5b](https://github.com/JhonMA82/create-react-ts-vite/commit/04e2d5bbfd3d79993c279387260ed9bafd252dc3))


### Bug Fixes

* remove BOM character from release-please config JSON ([b4b9569](https://github.com/JhonMA82/create-react-ts-vite/commit/b4b9569cdf1c5f999ac9d6dd9699eda45cd605f4))
* remove BOM character from release-please manifest JSON and update version ([dbaa90f](https://github.com/JhonMA82/create-react-ts-vite/commit/dbaa90f3657ca005d7afdfd57fd4fca607b6613e))

## [1.0.6] - 2025-09-17

### Changed
- **Package management**: Improved package.json normalization with pnpm
- **Version consistency**: Updated to version 1.0.6 with proper semver formatting
- **Dependencies**: Verified and validated all dependency configurations

### Technical
- Applied pnpm package normalization and URL consistency fixes
- Updated package.json metadata to follow best practices
- Verified CLI functionality with test project creation and build process
- Ensured all project files are properly configured for release

---

## [1.0.5] - 2025-09-16

### Added
- **Git integration**: Automatic git repository initialization during project creation
- **Initial commit**: Added `createInitialCommit()` function for automatic first commit
- **Git user configuration**: Robust handling of git user setup with fallback defaults
- **Enhanced success messages**: Improved CLI feedback with git setup information
- **Error handling**: Better error handling for git operations and graceful failures

### Changed
- **Project workflow**: Modified CLI workflow to include git initialization step
- **User experience**: Enhanced success messages with git configuration details
- **Code organization**: Added dedicated git handling functions

### Fixed
- **Git operations**: Improved error handling when git user is not configured
- **Graceful degradation**: Better handling of git operation failures

---

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
