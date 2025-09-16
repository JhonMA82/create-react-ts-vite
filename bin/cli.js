#!/usr/bin/env node

import chalk from 'chalk'
import { createProject } from '../lib/index.js'

async function main() {
  const [, , projectName] = process.argv

  if (!projectName) {
    console.error(chalk.red('❌ Error: Debes proporcionar un nombre de proyecto'))
    console.log(chalk.yellow('Uso: create-react-ts-vite <nombre-proyecto>'))
    process.exit(1)
  }

  try {
    await createProject(projectName)
  } catch (error) {
    console.error(chalk.red('❌ Error durante la creación del proyecto:'), error.message)
    process.exit(1)
  }
}

main()
