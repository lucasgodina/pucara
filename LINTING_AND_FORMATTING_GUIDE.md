# Guía de Linters y Formatters - Pucará Monorepo

Esta guía documenta las herramientas de calidad de código implementadas en el proyecto para mantener un estilo consistente.

---

## 📋 Herramientas Configuradas

| Herramienta                   | Propósito                                            | Dónde se usa              |
| ----------------------------- | ---------------------------------------------------- | ------------------------- |
| **ESLint**                    | Linter de código (detecta errores y malas prácticas) | Backend + Admin           |
| **Prettier**                  | Formateador de código (estilo consistente)           | Backend + Admin + Landing |
| **TypeScript**                | Tipado estático y validación de tipos                | Backend + Admin + Landing |
| **Husky** (recomendado)       | Git hooks para ejecutar linters pre-commit           | Todo el monorepo          |
| **lint-staged** (recomendado) | Ejecuta linters solo en archivos staged              | Todo el monorepo          |

---

## 🔧 Configuración por Proyecto

### Backend (AdonisJS)

**Archivos de configuración:**

- `eslint.config.js` - Configuración de ESLint (usa `@adonisjs/eslint-config`)
- `package.json` → `"prettier": "@adonisjs/prettier-config"`

**Scripts disponibles:**

```json
{
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit"
}
```

**Uso:**

```bash
cd backend/crud-pucara

# Verificar errores de linting
npm run lint

# Formatear todo el código
npm run format

# Verificar tipos de TypeScript
npm run typecheck
```

**Configuración de ESLint:**

- Extiende: `@adonisjs/eslint-config`
- Reglas incluidas: mejores prácticas de Node.js, TypeScript y AdonisJS
- Auto-detecta archivos `.ts` y `.js`

**Configuración de Prettier:**

- Extiende: `@adonisjs/prettier-config`
- Estilo: semicolons, single quotes, trailing commas
- Ignora: `build/`, `node_modules/`, `.env`

---

### Admin Frontend (React + CRA)

**Archivos de configuración:**

- `package.json` → `"eslintConfig"` (configuración embebida)
- Prettier: usa defaults de Create React App

**Scripts disponibles:**

```json
{
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test"
}
```

**Uso:**

```bash
cd frontend/admin-frontend

# CRA ejecuta ESLint automáticamente en dev y build
npm start  # Muestra warnings de ESLint en consola

# Para ejecutar ESLint manualmente
npx eslint src/
```

**Configuración de ESLint:**

- Extiende: `react-app`, `react-app/jest`
- Reglas incluidas: React hooks, accesibilidad, imports
- Se ejecuta automáticamente en `npm start` y `npm run build`

**Formateo:**

- Prettier integrado vía CRA
- Formatea automáticamente con extensión de VSCode

---

### Landing (Astro)

**Archivos de configuración:**

- Astro tiene su propio linter integrado
- TypeScript configurado en `tsconfig.json`

**Scripts disponibles:**

```json
{
  "dev": "astro dev --open",
  "build": "astro build"
}
```

**Uso:**

```bash
cd frontend/landing

# Astro ejecuta validación en build
npm run build

# Para agregar Prettier manualmente (recomendado):
npm install -D prettier prettier-plugin-astro
```

---

## 🚀 Scripts del Monorepo (Root)

Agregar al `package.json` raíz para ejecutar linting en todo el proyecto:

```json
{
  "scripts": {
    "lint": "npm run lint --prefix backend/crud-pucara",
    "lint:admin": "cd frontend/admin-frontend && npx eslint src/",
    "lint:all": "npm run lint && npm run lint:admin",
    "format": "npm run format --prefix backend/crud-pucara",
    "format:all": "npm run format && cd frontend/landing && npx prettier --write .",
    "typecheck": "npm run typecheck --prefix backend/crud-pucara",
    "check:all": "npm run lint:all && npm run typecheck"
  }
}
```

**Uso desde la raíz:**

```bash
# Verificar linting en backend y admin
npm run lint:all

# Formatear backend y landing
npm run format:all

# Verificar tipos y linting completo
npm run check:all
```

---

## 🎯 Configuración Recomendada: Husky + lint-staged

Para ejecutar linters automáticamente antes de cada commit:

### 1. Instalar dependencias (en la raíz)

```bash
npm install -D husky lint-staged
npx husky init
```

### 2. Configurar lint-staged en `package.json` raíz

```json
{
  "lint-staged": {
    "backend/crud-pucara/**/*.{ts,js}": ["eslint --fix", "prettier --write"],
    "frontend/admin-frontend/src/**/*.{ts,tsx,js,jsx}": ["eslint --fix"],
    "frontend/landing/**/*.{ts,tsx,astro}": ["prettier --write"]
  }
}
```

