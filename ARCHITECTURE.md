# 🏗️ Arquitectura del Sistema Pucara

## 📊 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUCARA MONOREPO                                   │
│                      Plataforma de Gestión de Esports                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────┐      ┌────────────────────────────┐        │
│  │   ADMIN PANEL              │      │   LANDING PAGE             │        │
│  │   (React Admin)            │      │   (Astro)                  │        │
│  │   Port: 3000               │      │   Port: 4321               │        │
│  ├────────────────────────────┤      ├────────────────────────────┤        │
│  │ • CRUD Teams               │      │ • Homepage                 │        │
│  │ • CRUD Players             │      │ • Teams Showcase           │        │
│  │ • CRUD News                │      │ • Players Showcase         │        │
│  │ • CRUD Users               │      │ • News Feed                │        │
│  │ • Image Upload (Banner)    │      │ • Contact Form             │        │
│  │ • Image Upload (Photo)     │      │ • Static Content           │        │
│  │ • Authentication           │      │ • SSR/SSG                  │        │
│  └────────────┬───────────────┘      └────────────┬───────────────┘        │
│               │                                    │                         │
│               │ HTTP/REST                          │ HTTP/REST               │
│               │ (JSON/FormData)                    │ (JSON)                  │
└───────────────┼────────────────────────────────────┼─────────────────────────┘
                │                                    │
                └────────────────┬───────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ADONIS JS REST API                                │   │
