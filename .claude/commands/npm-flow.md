# Comando: /npm-flow
## Objetivo
Gestionar el flujo completo de desarrollo-release para paquetes npm usando Conventional Commits + release-please + GitHub Actions, con verificación automática de configuración.

## Contexto
- Versionado automático via release-please (NO tocar package.json manualmente)
- Commits validados por commitlint + husky
- Publicación segura via GitHub Actions con provenance
- Soporte para monorepo y paquetes individuales

## Instrucciones Detalladas

### 1. Análisis del Repositorio
- Detectar si es monorepo (workspaces en package.json o estructura packages/*)
- Verificar configuración actual de release-please
- Comprobar estado de hooks de husky y commitlint
- Revisar configuración de GitHub Actions

### 2. Configuración Automática
Si faltan archivos de configuración, crearlos:

**Para repositorio simple:**
// .github/.release-please-manifest.json
{ ".": "0.0.0" }

// .github/release-please-config.json
{
"release-type": "node",
"include-v-in-tag": true,
"packages": { ".": {} }
}


**Para monorepo:**
- Detectar paquetes automáticamente en packages/* o según workspaces
- Generar manifest con versión inicial para cada paquete
- Configurar release-please para manejar paquetes independientes

### 3. Verificación de Workflows
Comprobar existencia y configuración correcta de:
- `.github/workflows/release-please.yml`
- `.github/workflows/publish-npm.yml`

Si faltan, generar con:
- Permisos mínimos necesarios
- Uso de provenance para seguridad
- Verificación post-publicación

### 4. Gestión de Commits
Para cambios pendientes:
- Analizar diff y sugerir mensaje Conventional Commit apropiado
- Validar formato antes de commit
- Categorizar cambios: feat, fix, docs, refactor, test, chore, ci
- Identificar breaking changes que requieren MAJOR version

### 5. Release PR Management
- Verificar si existe Release PR activo
- Mostrar preview de changelog
- Listar paquetes que serán versionados
- Mostrar impacto del version bump (patch/minor/major)

### 6. Verificación Pre-Release
Antes de sugerir merge del Release PR:
- Verificar que tests pasan
- Confirmar que build es exitoso
- Revisar que NPM_TOKEN está configurado como secreto
- Validar permisos de GitHub Actions

### 7. Monitoreo Post-Release
Después de release published:
- Verificar que la publicación a npm fue exitosa
- Confirmar que provenance se generó correctamente
- Mostrar enlaces a GitHub Release y paquete npm
- Sugerir próximos pasos o mejoras

## Comandos de Acción
Proporcionar comandos específicos según la situación:
- `/npm-flow setup` - Configuración inicial completa
- `/npm-flow commit` - Asistir con commit convencional
- `/npm-flow status` - Estado actual del release
- `/npm-flow release` - Preparar y revisar Release PR
- `/npm-flow verify` - Verificar configuración completa

## Output
- Diagnóstico completo del estado actual
- Archivos de configuración necesarios
- Sugerencias de mensajes de commit
- Preview de changelog y version bumps
- Checklist de verificación pre-release
- Comandos de terminal listos para ejecutar
