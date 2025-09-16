# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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