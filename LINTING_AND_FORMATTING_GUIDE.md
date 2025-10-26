# Linting y Formateo — Guía rápida

Guía para correr y entender las herramientas de calidad de código del monorepo.

## Comandos desde la raíz (lo esencial)

```bash
# Lint + TypeScript (validación completa)
npm run check:all

# Linting en backend y admin
npm run lint:all

# Formateo en backend y landing
npm run format:all

# Solo backend
npm run lint; npm run format; npm run typecheck

# Solo admin
cd frontend/admin-frontend; npx eslint src/

# Solo landing
cd frontend/landing; npx prettier --write .
```

Scripts ya definidos en el package.json raíz:

```json
{
  "lint": "npm run lint --prefix backend/crud-pucara",
  "lint:admin": "cd frontend/admin-frontend && npx eslint src/",
  "lint:all": "npm run lint && npm run lint:admin",
  "format": "npm run format --prefix backend/crud-pucara",
  "format:landing": "cd frontend/landing && npx prettier --write .",
  "format:all": "npm run format && npm run format:landing",
  "typecheck": "npm run typecheck --prefix backend/crud-pucara",
  "check:all": "npm run lint:all && npm run typecheck"
}
```

## Herramientas

- ESLint: linter de código (backend y admin)
- Prettier: formateador (backend, admin y landing)
- TypeScript: verificación de tipos (todo el repo)
- Husky + lint-staged (opcional): ganchos pre-commit para correr linters solo en lo modificado

## Dónde está configurado

- Backend: `backend/crud-pucara`
  - ESLint: `eslint.config.js` (usa `@adonisjs/eslint-config`)
  - Prettier: `package.json` → `"prettier": "@adonisjs/prettier-config"`
  - Scripts locales: `lint`, `format`, `typecheck`
- Admin: `frontend/admin-frontend`
  - ESLint embebido en CRA; se ejecuta en `npm start` y `npm run build`
- Landing: `frontend/landing`
  - Prettier recomendado con `prettier` y `prettier-plugin-astro`

## VS Code (recomendado)

- Extensiones: ESLint, Prettier - Code formatter, Astro
- Ajustes básicos:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Hooks opcionales (pre-commit)

```bash
npm install -D husky lint-staged
npx husky init
```

`package.json` raíz:

```json
{
  "lint-staged": {
    "backend/crud-pucara/**/*.{ts,js}": ["eslint --fix", "prettier --write"],
    "frontend/admin-frontend/src/**/*.{ts,tsx,js,jsx}": ["eslint --fix"],
    "frontend/landing/**/*.{ts,tsx,astro}": ["prettier --write"]
  }
}
```