│  │                      Port: 3333                                      │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    ROUTING LAYER                             │  │   │
│  │  │  start/routes.ts                                             │  │   │
│  │  ├──────────────────────────────────────────────────────────────┤  │   │
│  │  │  • /api/v1/teams      → TeamsController                      │  │   │
│  │  │  • /api/v1/players    → PlayersController                    │  │   │
│  │  │  • /news              → NewsController                       │  │   │
│  │  │  • /users             → UserController                       │  │   │
│  │  │  • /auth/*            → AuthController                       │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                             │                                       │   │
│  │                             ▼                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    MIDDLEWARE LAYER                          │  │   │
│  │  ├──────────────────────────────────────────────────────────────┤  │   │
│  │  │  • auth_middleware.ts     → JWT Validation                   │  │   │
│  │  │  • cors_middleware.ts     → CORS Headers                     │  │   │
│  │  │  • bodyparser             → JSON/FormData Parse              │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                             │                                       │   │
│  │                             ▼                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                  CONTROLLERS LAYER                           │  │   │
│  │  ├──────────────────────────────────────────────────────────────┤  │   │
│  │  │  • TeamsController     → CRUD + Image Upload                 │  │   │
│  │  │  • PlayersController   → CRUD + Image Upload                 │  │   │
│  │  │  • NewsController      → CRUD                                │  │   │
│  │  │  • UserController      → CRUD                                │  │   │
│  │  │  • AuthController      → Login/Register/Logout               │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                             │                                       │   │
│  │                             ▼                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    SERVICES LAYER                            │  │   │
│  │  ├──────────────────────────────────────────────────────────────┤  │   │
│  │  │  ImageStorageService (Factory Pattern)                       │  │   │
│  │  │      │                                                        │  │   │
│  │  │      ├─→ LocalStorageProvider     (public/uploads/)          │  │   │
│  │  │      ├─→ CloudinaryProvider       (Cloudinary CDN)           │  │   │
│  │  │      └─→ S3Provider               (AWS S3)                   │  │   │
│  │  │                                                               │  │   │
│  │  │  • uploadImage(file, folder)                                 │  │   │
│  │  │  • deleteImage(imageUrl, publicId?)                          │  │   │
│  │  │  • getProviderName()                                         │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                             │                                       │   │
│  │                             ▼                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    MODELS LAYER (ORM)                        │  │   │
│  │  ├──────────────────────────────────────────────────────────────┤  │   │
│  │  │  • Team Model          → teams table                         │  │   │
│  │  │  • Player Model        → players table                       │  │   │
│  │  │  • News Model          → news table                          │  │   │
│  │  │  • User Model          → users table                         │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                             │                                       │   │
│  └─────────────────────────────┼───────────────────────────────────────┘   │
│                                │                                           │
└────────────────────────────────┼───────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE LAYER                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────┐      ┌────────────────────────────┐        │
│  │   DATABASE                 │      │   FILE STORAGE             │        │
│  │   (SQLite)                 │      │   (Local/Cloudinary/S3)    │        │
│  ├────────────────────────────┤      ├────────────────────────────┤        │
│  │ Tables:                    │      │ Local:                     │        │
│  │ • users                    │      │   public/uploads/teams/    │        │
│  │ • news                     │      │   public/uploads/players/  │        │
│  │ • teams                    │      │                            │        │
│  │ • players                  │      │ Cloudinary:                │        │
│  │ • player_teams (future)    │      │   CDN URLs                 │        │
│  │                            │      │                            │        │
│  │ Location:                  │      │ S3:                        │        │
│  │ database/pucara.sqlite     │      │   S3 Bucket URLs           │        │
│  └────────────────────────────┘      └────────────────────────────┘        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos: Subida de Imágenes

```
┌─────────────┐
│   Usuario   │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Selecciona imagen en ImageInput
       │    (teams.tsx o players.tsx)
       ▼
┌─────────────────────┐
│   React Admin UI    │
│   (Frontend)        │
└──────┬──────────────┘
       │
       │ 2. Captura file con rawFile
       │    data = { banner: { rawFile: File } }
       ▼
┌─────────────────────┐
│   dataProvider.ts   │
│   (Frontend Logic)  │
├─────────────────────┤
│ hasFileUpload()?    │
│   ├─ YES ─────────┐ │
│   │               │ │
│   │ convertFile   │ │
│   │ ToFormData()  │ │
│   │               │ │
│   │ fetch(...)    │ │
│   │ FormData      │ │
│   └───────────────┘ │
└──────┬──────────────┘
       │
       │ 3. POST/PATCH con FormData
       │    multipart/form-data
       ▼
┌─────────────────────────────┐
│   AdonisJS Backend          │
│   TeamsController/          │
│   PlayersController         │
├─────────────────────────────┤
│ request.file('banner')      │
│          │                  │
│          ▼                  │
│ imageStorageService         │
│   .uploadImage(file, dir)   │
└──────┬──────────────────────┘
       │
       │ 4. Delega al provider configurado
       ▼
┌────────────────────────────┐
│  ImageStorageService       │
│  (Factory Pattern)         │
├────────────────────────────┤
│  switch(STORAGE_PROVIDER)  │
│    ├─ 'local' ─────────┐   │
│    ├─ 'cloudinary' ────┼─┐ │
│    └─ 's3' ────────────┼─┼─┤
└────────┬───────────────┴─┴─┘
         │       │       │
         ▼       ▼       ▼
    ┌────────┐ ┌──────────┐ ┌─────┐
    │ Local  │ │Cloudinary│ │ S3  │
    │Provider│ │ Provider │ │Prov.│
    └───┬────┘ └────┬─────┘ └──┬──┘
        │           │           │
        │ 5. Guarda imagen      │
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌──────────┐ ┌─────┐
    │uploads/│ │Cloudinary│ │ S3  │
    │teams/  │ │   CDN    │ │Bucket│
    └───┬────┘ └────┬─────┘ └──┬──┘
        │           │           │
        └───────────┴───────────┘
                    │
                    │ 6. Retorna URL
                    ▼
         { url: "/uploads/teams/xyz.jpg" }
                    │
                    │ 7. Guarda en DB
                    ▼
            ┌───────────────┐
            │  team.bannerUrl│
            │  player.photoUrl│
            └───────┬─────────┘
                    │
                    │ 8. Response JSON
                    ▼
            ┌───────────────┐
            │   Frontend    │
            │  Muestra img  │
            └───────────────┘
```

---

## 🔐 Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  AuthController     │
│  (Backend)          │
├─────────────────────┤
│ • Valida credencial │
│ • Verifica password │
│ • Genera JWT token  │
└──────┬──────────────┘
       │
       │ 2. Response
       │    { token: "jwt...", user: {...} }
       ▼
┌─────────────────────┐
│   Frontend          │
│   authProvider.ts   │
├─────────────────────┤
│ localStorage.setItem│
│   ('auth', token)   │
└──────┬──────────────┘
       │
       │ 3. Subsecuentes requests
       │    Authorization: Bearer {token}
       ▼
┌─────────────────────┐
│  auth_middleware.ts │
│  (Backend)          │
├─────────────────────┤
│ • Valida JWT        │
│ • Verifica payload  │
│ • Inyecta user ctx  │
└──────┬──────────────┘
       │
       │ 4. Request autorizado
       ▼
┌─────────────────────┐
│   Controllers       │
│   (Protected)       │
└─────────────────────┘
```

---

## 📦 Estructura de Base de Datos

```
┌────────────────────────────────────────────────────────────┐
│                    SQLITE DATABASE                         │
│                (database/pucara.sqlite)                    │
└────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     users        │       │      news        │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ username         │       │ titulo           │
│ email (unique)   │◄──────┤ user_id (FK)     │
│ password (hash)  │  1:N  │ fecha            │
│ role             │       │ comentario       │
│ created_at       │       │ created_at       │
│ updated_at       │       │ updated_at       │
└──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     teams        │       │    players       │
├──────────────────┤       ├──────────────────┤
│ team_id (PK/UUID)│       │ player_id (PK)   │
│ name             │◄──────┤ team_id (FK)     │
│ slug             │  1:N  │ name             │
│ emoji            │       │ age              │
│ banner_url       │       │ role             │
│ description      │       │ country          │
│ achievements     │       │ instagram        │
│ created_at       │       │ bio              │
│ updated_at       │       │ stats (JSON)     │
└──────────────────┘       │ photo_url        │
                           │ created_at       │
                           │ updated_at       │
                           └──────────────────┘

┌──────────────────┐
│  player_teams    │  (Future: Historial)
├──────────────────┤
│ id (PK)          │
│ player_id (FK)   │
│ team_id (FK)     │
│ start_date       │
│ end_date         │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                         │
└─────────────────────────────────────────────────────────────┘

Frontend:
  ├─ Admin Panel
  │   ├─ React 19
  │   ├─ React Admin 5.x
  │   ├─ Material-UI 7.x
  │   ├─ TypeScript
  │   └─ CRA (Create React App)
  │
  └─ Landing Page
      ├─ Astro 5.x
      ├─ TypeScript
      └─ TailwindCSS (via Astro integration)

Backend:
  ├─ AdonisJS 6.x
  ├─ TypeScript
  ├─ Node.js 18+
  ├─ Lucid ORM
  ├─ JWT Authentication
  └─ VineJS (Validation)

Database:
  └─ SQLite (dev/prod)

File Storage:
  ├─ Local Filesystem (default)
  ├─ Cloudinary (optional)
  └─ AWS S3 (optional)

DevOps:
  ├─ npm workspaces
  ├─ concurrently (multi-service)
  ├─ ESLint
  ├─ Prettier
  └─ Git

Deployment:
  ├─ Backend → VPS/Heroku/Railway
  ├─ Admin → Vercel/Netlify
  └─ Landing → Vercel/Netlify
```

---

## 🔀 Flujo de Desarrollo

```
┌─────────────┐
│ Developer   │
└──────┬──────┘
       │
       │ 1. Modifica código
       │    (*.ts, *.tsx, *.astro)
       ▼
┌─────────────────────┐
│   Hot Reload        │
│   (Auto-refresh)    │
├─────────────────────┤
│ • Backend (Adonis)  │
│ • Admin (React)     │
│ • Landing (Astro)   │
└──────┬──────────────┘
       │
       │ 2. Test en local
       │    http://localhost:3000
       │    http://localhost:3333
       │    http://localhost:4321
       ▼
┌─────────────────────┐
│   Git Commit        │
│   (Feature Branch)  │
└──────┬──────────────┘
       │
       │ 3. Push to GitHub
       ▼
┌─────────────────────┐
│   Pull Request      │
│   (Code Review)     │
└──────┬──────────────┘
       │
       │ 4. Merge to main
       ▼
┌─────────────────────┐
│   CI/CD Pipeline    │
│   (Future)          │
├─────────────────────┤
│ • Run tests         │
│ • Build artifacts   │
│ • Deploy to prod    │
└─────────────────────┘
```

---

## 🌐 Ports & Services

```
┌──────────────────────────────────────┐
│         Local Development            │
├──────────────────────────────────────┤
│ Port 3000 → Admin Frontend (React)   │
│ Port 3333 → Backend API (AdonisJS)   │
│ Port 4321 → Landing Page (Astro)     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Production (Example)         │
├──────────────────────────────────────┤
│ admin.pucara.com → Admin Frontend    │
│ api.pucara.com   → Backend API       │
│ pucara.com       → Landing Page      │
└──────────────────────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────┐
│           SECURITY ARCHITECTURE             │
└─────────────────────────────────────────────┘

1. Authentication Layer
   ├─ JWT Tokens (Bearer)
   ├─ Password Hashing (bcrypt)
   └─ Secure HTTP Only (production)

2. Authorization Layer
   ├─ Role-based (admin, editor)
   └─ Route protection (middleware)

3. Input Validation
   ├─ VineJS validators (backend)
   ├─ File type validation
   ├─ File size limits (10MB)
   └─ SQL injection prevention (ORM)

4. CORS Protection
   ├─ Allowed origins
   └─ Credential handling

5. Rate Limiting (Future)
   └─ API throttling

6. File Upload Security
   ├─ Extension whitelist
   ├─ MIME type validation
   ├─ Unique filenames (CUID)
   └─ Separate storage paths
```

---

## 📈 Escalabilidad Futura

```
Current Architecture:
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Frontend │───▶│ Backend  │───▶│ SQLite   │
│ (Static) │    │ (Single) │    │ (File)   │
└──────────┘    └──────────┘    └──────────┘
                      │
                      ▼
                ┌──────────┐
                │  Local   │
                │ Storage  │
                └──────────┘

Future Scalable Architecture:
┌──────────┐    ┌────────────┐    ┌──────────┐
│ Frontend │───▶│ Load       │───▶│ Backend  │
│  (CDN)   │    │ Balancer   │    │ Cluster  │
└──────────┘    └────────────┘    └────┬─────┘
                                       │
                      ┌────────────────┼────────────────┐
                      ▼                ▼                ▼
                ┌──────────┐    ┌──────────┐    ┌──────────┐
                │PostgreSQL│    │  Redis   │    │Cloudinary│
                │ (Primary)│    │ (Cache)  │    │  / S3    │
                └──────────┘    └──────────┘    └──────────┘
```

---

## 📚 Convenciones de Código

```
Backend (AdonisJS):
  ├─ Controllers    → PascalCase + Controller suffix
  ├─ Models         → PascalCase (singular)
  ├─ Services       → PascalCase + Service suffix
  ├─ Providers      → PascalCase + Provider suffix
  ├─ Routes         → kebab-case
  └─ Database       → snake_case

Frontend (React/Astro):
  ├─ Components     → PascalCase
  ├─ Files          → camelCase / kebab-case
  ├─ Props          → camelCase
  └─ CSS Classes    → kebab-case

General:
  ├─ Variables      → camelCase
  ├─ Constants      → UPPER_SNAKE_CASE
  ├─ Functions      → camelCase
  └─ Types/Interface→ PascalCase
```

---

## 🎯 Key Design Patterns

```
1. Factory Pattern
   └─ ImageStorageService
      (Selecciona provider dinámicamente)

2. Singleton Pattern
   └─ ImageStorageService instance
      (Una única instancia exportada)

3. Repository Pattern
   └─ Lucid ORM Models
      (Abstracción de acceso a datos)

4. Middleware Pattern
   └─ AdonisJS Middleware Chain
      (Procesamiento secuencial de requests)

5. Provider Pattern
   └─ Storage Providers
      (Implementaciones intercambiables)

6. MVC Pattern
   └─ AdonisJS Structure
      (Model-View-Controller separation)
```

---

**📖 Para más detalles, consulta:**

- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Configuración local
- [IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md) - Sistema de imágenes
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Autenticación
- [README.md](./README.md) - Overview general
