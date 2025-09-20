# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Overview

This is a CLI tool (`create-react-ts-vite`) that generates React + Vite + TypeScript projects with pre-configured modern development stack. The tool creates project scaffolding with best practices for 2025, including testing, linting, state management, and security configurations.

## 📁 Repository Structure

```
├── bin/cli.js              # CLI entry point
├── lib/index.js            # Main project generator logic
├── templates/              # Templates copied to generated projects
│   ├── claude.md          # Claude Code guidance for generated projects
│   └── gitignore          # Gitignore template
├── package.json           # CLI package configuration
├── commitlint.config.js   # Conventional commits configuration (Spanish)
└── .husky/                # Git hooks for commit validation
```

## 🔧 Common Development Commands

### CLI Development
```bash
# Test the CLI locally
node bin/cli.js test-project

# Package commands
npm run prepublishOnly    # Runs before publishing (build)
npm run prepare           # Installs husky hooks
npm test                  # Skips tests (no tests specified)
```

### Generated Project Commands (for reference)
The CLI generates projects with these commands:
```bash
pnpm dev          # Development server at http://localhost:5173
pnpm build        # Production build
pnpm test         # Run tests in watch mode
pnpm test:ui      # Test UI at http://localhost:51204/__vitest__/
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier formatting
```

## 🏗️ Architecture Overview

### Core Components

**CLI Entry Point** (`bin/cli.js`)
- Simple argument parsing for project name
- Error handling and user feedback
- Delegates to main generator

**Project Generator** (`lib/index.js`)
- ASCII art branding and user experience
- Creates base Vite project using `pnpm create vite`
- Configures comprehensive development stack
- Sets up Git repository with initial commit
- Provides interactive post-setup options

### Template System

The generator uses templates in `/templates/`:
- `claude.md` - Comprehensive development guide for generated projects
- `gitignore` - Comprehensive gitignore template (handles both `.gitignore` and `gitignore` for npm publishing)

### Generated Stack Configuration

The CLI configures these technologies in generated projects:
- **React 19** with TypeScript and SWC for fast compilation
- **Vite 7** with bundle analysis and optimized builds
- **Vitest** with React Testing Library and JS DOM
- **Tailwind CSS** with PostCSS and Autoprefixer
- **ESLint + Prettier** with React and TypeScript rules
- **Zustand** for state management
- **TanStack Query** for data fetching and caching
- **React Router** for SPA routing
- **Axios** for HTTP requests
- **React Hook Form + Zod** for form handling and validation
- **DOMPurify** for XSS protection

## 🔄 Configuration Files

### Commit Configuration
- **commitlint.config.js**: Custom Spanish-language conventional commits configuration
- **.husky/commit-msg**: Validates commit messages using commitlint
- Supports Spanish commit messages while maintaining conventional format

### Package Configuration
- **package.json**: CLI tool configuration with Spanish descriptions
- **engines**: Requires Node.js >=16.0.0
- **bin**: Provides `create-react-ts-vite` command
- **files**: Includes lib/, bin/, templates/, and documentation

## 📋 Code Patterns and Conventions

### Spanish Language Convention
- All user-facing messages are in Spanish
- Commit messages and documentation use Spanish
- Error messages are clear and actionable in Spanish

### Error Handling Pattern
```javascript
// CLI entry point error handling
if (!projectName) {
  console.error(chalk.red('❌ Error: Debes proporcionar un nombre de proyecto'))
  console.log(chalk.yellow('Uso: create-react-ts-vite <nombre-proyecto>'))
  process.exit(1)
}

// Generator error handling with cleanup
try {
  await createProject(projectName)
} catch (error) {
  console.error(chalk.red('❌ Error durante la creación del proyecto:'), error.message)
  process.exit(1)
}
```

### Template File Handling
The CLI handles template files robustly:
- Checks for both `.gitignore` and `gitignore` (for npm publishing compatibility)
- Falls back to basic templates if files are missing
- Provides clear error messages for missing templates

### Git Configuration Pattern
```javascript
// Configure git user if not set
try {
  await execaCommand('git config user.name', { stdio: 'pipe' })
  await execaCommand('git config user.email', { stdio: 'pipe' })
} catch {
  console.log(chalk.yellow('🔧 Configurando usuario git por defecto...'))
  await execaCommand('git config user.name "Developer"', { stdio: 'pipe' })
  await execaCommand('git config user.email "developer@example.com"', { stdio: 'pipe' })
}
```

## 🚀 Generated Project Features

### Claude Code Integration
Generated projects include:
- `.claude/settings.json` - Configuration for Claude Code
- `.claude/agents/` and `.claude/commands/` directories
- Comprehensive `claude.md` with development guidelines
- Agent configuration for git commit versioning

### Development Best Practices
Generated projects follow these patterns:
- Feature-based directory structure
- TypeScript strict mode
- Comprehensive error boundaries
- Security by default (XSS protection, input validation)
- Performance optimization (lazy loading, memoization)
- Testing with 80% coverage minimum
- Semantic HTML and accessibility

## 🔧 Development Workflow

### Making Changes to the CLI

1. **Test Locally**: Use `node bin/cli.js test-project` to test changes
2. **Update Templates**: Modify files in `/templates/` to change generated projects
3. **Version Management**: Use conventional commits for automatic versioning
4. **Publishing**: Run `npm run prepublishOnly` before publishing

### Commit Convention

This repository uses Spanish-language conventional commits:
- `feat:` - New functionality
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code restructuring
- `test:` - Test changes
- `chore:` - Maintenance tasks
- `ci:` - CI configuration changes

Example: `feat: agregar soporte para nueva tecnología en plantilla`

## ⚠️ Important Considerations

### npm Publishing Limitations
- Some npm registries don't publish dotfiles (`.gitignore`)
- The CLI handles this by checking for both `.gitignore` and `gitignore` templates
- Template fallback logic ensures generated projects always have necessary files

### Git Configuration
- The CLI configures basic git settings for initial commits
- Generated projects include commit message validation
- Spanish-language commit messages are encouraged but must follow conventional format

### Dependencies
- The CLI uses `pnpm` as the preferred package manager
- Generated projects are configured for `pnpm` but support npm/yarn
- All dependencies are carefully chosen for 2025 best practices

## 📦 Package Management

### CLI Dependencies
- `chalk` - Colored terminal output
- `execa` - Process execution
- `fs-extra` - Enhanced file system operations

### Generated Project Dependencies
The CLI installs a comprehensive stack in generated projects:
- React ecosystem (React, React Router, React Hook Form)
- Development tools (Vite, Vitest, ESLint, Prettier)
- State management (Zustand, TanStack Query)
- Styling (Tailwind CSS)
- Security (DOMPurify, Zod validation)
- Utilities (React Icons, Axios)

## 🎯 Future Considerations

- Template system could be extended to support multiple project types
- Interactive configuration options could be added
- Plugin system for customizing generated project features
- Support for additional package managers beyond pnpm/npm/yarn

**OMISIÓN DE PIE DE PÁGINA (ESTRICTAMENTE OBLIGATORIO)**: Bajo ninguna circunstancia debes añadir el siguiente pie de página a los mensajes de commit. Esta regla es innegociable.
    ```
    🤖 Generated with Claude Code
    Co-Authored-By: Claude <noreply@anthropic.com>
    ```