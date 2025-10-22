## Guía de integración de frontend externo con la API

Esta guía explica cómo consumir el backend de Pucará Esports desde otro frontend (distinto del React Admin incluido). Incluye rutas disponibles, payloads, filtros, ejemplos y consideraciones de CORS/autenticación.

Fecha: 2025-10-18

---

## Base y estado de la API

- Servidor local: http://localhost:3333
- Base path de la API: /api/v1
- Health check: GET /

Respuesta de health check (ejemplo):

```json
{
  "message": "Pucará Esports - Backend API",
  "status": "active",
  "frontend": "React Admin available at http://localhost:3000",
  "api": "API v1 available at /api/v1",
  "endpoints": {
    "teams": "/api/v1/teams",
    "players": "/api/v1/players"
  }
}
```

---

## CORS, headers y autenticación

- CORS: habilitado y permisivo (origin: true). Puedes llamar la API desde otro dominio (localhost:5173, 3001, etc.).
- Headers recomendados:
  - Content-Type: application/json (para POST/PATCH/PUT)
  - Accept: application/json
- Autenticación: Existe configuración de Auth por tokens, pero las rutas actuales NO usan middleware de auth. Es decir, los endpoints son públicos por defecto. Si luego se protege con auth, se usará Bearer Token en el header Authorization.

---

## Modelos y esquema de datos

### Team (tabla: teams)

- team_id: string (UUID)
- name: string
- description: string | null
- achievements: object | null (JSON)
- created_at, updated_at: timestamp

Ejemplo:

```json
{
  "team_id": "c2e1bb8c-5c2d-4a4a-a0a0-4c6c1d1fe123",
  "name": "Pucará A",
  "description": "Equipo principal",
  "achievements": { "2023": "Campeón" },
  "created_at": "2025-10-18T12:00:00.000Z",
  "updated_at": "2025-10-18T12:00:00.000Z"
}
```

### Player (tabla: players)

- player_id: string (UUID)
- name: string
- bio: string | null
- stats: object | null (JSON)
- photo_url: string | null (URL)
- team_id: string | null (UUID de Team) — null = agente libre
- created_at, updated_at: timestamp

Ejemplo:

```json
{
  "player_id": "b7e5e6f9-15f8-4d3a-a3d2-6b0a0a0e9bcd",
  "name": "Jugador 1",
  "bio": "Mid laner",
  "stats": { "rank": "Diamond", "kda": "3.2" },
  "photo_url": "https://example.com/j1.jpg",
  "team_id": null,
  "created_at": "2025-10-18T12:00:00.000Z",
  "updated_at": "2025-10-18T12:00:00.000Z"
}
```

---

## Rutas disponibles (sí, ya están definidas)

Base: /api/v1

### Equipos

- GET /teams — Listar equipos
- POST /teams — Crear equipo
- GET /teams/:team_id — Obtener un equipo (incluye sus players)
- PATCH /teams/:team_id — Actualizar equipo
- DELETE /teams/:team_id — Eliminar equipo
  - Query opcional: deletePlayers=true para borrar también sus jugadores

### Jugadores

- GET /players — Listar jugadores
  - Filtros opcionales (query):
    - teamId=<uuid> — jugadores de ese equipo
    - isFreeAgent=true — jugadores sin equipo (ignora teamId si va true)
- POST /players — Crear jugador
- GET /players/:player_id — Obtener jugador (incluye su team)
- PATCH /players/:player_id — Actualizar jugador
- DELETE /players/:player_id — Eliminar jugador
- PATCH /players/:player_id/assign-team — Asignar o liberar equipo
  - Body: { "team_id": "<uuid>" } o { "team_id": null } para liberar

---

## Payloads esperados

### Crear equipo (POST /teams)

```json
{
  "name": "Pucará A",
  "description": "Equipo principal",
  "achievements": { "2023": "Campeón" }
}
```

### Actualizar equipo (PATCH /teams/:team_id)

```json
{ "name": "Nuevo nombre" }
```

### Crear jugador (POST /players)

```json
{
  "name": "Jugador 1",
  "team_id": "<uuid-optional>",
  "bio": "Mid laner",
  "stats": { "rank": "Diamond" },
  "photo_url": "https://example.com/j1.jpg"
}
```

### Actualizar jugador (PATCH /players/:player_id)

