#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Release Management Command for Claude Code
 *
 * This command provides a comprehensive interface for managing the automated release workflow
 * using Conventional Commits, release-please, and GitHub Actions.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ReleaseCommand {
  constructor() {
    this.projectRoot = process.cwd();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
      const releasePleaseConfig = existsSync(join(this.projectRoot, '.github', 'release-please-config.json'))
        ? JSON.parse(readFileSync(join(this.projectRoot, '.github', 'release-please-config.json'), 'utf8'))
        : null;

      return {
        packageName: packageJson.name,
        currentVersion: packageJson.version,
        releasePlease: releasePleaseConfig
      };
    } catch (error) {
      console.error('Error loading configuration:', error.message);
      process.exit(1);
    }
  }

  async execute(args) {
    const [action, ...restArgs] = args;

    switch (action) {
      case 'status':
        return this.showStatus(restArgs);
      case 'commit':
        return this.makeCommit(restArgs);
      case 'release':
        return this.makeRelease(restArgs);
      case 'configure':
        return this.showConfiguration();
      case 'verify':
        return this.verifySetup();
      case 'help':
      default:
        return this.showHelp();
    }
  }

  showStatus(args) {
    const verbose = args.includes('--verbose');

    console.log('\n📋 Release Status');
    console.log('================');

    console.log(`📦 Package: ${this.config.packageName}`);
    console.log(`🏷️  Current Version: ${this.config.currentVersion}`);

    // Check if release-please is configured
    if (this.config.releasePlease) {
      console.log('✅ Release-please: Configured');
    } else {
      console.log('❌ Release-please: Not configured');
    }

    // Check GitHub workflows
    const workflows = ['release-please.yml', 'publish-npm.yml'];
    workflows.forEach(workflow => {
      const path = join(this.projectRoot, '.github', 'workflows', workflow);
      if (existsSync(path)) {
        console.log(`✅ ${workflow}: Exists`);
      } else {
        console.log(`❌ ${workflow}: Missing`);
      }
    });

    // Check Husky hooks
    const hooks = ['commit-msg', 'pre-commit'];
    hooks.forEach(hook => {
      const path = join(this.projectRoot, '.husky', hook);
      if (existsSync(path)) {
        console.log(`✅ ${hook}: Configured`);
      } else {
        console.log(`❌ ${hook}: Missing`);
      }
    });

    if (verbose) {
      console.log('\n🔍 Detailed Configuration:');
      console.log(JSON.stringify(this.config, null, 2));
    }

    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('\n⚠️  Uncommitted changes detected:');
        console.log(status);
      } else {
        console.log('\n✅ No uncommitted changes');
      }
    } catch (error) {
      console.log('\n❌ Unable to check git status');
    }
  }

  makeCommit(args) {
    if (args.length < 2) {
      console.error('Usage: /release commit <type> <message>');
      console.error('Types: feat, fix, docs, style, refactor, test, chore, ci');
      process.exit(1);
    }

    const [type, ...messageParts] = args;
    const message = messageParts.join(' ');

    const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci'];
    if (!validTypes.includes(type)) {
      console.error(`Invalid commit type: ${type}`);
      console.error(`Valid types: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    const fullMessage = `${type}: ${message}`;

    try {
      console.log(`📝 Creating commit: ${fullMessage}`);
      execSync(`git add -A`, { stdio: 'inherit' });
      execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });
      console.log('✅ Commit created successfully');
    } catch (error) {
      console.error('❌ Failed to create commit:', error.message);
      process.exit(1);
    }
  }

  makeRelease(args) {
    const options = {
      major: args.includes('--major'),
      minor: args.includes('--minor'),
      patch: args.includes('--patch'),
      prerelease: args.includes('--prerelease')
    };

    if (!Object.values(options).some(Boolean)) {
      console.error('Usage: /release release [--major|--minor|--patch] [--prerelease]');
      process.exit(1);
    }

    const bumpType = options.major ? 'major' : options.minor ? 'minor' : 'patch';
    const prereleaseFlag = options.prerelease ? '--prerelease' : '';

    try {
      console.log(`🚀 Creating ${bumpType} release...`);

      // Check if there are uncommitted changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('⚠️  You have uncommitted changes. Please commit them first.');
        process.exit(1);
      }

      // Check if we're on main branch
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (branch !== 'main') {
        console.log('⚠️  You are not on the main branch. Switch to main first.');
        process.exit(1);
      }

      // Pull latest changes
      console.log('📥 Pulling latest changes...');
      execSync('git pull origin main', { stdio: 'inherit' });

      // Create release commit and tag
      const tag = `v${this.getNextVersion(bumpType, options.prerelease)}`;
      execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: 'inherit' });

      console.log(`🏷️  Tag ${tag} created`);
      console.log('📤 Push changes and tags...');
      execSync('git push origin main', { stdio: 'inherit' });
      execSync(`git push origin ${tag}`, { stdio: 'inherit' });

      console.log('✅ Release triggered successfully');
    } catch (error) {
      console.error('❌ Failed to create release:', error.message);
      process.exit(1);
    }
  }

  getNextVersion(bumpType, prerelease) {
    const [major, minor, patch] = this.config.currentVersion.split('.').map(Number);

    switch (bumpType) {
      case 'major':
        return prerelease ? `${major + 1}.0.0-0` : `${major + 1}.0.0`;
      case 'minor':
        return prerelease ? `${major}.${minor + 1}.0-0` : `${major}.${minor + 1}.0`;
      case 'patch':
        return prerelease ? `${major}.${minor}.${patch + 1}-0` : `${major}.${minor}.${patch + 1}`;
      default:
        return this.config.currentVersion;
    }
  }

  showConfiguration() {
    console.log('\n⚙️  Current Configuration');
    console.log('========================');

    console.log('📦 Package Configuration:');
    console.log(`  Name: ${this.config.packageName}`);
    console.log(`  Version: ${this.config.currentVersion}`);

    if (this.config.releasePlease) {
      console.log('\n🤖 Release-please Configuration:');
      console.log(JSON.stringify(this.config.releasePlease, null, 2));
    }

    console.log('\n🔗 Next Steps:');
    console.log('1. Ensure NPM_TOKEN is configured in GitHub secrets');
    console.log('2. Use conventional commits for your changes');
    console.log('3. Push changes to main branch');
    console.log('4. Release-please will create a Release PR');
    console.log('5. Merge the Release PR to publish to npm');
  }

  verifySetup() {
    console.log('\n🔍 Verifying Setup');
    console.log('==================');

    let allGood = true;

    // Check required files
    const requiredFiles = [
      '.github/release-please-config.json',
      '.github/.release-please-manifest.json',
      '.github/workflows/release-please.yml',
      '.github/workflows/publish-npm.yml',
      '.husky/commit-msg',
      '.husky/pre-commit',
      'commitlint.config.js'
    ];

    requiredFiles.forEach(file => {
      const path = join(this.projectRoot, file);
      if (existsSync(path)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} - Missing`);
        allGood = false;
      }
    });

    // Check package.json scripts
    const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
    if (packageJson.scripts && packageJson.scripts.prepare) {
      console.log('✅ prepare script in package.json');
    } else {
      console.log('❌ prepare script missing from package.json');
      allGood = false;
    }

    // Check git status
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('⚠️  Uncommitted changes detected');
      } else {
        console.log('✅ No uncommitted changes');
      }
    } catch (error) {
      console.log('❌ Git status check failed');
      allGood = false;
    }

    console.log('\n' + (allGood ? '✅ All checks passed!' : '❌ Some issues found. Please fix them before proceeding.'));

    if (!allGood) {
      console.log('\n💡 Run the setup script again: powershell -ExecutionPolicy Bypass -File setup-conventional-release.ps1');
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
🚀 Release Management Command

Usage: /release [action] [options]

Actions:
  status [--verbose]     Show current release status
  commit <type> <msg>    Create conventional commit
  release [--major|--minor|--patch] [--prerelease]  Create release
  configure              Show current configuration
  verify                 Verify setup
  help                   Show this help

Commit Types:
  feat     New feature
  fix      Bug fix
  docs     Documentation
  style    Code style
  refactor Code refactoring
  test     Test changes
  chore    Maintenance
  ci       CI configuration

Examples:
  /release status --verbose
  /release commit feat "Add new feature"
  /release release --minor
  /release verify
`);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = new ReleaseCommand();
  command.execute(process.argv.slice(2)).catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

export default ReleaseCommand;