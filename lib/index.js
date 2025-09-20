import chalk from 'chalk'
import { execaCommand } from 'execa'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

async function createProject(projectName) {
  // ASCII Art Header
  console.log(
    chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ███████╗ ██████╗ ██████╗  ██████╗ ███████╗████████╗        ║
║   ██╔════╝██╔═══██╗██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝        ║
║   █████╗  ██║   ██║██████╔╝██║   ██║█████╗     ██║           ║
║   ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝     ██║           ║
║   ██║     ╚██████╔╝██║  ██║╚██████╔╝██║        ██║           ║
║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝           ║
║                                                              ║
║                 CREATE-REACT-TS-VITE                         ║
║                 React 19 + Vite 7 + TypeScript               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`),
  )

  console.log(chalk.blue(`📦 Creando proyecto ${chalk.bold(projectName)}...`))

  // Crear proyecto base con Vite
  await execaCommand(`pnpm create vite ${projectName} --template react-swc-ts --quiet`, { stdio: 'pipe' })

  // Cambiar al directorio del proyecto
  const projectPath = path.resolve(projectName)
  process.chdir(projectPath)

  console.log(chalk.yellow('🔧 ' + chalk.bold('Inicializando repositorio Git...')))
  await execaCommand('git init', { stdio: 'inherit' })

  console.log(chalk.yellow('📦 ' + chalk.bold('Instalando dependencias de desarrollo...')))
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
    '@types/node',
  ]

  await execaCommand(`pnpm add -D ${devDeps.join(' ')}`, { stdio: 'inherit' })
  console.log(
    chalk.yellow('ℹ️ Si pnpm muestra "Ignored build scripts: @swc/core, esbuild", ejecuta: pnpm approve-builds'),
  )

  console.log(chalk.yellow('📦 ' + chalk.bold('Instalando dependencias de producción...')))
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

  // Realizar commit inicial de configuración
  await createInitialCommit()

  // Success Message
  console.log(
    chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                     ✅ ¡PROYECTO CREADO!                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`),
  )

  console.log(chalk.cyan('\n📋 ' + chalk.bold('Comandos disponibles:')))
  console.log(chalk.white('  • pnpm test         # Ejecutar tests'))
  console.log(chalk.white('  • pnpm lint         # Linter de código'))
  console.log(chalk.white('  • pnpm format       # Formatear código'))
  console.log(chalk.white('  • pnpm dev          # Servidor desarrollo'))
  console.log(chalk.white('  • pnpm build        # Build producción'))

  console.log(chalk.green('\n🔧 ' + chalk.bold('Repositorio Git configurado:')))
  console.log(chalk.white('  • Git inicializado'))
  console.log(chalk.white('  • Commit inicial de configuración creado'))
  console.log(chalk.white('  • Listo para desarrollar con un historial limpio'))

  await showInteractiveOptions(projectName)
}

async function showInteractiveOptions(projectName) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log(chalk.yellow('\n🎯 ' + chalk.bold('¿Qué te gustaría hacer ahora?')))
  console.log(chalk.white('1. Abrir VS Code y ejecutar servidor de desarrollo'))
  console.log(chalk.white('2. Solo abrir VS Code'))
  console.log(chalk.white('3. Solo ejecutar servidor de desarrollo'))
  console.log(chalk.white('4. No hacer nada y terminar'))
  console.log('')

  const question = chalk.cyan('Selecciona una opción (1-4): ')

  rl.question(question, async answer => {
    rl.close()

    switch (answer.trim()) {
      case '1':
        console.log(chalk.green('\n🚀 ' + chalk.bold('Abriendo VS Code e iniciando servidor de desarrollo...')))
        await execaCommand('code .', { stdio: 'inherit', shell: true })
        await execaCommand('pnpm dev', { stdio: 'inherit' })
        break

      case '2':
        console.log(chalk.green('\n💻 ' + chalk.bold('Abriendo VS Code...')))
        await execaCommand('code .', { stdio: 'inherit', shell: true })
        console.log(chalk.blue('\n✅ VS Code abierto. ¡Happy coding!'))
        break

      case '3':
        console.log(chalk.green('\n🚀 ' + chalk.bold('Iniciando servidor de desarrollo...')))
        console.log(chalk.blue('(Presiona Ctrl+C para detener el servidor)\n'))
        await execaCommand('pnpm dev', { stdio: 'inherit' })
        break

      case '4':
        console.log(chalk.blue('\n✅ ' + chalk.bold('Proyecto creado exitosamente.')))
        console.log(chalk.white(`📁 Para navegar al proyecto: cd ${projectName}`))
        console.log(chalk.white('💻 Para abrir VS Code: code .'))
        console.log(chalk.white('🚀 Para iniciar desarrollo: pnpm dev'))
        break

      default:
        console.log(chalk.red('\n❌ Opción no válida. Elige una opción del 1 al 4.'))
        await showInteractiveOptions(projectName)
    }
  })
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
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, filename: 'dist/stats.html' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
    console.log(chalk.yellow(`   Ruta buscada: ${templatePath}`))
    console.log(chalk.yellow(`   __dirname: ${__dirname}`))
    console.log(chalk.yellow(`   cwd: ${process.cwd()}`))
    console.log(chalk.yellow('   Posible causa: el paquete publicado no incluye la carpeta "templates".'))
    await fs.writeFile(targetPath, '# Guía Claude Code\n\n<!-- Archivo de referencia para Claude Code -->')
  }
}

