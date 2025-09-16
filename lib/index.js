import { execaCommand } from 'execa'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

async function createProject(projectName) {
  console.log(chalk.blue(`📦 Creando proyecto ${projectName} con Vite + React + SWC + TS...`))

  // Crear proyecto base con Vite
  await execaCommand(`pnpm create vite ${projectName} --template react-swc-ts --quiet`, { stdio: 'pipe' })

  // Cambiar al directorio del proyecto
  const projectPath = path.resolve(projectName)
  process.chdir(projectPath)

  console.log(chalk.yellow('🔧 Inicializando repositorio Git...'))
  await execaCommand('git init', { stdio: 'inherit' })

  console.log(chalk.yellow('📦 Instalando dependencias de desarrollo...'))
  const devDeps = [
    'vitest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jsdom',
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'rollup-plugin-visualizer',
    'tailwindcss',
    'postcss',
    'autoprefixer',
  ]

  await execaCommand(`pnpm add -D ${devDeps.join(' ')}`, { stdio: 'inherit' })

  console.log(chalk.yellow('📦 Instalando dependencias de producción...'))
  const deps = [
    'dompurify',
    'zustand',
    '@tanstack/react-query',
    'react-hook-form',
    'zod',
    'react-icons',
    'react-router-dom',
    'axios',
  ]

  await execaCommand(`pnpm add ${deps.join(' ')}`, { stdio: 'inherit' })

  // Configurar Tailwind
  await configureTailwind()

  // Configurar archivos de configuración
  await configureProject()

  // Copiar claude.md
  await copyClaudeTemplate()

  // Copiar .gitignore
  await copyGitignoreTemplate()

  // Configurar Claude Code
  await configureClaudeCode()

  // Actualizar package.json con scripts adicionales
  await updatePackageJson()

  console.log(chalk.green('✅ ¡Proyecto creado exitosamente!'))
  console.log(chalk.cyan('\n📋 Comandos disponibles:'))
  console.log(chalk.white('  pnpm test       # Ejecutar tests'))
  console.log(chalk.white('  pnpm lint       # Linter de código'))
  console.log(chalk.white('  pnpm format     # Formatear código'))
  console.log(chalk.yellow('\n🚀 Iniciando servidor de desarrollo...'))
  console.log(chalk.blue('   (Presiona Ctrl+C para detener el servidor)\n'))

  // Iniciar servidor de desarrollo automáticamente
  await execaCommand('pnpm dev', { stdio: 'inherit' })
}

async function configureTailwind() {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}`

  await fs.writeFile('tailwind.config.js', tailwindConfig)

  const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`

  await fs.writeFile('./src/index.css', cssContent)
}

async function configureProject() {
  // Configurar Vite
  const viteConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, filename: 'dist/stats.html' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})`

  await fs.writeFile('vite.config.ts', viteConfig)

  // Configurar ESLint
  const eslintConfig = `{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}`

  await fs.writeFile('.eslintrc.json', eslintConfig)

  // Configurar Prettier
  const prettierConfig = `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}`

  await fs.writeFile('.prettierrc', prettierConfig)

  // Setup de tests
  await fs.ensureDir('./src/test')
  await fs.writeFile('./src/test/setup.ts', "import '@testing-library/jest-dom'")
}

async function copyClaudeTemplate() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const templatePath = path.join(__dirname, '../templates/claude.md')
  const targetPath = './claude.md'

  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, targetPath)
  } else {
    console.log(chalk.yellow('⚠️  Archivo claude.md no encontrado, creando versión básica...'))
    await fs.writeFile(targetPath, '# Guía Claude Code\n\n<!-- Archivo de referencia para Claude Code -->')
  }
}

async function copyGitignoreTemplate() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const templatePath = path.join(__dirname, '../templates/.gitignore')
  const targetPath = './.gitignore'

  if (await fs.pathExists(templatePath)) {
    await fs.copy(templatePath, targetPath)
  } else {
    console.log(chalk.yellow('⚠️  Archivo .gitignore template no encontrado, creando versión básica...'))
    await fs.writeFile(targetPath, 'node_modules/\ndist/\n.env\n')
  }
}

async function updatePackageJson() {
  const packageJsonPath = './package.json'
  const packageJson = await fs.readJson(packageJsonPath)

  packageJson.scripts = {
    ...packageJson.scripts,
    test: 'vitest',
    'test:ui': 'vitest --ui',
    'test:coverage': 'vitest run --coverage',
    lint: 'eslint . --ext .ts,.tsx --fix',
    format: 'prettier --write .',
    preview: 'vite preview',
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
}

async function configureClaudeCode() {
  console.log(chalk.yellow('🤖 Configurando Claude Code...'))

  // Crear directorios de Claude Code
  await fs.ensureDir('.claude/agents')
  await fs.ensureDir('.claude/commands')

  // Crear archivo de configuración
  const claudeSettings = {
    version: "1.0",
    agents: {
      enabled: true,
      directory: ".claude/agents"
    },
    commands: {
      enabled: true,
      directory: ".claude/commands"
    },
    project: {
      type: "react-vite-typescript",
      packageManager: "pnpm",
      testFramework: "vitest",
      styling: "tailwind"
    },
    features: {
      stateManagement: "zustand",
      dataFetching: "tanstack-query",
      routing: "react-router",
      formHandling: "react-hook-form",
      validation: "zod"
    },
    devTools: {
      testing: {
        ui: true,
        coverage: true
      },
      linting: {
        autoFix: true
      },
      formatting: {
        prettier: true
      }
    },
    optimizations: {
      codeSplitting: true,
      bundleAnalysis: true,
      lazyLoading: true
    },
    security: {
      xssProtection: true,
      environmentVariables: "vite-only",
      inputValidation: true
    }
  }

  await fs.writeJson('.claude/settings.json', claudeSettings, { spaces: 2 })

  // Crear archivo README para la carpeta .claude
  const claudeReadme = `# Claude Code Configuration

Esta carpeta contiene la configuración y personalización para Claude Code (claude.ai/code).

## Estructura

- \`agents/\` - Agentes personalizados para tareas específicas
- \`commands/\` - Comandos personalizados para el proyecto
- \`settings.json\` - Configuración principal de Claude Code

## Uso

Claude Code utilizará automáticamente esta configuración para proporcionar asistencia contextualizada durante el desarrollo.

Para más información, consulta la documentación de Claude Code: https://docs.claude.com/code
`

  await fs.writeFile('.claude/README.md', claudeReadme)
}

export { createProject }
