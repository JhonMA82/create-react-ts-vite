# Release Management

A comprehensive Claude Code command for managing the automated release workflow.

## Usage

```bash
/release [action] [options]
```

## Actions

### `status`
Shows the current release status and configuration.

**Options:**
- `--verbose`: Show detailed information

### `commit [type] [message]`
Creates a conventional commit with the specified type and message.

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks
- `ci`: CI configuration changes

**Example:**
```bash
/release commit feat "Add new authentication system"
```

### `release [version]`
Manually triggers a release (bypassing release-please).

**Options:**
- `--major`: Major version bump
- `--minor`: Minor version bump
- `--patch`: Patch version bump
- `--prerelease`: Mark as prerelease

**Example:**
```bash
/release release --minor
```

### `configure`
Shows current configuration and helps with setup.

### `verify`
Verifies that all release components are properly configured.

### `help`
Shows this help information.

## Features

- **Automated Version Management**: Uses release-please for semantic versioning
- **Conventional Commits**: Validates commit messages following conventional commits specification
- **GitHub Actions**: Automated CI/CD pipeline
- **npm Publishing**: Automatic publishing to npm registry
- **Pre-commit Hooks**: Ensures code quality before commits
- **Release Notes**: Automatic generation of release notes

## Configuration Files

The following files are configured by the setup script:

- `.github/release-please-config.json`: Release-please configuration
- `.github/.release-please-manifest.json`: Version tracking
- `.github/workflows/release-please.yml`: Release PR creation workflow
- `.github/workflows/publish-npm.yml`: npm publishing workflow
- `.husky/commit-msg`: Commit message validation
- `.husky/pre-commit`: Pre-commit checks
- `commitlint.config.js`: Commit message validation rules

## Requirements

- GitHub repository with appropriate permissions
- NPM_TOKEN secret configured in GitHub Actions
- Node.js >= 16.0.0
- pnpm package manager

## Examples

```bash
# Check release status
/release status

# Make a feature commit
/release commit feat "Add user profile page"

# Make a bug fix commit
/release commit fix "Resolve login issue on mobile"

# Trigger a minor release
/release release --minor

# Verify configuration
/release verify
```

## Troubleshooting

If you encounter issues:

1. **Commit message validation fails**: Ensure your commit message follows conventional commits format
2. **Release PR not created**: Check GitHub Actions permissions and repository settings
3. **npm publishing fails**: Verify NPM_TOKEN is correctly configured in GitHub secrets
4. **Pre-commit hooks fail**: Run checks manually to identify issues

## Workflow

1. Make commits using conventional commits format
2. Push to main branch
3. Release-please creates a Release PR
4. Merge the Release PR
5. GitHub Actions publishes to npm automatically

For more information, see: [Conventional Commits](https://www.conventionalcommits.org/)