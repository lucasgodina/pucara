## Guía de consumo (solo lectura) desde un frontend Astro

Objetivo: consumir equipos y jugadores existentes desde un sitio en Astro, únicamente en modo lectura. El CRUD (crear/editar/eliminar) seguirá siendo exclusivo del `admin-frontend`.

Fecha: 2025-10-18

---

## ¿DB directa o GET de la API?

- Usa SIEMPRE la API vía GET, NO accedas a la base de datos desde Astro.
- Razones:
  - Seguridad: no exponer credenciales de DB al frontend ni a su entorno de build.
  - Acoplamiento: la API ya define el shape y las relaciones; cambiar el modelo en el backend no rompe tu Astro si usas la API.
  - Validaciones y relaciones: el backend ya precarga `team` en players y `players` en team/:id.

Base URL de la API en local: `http://localhost:3333/api/v1`

---

## Endpoints de solo lectura a usar

- Equipos
  - GET `/teams` → lista de equipos
    - Respuesta envuelta: `{ success, message, data: Team[] }`
  - GET `/teams/:team_id` → un equipo con sus jugadores
    - Respuesta envuelta: `{ success, message, data: TeamConJugadores }`

- Jugadores
  - GET `/players` → lista de jugadores
    - Respuesta directa: `Player[]` (nota: NO viene envuelta)
  - Filtros opcionales:
    - `?teamId=<uuid>` → jugadores de ese equipo
    - `?isFreeAgent=true` → solo jugadores sin equipo (ignora `teamId`)

Notas de shape:

- Teams (index/show) devuelven `{ data: ... }` dentro de un objeto.
- Players (index/show) devuelven el recurso directo sin `{ data }`.

Recomendación: tener un helper que "desenvuelva" la respuesta: `const payload = json.data ?? json`.

---

## Configuración en Astro

1. Define la base de la API en `.env` del proyecto Astro:

```
PUBLIC_API_BASE=http://localhost:3333/api/v1
```

2. Usa `import.meta.env.PUBLIC_API_BASE` en tus fetch. Como es lectura pública, está bien que sea `PUBLIC_`.

3. Prefiere fetch del lado servidor (en frontmatter de `.astro`, durante el build o SSR) para evitar CORS en el navegador y para cachear en build si haces SSG.

---

## Tipos sugeridos (opcional)

```ts
// src/types/api.ts (en tu proyecto Astro)
export type Team = {
  team_id: string
  name: string
  description: string | null
  achievements: Record<string, string> | null
}

export type Player = {
  player_id: string
  name: string
  bio: string | null
  stats: Record<string, string> | null
  photo_url: string | null
  team_id: string | null
  team?: Team | null
}
```

---

## SDK liviano para la API (recomendado)

```ts
// src/lib/api.ts (en tu proyecto Astro)
import type { Team, Player } from '@/types/api'

const API_BASE = import.meta.env.PUBLIC_API_BASE ?? 'http://localhost:3333/api/v1'

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  const json = await res.json()
  // Unificar shapes: teams usan { data }, players devuelven directo
  return (json?.data ?? json) as T
}

export const api = {
  // Equipos
  getTeams: () => http<Team[]>(`/teams`),
  getTeamById: (teamId: string) => http<Team & { players: Player[] }>(`/teams/${teamId}`),

  // Jugadores
  getPlayers: (opts?: { teamId?: string; isFreeAgent?: boolean }) => {
    const p = new URLSearchParams()
    if (opts?.isFreeAgent) p.set('isFreeAgent', 'true')
    else if (opts?.teamId) p.set('teamId', opts.teamId)
    const qs = p.toString()
    return http<Player[]>(`/players${qs ? `?${qs}` : ''}`)
  },
}
```

---

## Ejemplos en Astro

### 1) Página SSG con listado de equipos

```astro
---
import { api } from "@/lib/api"
const teams = await api.getTeams()
---

<h1>Equipos</h1>
<ul>
  {teams.map((t) => (
    <li>
      <a href={`/teams/${t.team_id}`}>{t.name}</a>
    </li>
  ))}
  {!teams.length && <li>No hay equipos disponibles</li>}
</ul>
```

### 2) Página dinámica para un equipo con sus jugadores

Archivo: `src/pages/teams/[team_id].astro`

```astro
---
import { api } from "@/lib/api"
const { team_id } = Astro.params
const team = await api.getTeamById(team_id!)
---

<h1>{team.name}</h1>
{team.description && <p>{team.description}</p>}

<h2>Jugadores</h2>
<ul>
  {team.players?.map((p) => (
    <li>{p.name}</li>
  ))}
  {!team.players?.length && <li>No hay jugadores en este equipo</li>}
</ul>
```

### 3) Listado de jugadores con filtros (libres o por equipo)

```astro
---
import { api } from "@/lib/api"
const url = new URL(Astro.request.url)
const teamId = url.searchParams.get("teamId") || undefined
const isFreeAgent = url.searchParams.get("isFreeAgent") === "true"
const players = await api.getPlayers({ teamId, isFreeAgent })
---

<h1>Jugadores</h1>
<form method="get">
  <input type="text" name="teamId" placeholder="Team UUID" value={teamId || ""} />
  <label>
    <input type="checkbox" name="isFreeAgent" checked={isFreeAgent} /> Solo libres
  </label>
  <button type="submit">Filtrar</button>
  <a href="/players">Limpiar</a>

  <p style="opacity:0.7;">Tip: si `isFreeAgent=true`, `teamId` se ignora.</p>

  <hr />
</form>

<ul>
  {players.map((p) => (
    <li>
      {p.name} {p.team ? `(Equipo: ${p.team.name})` : "(Agente libre)"}
    </li>
  ))}
  {!players.length && <li>No se encontraron jugadores</li>}

  <hr />
  <small>Los jugadores incluyen la relación `team` precargada.</small>
</ul>
```

---

## CORS y despliegue

- CORS está habilitado en el backend y permite orígenes distintos. Si haces fetch en el cliente (navegador), funcionará.
- Ideal: realizar fetch en server-side (SSG/SSR) para reducir dependencia del navegador y poder cachear en build.
- Producción: configura `PUBLIC_API_BASE` con la URL pública del backend.

---

## Recordatorio: CRUD solo en admin-frontend

- No llames a POST/PATCH/DELETE desde Astro. Esas rutas están pensadas para el `admin-frontend/`.
- En este sitio Astro solo usa GET de:
  - `/teams`
  - `/teams/:team_id`
  - `/players` (con `teamId` o `isFreeAgent` si hace falta)

---

## Manejo de errores (sugerido)

```ts
try {
  const players = await api.getPlayers()
} catch (e) {
  console.error(e)
  // Renderiza fallback amigable
}
```

Si el backend devuelve error de validación o 404, el SDK lanzará `Error` con el texto de respuesta.

---

¿Querés que prepare un ejemplo mínimo de proyecto Astro con estas páginas y el SDK? Puedo generarlo como base de arranque.
