# Create React TS Vite

[![npm version](https://img.shields.io/npm/v/create-react-ts-vite)](https://www.npmjs.com/package/create-react-ts-vite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >=18](https://img.shields.io/badge/Node.js-%3E=18-blue.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-green.svg)](https://reactjs.org/)

🚀 CLI para generar proyectos React + Vite + TypeScript con configuración completa y mejores prácticas para 2025.

## 📋 Tabla de Contenidos

- [🎯 Descripción General del Proyecto](#-descripción-general-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🔧 Instalación y Configuración](#-instalación-y-configuración)
- [💡 Guía de Uso](#-guía-de-uso)
- [🤝 Guía de Contribución](#-guía-de-contribución)
- [🛠️ Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📄 Licencia](#-licencia)

---

## 🎯 Descripción General del Proyecto

Create React TS Vite es una herramienta de línea de comandos (CLI) diseñada para acelerar el desarrollo de aplicaciones web modernas. Resuelve el problema común de configurar desde cero un entorno React con TypeScript, Vite y herramientas de testing y estilos, permitiendo a los desarrolladores enfocarse en la lógica de negocio en lugar de en la boilerplate.

La motivación detrás de este proyecto es proporcionar una plantilla lista para usar que incorpore las mejores prácticas actuales, como compilación ultra-rápida con Vite, manejo de estado eficiente y testing robusto, todo optimizado para proyectos escalables en 2025.

<!-- Si tienes un GIF o screenshot, agrégalo aquí: ![Demo](path/to/demo.gif) -->

---

## ✨ Características Principales

- ⚛️ **React 18 con TypeScript**: Soporte completo para componentes tipados y hooks modernos.
- ⚡ **Vite con SWC**: Compilación y hot-reload ultra-rápidos para un desarrollo fluido.
- 🧪 **Vitest + React Testing Library**: Testing unitario e integración preconfigurados para una cobertura confiable.
- 🎨 **Tailwind CSS**: Estilos utilitarios listos para usar, con configuración personalizable.
- 📡 **Axios**: Cliente HTTP integrado para llamadas API seguras y eficientes.
- 🧭 **React Router**: Enrutamiento declarativo para SPAs complejas.
- 🎯 **Zustand**: Gestión de estado global ligera y sin boilerplate.
- 📊 **TanStack Query**: Manejo de datos asíncronos con caching y sincronización automática.
- 🔧 **ESLint + Prettier**: Linting y formateo automáticos para código limpio y consistente.
- 📝 **Scripts optimizados**: Comandos listos en `package.json` para build, test y deploy.

---

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js versión 18 o superior.
- npm, yarn o pnpm como gestor de paquetes.

### Instalación Global
Instala la CLI globalmente para usarla en cualquier proyecto:

```bash
npm install -g create-react-ts-vite
```

O usa npx para una instalación temporal:

```bash
npx create-react-ts-vite mi-proyecto
```

### Dependencias del Proyecto Generado
Una vez generado el proyecto, instala las dependencias locales:

```bash
cd mi-proyecto
pnpm install  # O npm install / yarn install
```

No se requieren configuraciones adicionales; todo está preconfigurado.

---

## 💡 Guía de Uso

1. **Generar un nuevo proyecto**:
   ```bash
   create-react-ts-vite mi-proyecto
   ```
   Esto crea una carpeta `mi-proyecto` con la estructura completa.

2. **Navegar y ejecutar**:
   ```bash
   cd mi-proyecto
   pnpm dev  # Inicia el servidor de desarrollo en http://localhost:5173
   ```

3. **Ejemplo de flujo básico**:
   - Edita `src/App.tsx` para agregar componentes.
   - Usa `pnpm test` para ejecutar pruebas.
   - Construye para producción con `pnpm build`.

Consulta el archivo `templates/claude.md` en el proyecto generado para guías detalladas sobre personalización y flujos de usuario.

---

## 🤝 Guía de Contribución

¡Las contribuciones son bienvenidas! Para mejorar este proyecto:

1. **Fork del repositorio**: Crea una copia en tu cuenta de GitHub.
2. **Clona y crea una rama**: 
   ```bash
   git clone https://github.com/tu-usuario/create-react-ts-vite.git
   cd create-react-ts-vite
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Realiza cambios**: Asegúrate de seguir las convenciones de código (TypeScript, ESLint).
4. **Commit y push**:
   ```bash
   git commit -am 'Agregar nueva funcionalidad'
   git push origin feature/nueva-funcionalidad
   ```
5. **Crea un Pull Request**: Describe los cambios y enlaza issues si aplica.

- Reporta bugs en [Issues](https://github.com/tu-usuario/create-react-ts-vite/issues).
- Para estilo de código, revisa `.eslintrc.js` y `prettier.config.js`.
- Pruebas: Ejecuta `npm test` antes de enviar.

Gracias por contribuir a hacer esta herramienta mejor.

---

## 🛠️ Tecnologías Utilizadas

- **Lenguajes**: TypeScript, JavaScript (ESNext)
- **Frameworks**: React 18, Vite 5
- **Testing**: Vitest, React Testing Library
- **Estilos**: Tailwind CSS
- **Estado y Datos**: Zustand, TanStack Query, Axios
- **Enrutamiento**: React Router DOM
- **Herramientas**: ESLint, Prettier, SWC
- **Gestor de Paquetes**: pnpm (recomendado), npm/yarn compatibles

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE). Ver [LICENSE](LICENSE) para detalles completos.
