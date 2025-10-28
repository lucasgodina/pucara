# Comandos desde la raíz

Ejecutar estos comandos desde `d:\Repos\Pucara` (raíz del monorepo) sin necesidad de navegar entre carpetas.

## Desarrollo

```bash
# Levantar API + Admin + Landing simultáneamente (recomendado)
npm run dev:all
# o simplemente
npm run dev

# Levantar servicios individuales
npm run dev:api      # Backend en :3333
npm run dev:admin    # Admin en :3000
npm run dev:landing  # Landing en :4321
```

## Instalación

```bash
# Instalar dependencias de todos los proyectos a la vez
npm run install:all

# Ahorra ~5 minutos vs instalar manualmente en cada carpeta
```

## Build

```bash
# Compilar todos los proyectos para producción
npm run build:all

# Build individual
npm run build:api
npm run build:admin
npm run build:landing
```

## Linting y formateo

```bash
# Lint backend + admin
npm run lint:all

# Formatear backend + landing
npm run format:all

# Validación TypeScript completa
npm run check:all
```

## Por proyecto individual

```bash
# Solo backend
npm run lint
npm run format
npm run typecheck

# Solo admin
npm run lint:admin

# Solo landing
npm run format:landing
```

## Ventajas

- **Ahorro de tiempo**: no necesitas `cd` entre carpetas.
- **Un comando para todo**: `npm run dev` levanta los 3 servicios en paralelo.
- **Logs coloreados**: verde=api, azul=admin, magenta=landing (con concurrently).
- **CI/CD ready**: un comando valida/compila todo el repo.
- **Consistencia**: todos los devs corren los mismos scripts.

## Comandos completos disponibles

```bash
npm run dev            # = dev:all
npm run dev:all        # Levantar todo
npm run dev:api        # Solo backend
npm run dev:admin      # Solo admin
npm run dev:landing    # Solo landing

npm run install:all    # Instalar deps en todo el monorepo

npm run build          # = build:all
npm run build:all      # Compilar todo
npm run build:api      # Solo backend
npm run build:admin    # Solo admin
npm run build:landing  # Solo landing

npm run preview:landing # Preview de landing compilado

npm run lint           # Backend
npm run lint:admin     # Admin
npm run lint:all       # Backend + Admin

npm run format         # Backend
npm run format:landing # Landing
npm run format:all     # Backend + Landing

npm run typecheck      # Backend
npm run check:all      # Lint + TypeScript completo
```
