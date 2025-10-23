# Guía de Integración: Landing ↔ CRUD Pucará

Esta guía explica cómo conectar la landing (Astro) con el backend `crud-pucara` (AdonisJS) para consumir equipos y jugadores.

## 🔌 Resumen de Arquitectura

- Frontend (Landing): `frontend/landing` (Astro, SSR con Vercel adapter)
- Backend (CRUD): `backend/crud-pucara` (AdonisJS, API REST)
- Comunicación: HTTP sobre JSON
- CORS: Habilitado en backend (origin: true)

## 📦 Endpoints Clave

- `GET /api/v1/teams` → Lista de equipos
  - Respuesta: `{ success, message, data: ApiTeam[] }`
- `GET /api/v1/teams/:team_id` → Equipo + jugadores
  - Respuesta: `{ success, message, data: ApiTeam & { players: ApiPlayer[] } }`
- `GET /api/v1/players` → Lista de jugadores (con `teamId` y `isFreeAgent` como filtros opcionales)

Campos principales:

```ts
// Team (backend)
interface ApiTeam {
  teamId: string;
  name: string;
  slug: string | null;
  emoji: string | null;
  bannerUrl: string | null;
  description: string | null;
  achievements: Record<string, string> | null;
}

// Player (backend)
interface ApiPlayer {
  playerId: string;
  name: string;
  bio: string | null;
  stats: Record<string, string> | null;
  photoUrl: string | null;
  teamId: string | null;
}
```

## ⚙️ Configuración de Entorno

En `frontend/landing/.env` agregá la URL del backend:

```env
BACKEND_API_URL=http://localhost:3333
# Si necesitás consumir desde el navegador, exponé también:
# PUBLIC_BACKEND_API_URL=http://localhost:3333
```

En `backend/crud-pucara/config/cors.ts` ya está permitido `origin: true`, por lo que no deberías tocar nada para desarrollo. Si querés restringir en producción, definí los orígenes permitidos.

## 🔧 Implementación en el Frontend

Se agregaron/actualizaron estos módulos en la landing:

- `src/data/api.ts`: Cliente HTTP con base URL configurable por `.env`
- `src/data/teams.ts`: Funciones para obtener equipos y jugadores desde el backend
  - `getAllTeams()`
  - `getTeamById(slugOrId)`
  - `getTeamStaticPaths()`
- `src/data/players.ts`: Funciones específicas de jugadores

### Mapeo de datos y rutas

- Se generan slugs a partir de `team.slug` (preferido) o `team.name` (ej: "Dota 2" → `dota-2`) para las rutas `/teams/:team`.
- `getTeamStaticPaths()` obtiene todos los equipos del backend y genera rutas estáticas para cada uno usando su slug.
- `getTeamById(slugOrId)` acepta el slug almacenado, el slug generado desde el nombre, o el `teamId` UUID.
- Los campos `slug`, `emoji` y `bannerUrl` ya están disponibles en el backend y se usan directamente en la landing.
- `Player.stats` contiene campos estructurados: `edad`, `rol`, `nacionalidad`, `instagram` para mejor tipado.

### Compatibilidad con la UI actual

La UI existente espera este shape:

```ts
interface PlayerUI {
  nombre: string;
  edad: number;
  nacionalidad: string;
  rol: string;
  instagram: string;
  imagen: string;
}
interface TeamUI {
  id: string; // slug
  nombre: string;
  emoji: string;
  bgClass: string;
  descripcion: string;
  imagen: string; // banner
  players: PlayerUI[];
}
```

Se mapea automáticamente desde el backend:

- `Team.slug` → `id` (preferido, o generado desde name)
- `Team.emoji` → `emoji` (o "🎮" por defecto)
- `Team.bannerUrl` → `imagen` (o placeholder si no existe)
- `Team.description` → `descripcion`
- `Player.name` → `nombre`
- `Player.photoUrl` → `imagen`
- `Player.stats` → `edad` | `rol` | `nacionalidad` | `instagram` (si existen). Si no, se colocan valores por defecto.

## ▶️ Ejecución Local

1. Terminal 1: Backend CRUD

```powershell
cd backend/crud-pucara
npm install
node ./bin/server.ts  # o npm run dev si está configurado
# API en http://localhost:3333
```

2. Terminal 2: Landing

```powershell
cd frontend/landing
npm install
# Asegurate que .env tenga BACKEND_API_URL=http://localhost:3333
npm run dev
# App en http://localhost:4321
```

3. Probar rutas

- Abrí `http://localhost:4321/teams` → debería listar equipos del backend
- Abrí un equipo: `http://localhost:4321/teams/<slug>`

## 🚀 Deploy

- Backend: desplegar en tu infraestructura preferida (PM2, Docker, Railway, Render, etc.).
- Landing: Vercel (ya configurado con `@astrojs/vercel`).
- Variables en producción:
  - En Vercel: `BACKEND_API_URL=https://api.midominio.com`
  - Si necesitás consumo desde browser: `PUBLIC_BACKEND_API_URL`.

## 🧪 Troubleshooting

- 404 en `/teams/:team` → Revisá que existan equipos en el backend y que los slugs se generen bien desde `name`.
- CORS error → Confirmá que `origin: true` en backend o agregá el dominio de la landing en producción.
- Datos faltantes en jugadores → El componente muestra defaults si `stats` no tiene `edad`, `rol`, `nacionalidad` o `instagram`.
- Imagen de jugador vacía → Se usa `/players/default.png`. Agregá un asset o completá `photoUrl` en el backend.

## 📌 Próximas mejoras (sugeridas)

- Estandarizar estructura de `stats` de `Player` en el backend con tipos fuertes (age: number, role: string, etc.).
- Cachear llamadas en SSR con `Astro.cookies`/`ETag` o usar endpoints proxy en la landing.
- Paginación/filters en listado de jugadores.
- Agregar imágenes de banners específicos por equipo.

---

Con esto, la landing ya consume equipos y jugadores del CRUD. 🎮