async function copyGitignoreTemplate() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // Intento 1: .gitignore (ideal en repo local)
  const templatePathDot = path.join(__dirname, '../templates/.gitignore')
  // Intento 2: gitignore (fallback empaquetado para npm, ya que algunos registros no incluyen archivos que comienzan con ".")
  const templatePathNoDot = path.join(__dirname, '../templates/gitignore')

  const targetPath = './.gitignore'

  if (await fs.pathExists(templatePathDot)) {
    await fs.copy(templatePathDot, targetPath)
  } else if (await fs.pathExists(templatePathNoDot)) {
    await fs.copy(templatePathNoDot, targetPath)
  } else {
    console.log(chalk.yellow('⚠️  Archivo .gitignore template no encontrado, creando versión básica...'))
    console.log(chalk.yellow(`   Rutas buscadas:`))
    console.log(chalk.yellow(`   • ${templatePathDot}`))
    console.log(chalk.yellow(`   • ${templatePathNoDot}`))
    console.log(chalk.yellow(`   __dirname: ${__dirname}`))
    console.log(chalk.yellow(`   cwd: ${process.cwd()}`))
    console.log(chalk.yellow('   Posible causa: el paquete publicado no incluye la carpeta "templates".'))
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

async function createInitialCommit() {
  try {
    console.log(chalk.yellow('🔧 ' + chalk.bold('Creando commit inicial de configuración...')))

    // Configurar git user si no está configurado
    try {
      await execaCommand('git config user.name', { stdio: 'pipe' })
      await execaCommand('git config user.email', { stdio: 'pipe' })
    } catch {
      console.log(chalk.yellow('🔧 Configurando usuario git por defecto...'))
      await execaCommand('git config user.name "Developer"', { stdio: 'pipe' })
      await execaCommand('git config user.email "developer@example.com"', { stdio: 'pipe' })
    }

    // Añadir todos los archivos al staging area
    await execaCommand('git add .', { stdio: 'pipe' })

    // Crear commit inicial
    const commitMessage = `feat: initial project configuration with React+Vite+TypeScript setup

- Initialize React 19 + Vite 7 + TypeScript project
- Add development dependencies: Vitest, ESLint, Prettier, Tailwind CSS
- Add production dependencies: Zustand, React Query, React Hook Form, Zod
- Configure development tools and linting rules
- Set up Claude Code integration
- Add testing framework with Testing Library
- Configure build tools and development scripts

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`

    const tmpDir = os.tmpdir()
    const commitFilePath = path.join(tmpDir, `create-react-ts-vite-commit-${Date.now()}.txt`)
    try {
      await fs.writeFile(commitFilePath, commitMessage)
      await execaCommand(`git commit -F "${commitFilePath}"`, { stdio: 'pipe', shell: true })
    } finally {
      try {
        await fs.remove(commitFilePath)
      } catch {}
    }

    console.log(chalk.green('✅ ' + chalk.bold('Commit inicial creado exitosamente')))
  } catch (error) {
    console.log(chalk.yellow('⚠️  No se pudo crear el commit inicial. Esto puede ocurrir si git no está configurado.'))
    console.log(
      chalk.yellow(
        '   Puedes crear el commit manualmente con: git add . && git commit -m "feat: initial configuration"',
      ),
    )
  }
}

async function configureClaudeCode() {
  console.log(chalk.yellow('🤖 Configurando Claude Code...'))

  // Crear directorios de Claude Code
  await fs.ensureDir('.claude/agents')
  await fs.ensureDir('.claude/commands')

  // Crear archivo de configuración
  const claudeSettings = {
    version: '1.0',
    agents: {
      enabled: true,
      directory: '.claude/agents',
    },
    commands: {
      enabled: true,
      directory: '.claude/commands',
    },
    project: {
      type: 'react-vite-typescript',
      packageManager: 'pnpm',
      testFramework: 'vitest',
      styling: 'tailwind',
    },
    features: {
      stateManagement: 'zustand',
      dataFetching: 'tanstack-query',
      routing: 'react-router',
      formHandling: 'react-hook-form',
      validation: 'zod',
    },
    devTools: {
      testing: {
        ui: true,
        coverage: true,
      },
      linting: {
        autoFix: true,
      },
      formatting: {
        prettier: true,
      },
    },
    optimizations: {
      codeSplitting: true,
      bundleAnalysis: true,
      lazyLoading: true,
    },
    security: {
      xssProtection: true,
      environmentVariables: 'vite-only',
      inputValidation: true,
    },
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
