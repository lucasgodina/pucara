# Backend API - Pucará Esports

API REST construida con **AdonisJS 6** para la gestión completa de equipos, jugadores, noticias y usuarios de esports.

---

## 🎯 Descripción

API RESTful con arquitectura MVC que proporciona endpoints para operaciones CRUD sobre:

- **Equipos** (Teams)
- **Jugadores** (Players)
- **Noticias** (News)
- **Usuarios** (Users)

Sistema de autenticación basado en **Access Tokens** con soporte para 3 roles: `admin`, `editor` y `user`.

---

## 🛠️ Stack Tecnológico

| Tecnología     | Versión | Propósito                     |
| -------------- | ------- | ----------------------------- |
| **AdonisJS**   | 6.18.0  | Framework backend             |
| **Lucid ORM**  | 21.6.1  | Interacción con base de datos |
| **SQLite**     | -       | Base de datos (desarrollo)    |
| **PostgreSQL** | -       | Base de datos (producción)    |
| **VineJS**     | 3.0.1   | Validación de datos           |
| **TypeScript** | 5.8.x   | Lenguaje principal            |

---

## 📁 Estructura

```
app/
├── controllers/      # Lógica de endpoints (auth, teams, players, news, users)
├── models/          # Modelos Lucid (User, Team, Player, News)
├── middleware/      # Auth, CORS, validaciones, error handling
├── validators/      # Esquemas VineJS para validación
├── helpers/         # Utilidades (response_helper)
└── services/        # Lógica de negocio reutilizable

config/              # Configuración (auth, database, cors, cloudinary)
database/
├── migrations/      # Esquema de base de datos
└── seeders/         # Datos iniciales (admin + equipos + jugadores)

start/
├── routes.ts        # Definición de rutas API
└── kernel.ts        # Middleware stack
```

---

## 🔐 Autenticación

**Sistema**: Access Tokens (Bearer token)  
**Expiración**: 7 días  
**Roles disponibles**:

- `admin` - Acceso total, single session (un token activo)
- `editor` - Gestión de contenido
- `user` - Lectura y operaciones limitadas

**Endpoints**:

- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login (retorna token)
- `GET /api/v1/auth/me` - Usuario actual
- `DELETE /api/v1/auth/logout` - Logout (revoca token)

---

## 🔗 Endpoints Principales

### Equipos

```
GET    /api/v1/teams         # Listar equipos
POST   /api/v1/teams         # Crear equipo [auth]
GET    /api/v1/teams/:id     # Obtener equipo
PUT    /api/v1/teams/:id     # Actualizar equipo [auth]
DELETE /api/v1/teams/:id     # Eliminar equipo [auth]
```

### Jugadores

```
GET    /api/v1/players       # Listar jugadores
POST   /api/v1/players       # Crear jugador [auth]
GET    /api/v1/players/:id   # Obtener jugador
PUT    /api/v1/players/:id   # Actualizar jugador [auth]
DELETE /api/v1/players/:id   # Eliminar jugador [auth]
POST   /api/v1/players/:id/assign-team  # Asignar equipo [auth]
```

### Noticias

```
GET    /api/v1/news          # Listar noticias
POST   /api/v1/news          # Crear noticia [auth]
GET    /api/v1/news/:id      # Obtener noticia
PUT    /api/v1/news/:id      # Actualizar noticia [auth]
DELETE /api/v1/news/:id      # Eliminar noticia [auth]
```

### Usuarios (admin only)

```
GET    /api/v1/users         # Listar usuarios [admin]
POST   /api/v1/users         # Crear usuario [admin]
GET    /api/v1/users/:id     # Obtener usuario [admin]
PUT    /api/v1/users/:id     # Actualizar usuario [admin]
DELETE /api/v1/users/:id     # Eliminar usuario [admin]
```

---

## 📦 Instalación Rápida

> ⚠️ **Nota**: Este proyecto es parte de un monorepo. Se recomienda instalar desde la raíz del proyecto.

### Desde la raíz del monorepo (recomendado):

```bash
npm run install:all
cd backend/crud-pucara
node ace generate:key   # Copia APP_KEY al .env
node ace migration:run
node ace db:seed
```

### Desde este directorio:

```bash
npm install
node ace generate:key
node ace migration:run
node ace db:seed
```

---

## � Desarrollo

### Iniciar servidor

```bash
node ace serve --watch  # Con hot reload
```

**URL**: http://localhost:3333

### Comandos útiles

```bash
node ace migration:run           # Ejecutar migraciones
node ace migration:rollback      # Revertir última migración
node ace db:seed                 # Poblar base de datos
node ace list:routes             # Ver todas las rutas
```

---

## 🗃️ Base de Datos

### Desarrollo

- **Motor**: SQLite
- **Archivo**: `tmp/db.sqlite3`
- **Ventajas**: Zero config, portátil

### Producción

- **Motor**: PostgreSQL
- **Configuración**: Via variables de entorno
- **Migración**: Lucid maneja el cambio de driver automáticamente

---

## 📝 Variables de Entorno

```env
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=                    # Generar con: node ace generate:key
NODE_ENV=development

# Base de datos (desarrollo)
DB_CONNECTION=sqlite

# Base de datos (producción)
DB_CONNECTION=pg
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_DATABASE=

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