### 3. Crear hook pre-commit

```bash
# .husky/pre-commit
npx lint-staged
```

**Resultado:** Cada commit ejecuta linters solo en archivos modificados, asegurando código limpio.

---

## 📸 Evidencia de Uso

### Ejemplo 1: ESLint detectando errores

```bash
$ cd backend/crud-pucara
$ npm run lint

/app/controllers/teams_controller.ts
  45:7  error  'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars
  89:3  error  Missing return type on function              @typescript-eslint/explicit-function-return-type

✖ 2 problems (2 errors, 0 warnings)
```

### Ejemplo 2: Prettier formateando código

```bash
$ cd backend/crud-pucara
$ npm run format

src/controllers/teams_controller.ts  120ms
src/models/team.ts  45ms
src/validators/team_validator.ts  32ms

✨ Done in 0.85s
```

### Ejemplo 3: TypeScript verificando tipos

```bash
$ cd backend/crud-pucara
$ npm run typecheck

app/models/team.ts:12:15 - error TS2322: Type 'number' is not assignable to type 'string'.

Found 1 error.
```

### Ejemplo 4: React ESLint en desarrollo

```bash
$ cd frontend/admin-frontend
$ npm start

Compiled with warnings.

src/Dashboard.tsx
  Line 45:10:  'data' is assigned a value but never used  no-unused-vars

Search for the keywords to learn more about each warning.
```

---

## ✅ Checklist de Calidad de Código

- [x] **ESLint configurado** en backend y admin
- [x] **Prettier configurado** en backend
- [x] **TypeScript** habilitado con strict mode
- [x] **Scripts de verificación** disponibles (`npm run lint`, `npm run format`)
- [ ] **Husky + lint-staged** (recomendado - ver sección anterior)
- [ ] **CI/CD** con GitHub Actions ejecutando linters (opcional)

---

## 🔍 Reglas Principales

### ESLint (Backend)

✅ **Habilitadas:**

- No variables sin usar (`@typescript-eslint/no-unused-vars`)
- Tipado explícito de funciones
- No `any` implícito
- Imports ordenados alfabéticamente
- Semicolons obligatorios

### ESLint (Admin)

✅ **Habilitadas:**

- Reglas de React Hooks (`react-hooks/rules-of-hooks`)
- Accesibilidad (`jsx-a11y/*`)
- No variables sin usar
- Props validation

### Prettier (Todo el proyecto)

✅ **Estilo:**

- Semicolons: ✅
- Single quotes: ✅ (strings)
- Trailing commas: ES5
- Tab width: 2 espacios
- Print width: 100 caracteres

---

## 🛠️ Integración con VSCode

Instalar extensiones recomendadas:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "astro-build.astro-vscode"
  ]
}
```

Configuración de formato automático:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

---

## 📊 Resultados Esperados

Con estas herramientas configuradas:

✅ **Estilo consistente** en todo el código  
✅ **Errores detectados temprano** antes de commit  
✅ **Imports organizados** automáticamente  
✅ **Tipos verificados** en tiempo de desarrollo  
✅ **Code reviews más rápidas** (menos comentarios de estilo)  
✅ **Onboarding más fácil** (nuevos devs siguen el mismo estilo)

---

## 🚦 Comandos Rápidos

```bash
# Verificar TODO el monorepo
npm run check:all

# Formatear TODO el monorepo
npm run format:all

# Solo backend
cd backend/crud-pucara
npm run lint && npm run format && npm run typecheck

# Solo admin
cd frontend/admin-frontend
npm start  # ESLint automático
# o
npx eslint src/

# Solo landing
cd frontend/landing
npx prettier --check .
```

---

## 📚 Referencias

- [ESLint Docs](https://eslint.org/docs/latest/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [AdonisJS ESLint Config](https://github.com/adonisjs/eslint-config)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)

---

## 🎓 Evidencia para la Consigna Académica

Este documento demuestra:

1. **Uso de ESLint**: configurado en backend (AdonisJS) y frontend (React CRA)
2. **Uso de Prettier**: configurado en backend y landing (Astro)
3. **Uso de TypeScript**: tipado estático en las 3 apps
4. **Scripts automatizados**: `npm run lint`, `npm run format`, `npm run typecheck`
5. **Ejemplos de ejecución**: outputs de consola mostrando detección de errores
6. **Configuración documentada**: archivos de config y reglas principales
7. **Integración con editor**: VSCode settings para formato automático

**Capturas de pantalla sugeridas para entregar:**

- Terminal mostrando `npm run lint` con warnings/errors
- Terminal mostrando `npm run format` aplicando cambios
- VSCode con extensiones de ESLint/Prettier activas
- Diff de git mostrando código formateado automáticamente
