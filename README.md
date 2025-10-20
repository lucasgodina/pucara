# 🎮 Pucará Esports - CRUD Players

Sistema de gestión de jugadores y equipos de esports con React Admin + AdonisJS.

## 🚀 Arquitectura

- **Backend**: AdonisJS (Node.js + TypeScript)
- **Frontend**: React Admin (React + Material-UI)
- **Base de datos**: MySQL

## 📦 Instalación

### 1. Backend (AdonisJS)

```bash
cd d:\Pucara\crud-players-pucara
npm install
```

### 2. Frontend (React Admin)

```bash
cd admin-frontend
npm install
```

## 🔧 Configuración

### Base de datos

1. Configura tu base de datos MySQL en `.env`
2. Ejecuta las migraciones:

```bash
node ace migration:run
```

### Archivos de configuración

- `.env` - Variables de entorno
- `config/database.ts` - Configuración de base de datos
- `config/cors.ts` - Configuración CORS

## 🎯 Uso

### Iniciar el Backend

```bash
node ace serve --watch
```

**Servidor:** http://localhost:3333

### Iniciar el Frontend

```bash
cd admin-frontend
npm start
```

**Interfaz:** http://localhost:3000

## 🛠️ Funcionalidades

### Gestión de Equipos

- ✅ Crear equipos
- ✅ Editar equipos
- ✅ Eliminar equipos
- ✅ Listar equipos

### Gestión de Jugadores

- ✅ Crear jugadores
- ✅ Editar jugadores
- ✅ Eliminar jugadores
- ✅ Asignar/reasignar equipos
- ✅ Gestionar jugadores libres
- ✅ Subir fotos de jugadores
- ✅ Estadísticas en formato JSON

### Características Técnicas

- 🔒 **UUIDs** para IDs únicos y seguros
- 🌐 **API RESTful** completa
- 📱 **Interfaz responsiva** con Material-UI
- 🔄 **Validaciones** en backend y frontend
- 🚀 **Carga asíncrona** de datos

## 📚 Estructura del Proyecto

```
crud-players-pucara/
├── app/
│   ├── controllers/     # Controladores de API
│   ├── models/         # Modelos de datos
│   └── validators/     # Validaciones
├── admin-frontend/     # Frontend React Admin
│   ├── src/
│   │   ├── players.tsx # Gestión de jugadores
│   │   ├── teams.tsx   # Gestión de equipos
│   │   └── dataProvider.ts # Conexión con API
├── config/            # Configuración del servidor
├── database/          # Migraciones
└── start/            # Rutas y configuración inicial
```

## 🔗 Endpoints API

### Equipos

- `GET /api/v1/teams` - Listar equipos
- `POST /api/v1/teams` - Crear equipo
- `GET /api/v1/teams/:id` - Obtener equipo
- `PATCH /api/v1/teams/:id` - Actualizar equipo
- `DELETE /api/v1/teams/:id` - Eliminar equipo

### Jugadores

- `GET /api/v1/players` - Listar jugadores
- `POST /api/v1/players` - Crear jugador
- `GET /api/v1/players/:id` - Obtener jugador
- `PATCH /api/v1/players/:id` - Actualizar jugador
- `DELETE /api/v1/players/:id` - Eliminar jugador

## 🎨 Interfaz de Usuario

- **Dashboard**: Resumen de equipos y jugadores
- **Lista de jugadores**: Con fotos, equipos y estadísticas
- **Formularios**: Crear/editar jugadores con selector de equipos
- **Gestión de equipos**: CRUD completo
- **Filtros**: Por equipo, jugadores libres, etc.

## 🔧 Desarrollo

### Comandos útiles

```bash
# Backend
node ace serve --watch    # Servidor con hot reload
node ace migration:run    # Ejecutar migraciones
node ace migration:rollback # Revertir migraciones

# Frontend
npm start                 # Servidor de desarrollo
npm run build            # Build para producción
```

### Variables de entorno importantes

```env
PORT=3333
HOST=localhost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=pucara_players_crud_api
```

## 📝 Notas

- El sistema usa **UUIDs** para mayor seguridad
- Los jugadores pueden ser "Agentes Libres" (sin equipo)
- Las estadísticas se almacenan en formato JSON
- La interfaz es completamente responsive
- El backend es una API pura (sin vistas HTML)

## 📘 Guía de integración para otro frontend

Si vas a consumir esta API desde otro frontend distinto al React Admin incluido, consulta la guía:

- docs/guia-integracion-frontend.md
- docs/guia-consumo-astro.md (solo lectura desde un sitio Astro)

¡Listo para gestionar tu equipo de esports! 🚀