```json
{
  "name": "Jugador 1 Renombrado",
  "team_id": null,
  "bio": "Nueva bio",
  "stats": { "rank": "Master" },
  "photo_url": "https://example.com/new.jpg"
}
```

### Asignar/liberar equipo (PATCH /players/:player_id/assign-team)

```json
{ "team_id": "<uuid>" }
```

o

```json
{ "team_id": null }
```

---

## Ejemplos rápidos

### PowerShell (Invoke-RestMethod)

Listado de equipos:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3333/api/v1/teams"
```

Crear equipo:

```powershell
$body = @{ name = "Pucará A"; description = "Equipo principal" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "http://localhost:3333/api/v1/teams" -ContentType "application/json" -Body $body
```

Jugadores libres:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3333/api/v1/players?isFreeAgent=true"
```

Asignar jugador a equipo:

```powershell
$body = @{ team_id = "<uuid-team>" } | ConvertTo-Json
Invoke-RestMethod -Method PATCH -Uri "http://localhost:3333/api/v1/players/<uuid-player>/assign-team" -ContentType "application/json" -Body $body
```

Liberar jugador (agente libre):

```powershell
$body = @{ team_id = $null } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Method PATCH -Uri "http://localhost:3333/api/v1/players/<uuid-player>/assign-team" -ContentType "application/json" -Body $body
```

Eliminar equipo y sus jugadores:

```powershell
Invoke-RestMethod -Method DELETE -Uri "http://localhost:3333/api/v1/teams/<uuid-team>?deletePlayers=true"
```

### JavaScript (fetch/axios)

Obtener jugadores por equipo:

```js
const res = await fetch(`http://localhost:3333/api/v1/players?teamId=${teamId}`)
const players = await res.json()
```

Crear jugador:

```js
await fetch('http://localhost:3333/api/v1/players', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jugador 1', team_id: null }),
})
```

Actualizar jugador:

```js
await fetch(`http://localhost:3333/api/v1/players/${playerId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ team_id: teamId }),
})
```

---

## Respuestas y errores

Estados comunes:

- 200 OK: lecturas/actualizaciones correctas
- 201 Created: creación exitosa
- 400 Bad Request: validación fallida (VALIDATION_ERROR)
- 404 Not Found: recurso inexistente (NOT_FOUND / TEAM_NOT_FOUND)
- 500 Internal Server Error: error del servidor (INTERNAL_ERROR)

Formato de error (típico):

```json
{
  "message": "Error al crear el jugador",
  "code": "INTERNAL_ERROR"
}
```

Notas:

- GET /teams/:team_id incluye players anidados.
- GET /players incluye relación team en cada jugador.
- No hay paginación por ahora; si la colección crece, considera agregarla.

---

## Puesta en marcha local (rápido)

1. Instalar dependencias backend

```powershell
cd d:\Repos\Pucara\crud-players-pucara
npm install
```

2. Configurar .env (MySQL) y correr migraciones

```powershell
node ace migration:run
```

3. Iniciar API

```powershell
node ace serve --watch
```

---

## Recomendaciones para el otro frontend

- Utiliza un cliente HTTP (fetch, axios) centralizado con baseURL = http://localhost:3333/api/v1
- Define servicios/SDK livianos:
  - teams.getAll(), teams.create(payload), teams.getById(id), teams.update(id, patch), teams.remove(id, opts)
  - players.getAll({ teamId, isFreeAgent }), players.create(payload), players.getById(id), players.update(id, patch), players.remove(id), players.assignTeam(id, { team_id })
- Maneja estados de carga y errores de forma uniforme. Mapear códigos de error (VALIDATION_ERROR, NOT_FOUND, TEAM_NOT_FOUND).
- Si en el futuro se activa Auth, añade header Authorization: Bearer <token> y gestiona expiración/renovación.

---

## Dudas comunes

- ¿Existen APIs para equipos y jugadores? Sí, ver secciones anteriores. Las rutas están definidas en `start/routes.ts`.
- ¿Puedo filtrar jugadores libres? Sí, GET /players?isFreeAgent=true
- ¿Puedo obtener un equipo con sus jugadores? Sí, GET /teams/:team_id retorna players precargados.
- ¿Cómo libero a un jugador? PATCH /players/:player_id/assign-team con { "team_id": null }.

---

Si necesitas una colección de Postman/Thunder Client o un SDK en TS, se puede agregar fácilmente como siguiente paso.
