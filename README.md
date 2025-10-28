# 🏔️ Pucara — Monorepo

Plataforma web completa para la gestión de equipos y jugadores de esports, con panel de administración CRUD, landing pública y sistema de autenticación basado en roles.

---

## 👥 Integrantes del Equipo

| Nombre                     | Rol     | GitHub                                             |
| -------------------------- | ------- | -------------------------------------------------- |
| **[Rocío Lujan]**          | [PM]    | [@RocioLujan](https://github.com/RocioLujan)       |
| **[Francisco Castellano]** | [Front] | [@frqn04](https://github.com/frqn04)               |
| **[Ricardo Ortiz]**        | [Front] | [@RicardoJOrtiz](https://github.com/RicardoJOrtiz) |
| **[Sebastián Mussi]**      | [Back]  | [@SebasM79](https://github.com/SebasM79)           |
| **[Lucas Godina]**         | [Back]  | [@lucasgodina](https://github.com/lucasgodina)     |

---

## 📁 Estructura del Proyecto

```
pucara/
├── backend/
│   └── crud-pucara/           # API REST con AdonisJS 6
│       ├── app/
│       │   ├── controllers/   # Lógica de endpoints
│       │   ├── models/        # Modelos Lucid ORM
│       │   ├── middleware/    # Auth, CORS, validaciones
│       │   └── validators/    # Esquemas VineJS
│       ├── config/            # Configuración (DB, auth, CORS)
│       ├── database/
│       │   ├── migrations/    # Esquema de base de datos
│       │   └── seeders/       # Datos iniciales
│       └── start/routes.ts    # Definición de rutas
│
├── frontend/
│   ├── admin-frontend/        # Panel de administración
│   │   └── src/
│   │       ├── components/    # Componentes React
│   │       ├── dataProvider.ts # Integración con API
│   │       └── authProvider.ts # Lógica de autenticación
│   │
│   └── landing/               # Sitio público con Astro 5
│       ├── src/
│       │   ├── components/    # Componentes reutilizables
│       │   ├── layouts/       # Layouts base
│       │   └── pages/         # Páginas (SSR)
│       └── public/            # Assets estáticos
│
└── docs/                      # Documentación del proyecto
```

---

## ✨ Características Principales

### Backend (AdonisJS 6)

- ✅ **API REST** con arquitectura MVC
- ✅ **Autenticación** basada en Access Tokens (7 días de validez)
- ✅ **Sistema de roles**: Admin (single session), Editor, User
- ✅ **CRUD completo**: Equipos, Jugadores, Noticias, Usuarios
- ✅ **Upload de imágenes**: LocalStorage (dev) o Cloudinary (prod)
- ✅ **Validaciones robustas**: VineJS con type safety
- ✅ **Base de datos**: SQLite (dev) / PostgreSQL (prod)
- ✅ **Migraciones y seeders**: Gestión de esquema con Lucid ORM

### Frontend Admin (React + React Admin)

- ✅ **Panel de administración** responsive y profesional
- ✅ **Material-UI**: Componentes accesibles y modernos
- ✅ **DataGrid avanzado**: Paginación, filtros, ordenamiento
- ✅ **Formularios inteligentes**: Validación client-side
- ✅ **Theme switcher**: Modo claro/oscuro
- ✅ **Gestión de imágenes**: Upload y preview en tiempo real

### Frontend Landing (Astro 5)

- ✅ **SSR (Server-Side Rendering)**: SEO optimizado
- ✅ **Islands Architecture**: Carga selectiva de JavaScript
- ✅ **Tailwind CSS**: Diseño responsive y customizable
- ✅ **Formulario de contacto**: Integrado con Nodemailer
- ✅ **Integración con redes sociales**: Instagram API (opcional)
- ✅ **Mercado Pago**: Pasarela de pagos (opcional)

---

## 🚀 Quick Start

### Instalación completa (un comando)

```bash
npm run install:all
```

### Configurar backend

```bash
cd backend/crud-pucara
node ace generate:key  # Copia el APP_KEY al .env
node ace migration:run
node ace db:seed        # Datos de ejemplo (admin + equipos + jugadores)
cd ../..
```

### Levantar todo el monorepo

```bash
npm run dev  # Levanta API, Admin y Landing simultáneamente
```

**URLs:**

- API: http://localhost:3333
- Admin: http://localhost:3000
- Landing: http://localhost:4321

---

## 📚 Documentación

| Guía                                               | Descripción                          |
| -------------------------------------------------- | ------------------------------------ |
| **[LOCAL_SETUP.md](LOCAL_SETUP.md)**               | Setup completo para desarrollo local |
| **[COMMANDS_GUIDE.md](COMMANDS_GUIDE.md)**         | Comandos disponibles desde la raíz   |
| **[TECHNOLOGIES_RECAP.md](TECHNOLOGIES_RECAP.md)** | Stack tecnológico y justificaciones  |

---

## 🛠️ Stack Tecnológico

| Capa          | Tecnología          | Versión        |
| ------------- | ------------------- | -------------- |
| **Backend**   | AdonisJS            | 6.18.0         |
| **ORM**       | Lucid               | 21.6.1         |
| **DB (dev)**  | SQLite              | -              |
| **DB (prod)** | PostgreSQL          | -              |
| **Admin UI**  | React + React Admin | 19.1.0 / 5.9.1 |
| **Landing**   | Astro SSR           | 5.11.0         |
| **Styles**    | Tailwind CSS + MUI  | 3.4.17 / 7.2.0 |
| **Language**  | TypeScript          | 5.8.x          |
| **Monorepo**  | npm + Concurrently  | 8.2.2          |

> Ver **[TECHNOLOGIES_RECAP.md](TECHNOLOGIES_RECAP.md)** para detalles completos y justificaciones

---

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Levanta todo (API + Admin + Landing)
npm run dev:api          # Solo backend
npm run dev:admin        # Solo panel admin
npm run dev:landing      # Solo landing

# Instalación
npm run install:all      # Instala todas las dependencias

# Build
npm run build:all        # Build completo para producción
npm run build:api        # Build backend
npm run build:admin      # Build admin
npm run build:landing    # Build landing

# Code Quality
npm run lint:all         # ESLint en todo el código
npm run format:all       # Prettier en todo el código
npm run typecheck        # TypeScript check en backend
```

---
