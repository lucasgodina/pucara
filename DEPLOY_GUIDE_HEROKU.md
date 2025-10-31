# Guía de Deploy con Heroku (GitHub Student Pack)

Stack optimizado para aprovechar $13/mes de crédito Heroku:

- Landing (Astro SSR) → Vercel (gratis)
- Admin (React CRA) → Vercel (gratis)
- API (AdonisJS) → Heroku (Eco Dynos $5/mes)
- Base de datos → Heroku Postgres Mini ($5/mes) o Neon (gratis)
- Imágenes → Cloudinary (gratis)

Total Heroku: $5-10/mes (te sobran $3-8 del crédito).

Tiempo estimado: 40–70 minutos.

---

## 0) Prerrequisitos

- Cuenta Heroku verificada con GitHub Student Pack (https://www.heroku.com/github-students)
- Heroku CLI instalado: https://devcenter.heroku.com/articles/heroku-cli
- Repo en GitHub
- Cuentas: Vercel, Cloudinary

---

## 1) Cloudinary (imágenes)

1. Crear cuenta en Cloudinary → Dashboard.
2. Copiar credenciales:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Guardar para config vars de Heroku.

---

## 2) Crear app en Heroku (API)

### 2.1 Desde Heroku CLI

```bash
# Login
heroku login

# Crear app (elige nombre único)
heroku create pucara-api

# Agregar al remote de git
git remote -v  # verifica que esté 'heroku'
```

### 2.2 Configurar buildpacks (Node.js)

```bash
heroku buildpacks:set heroku/nodejs -a pucara-api
```

### 2.3 Configurar root directory (monorepo)

Heroku no soporta subdirectorios nativamente. Opciones:

**Opción A (recomendada): Subir solo el backend**

```bash
# Desde la raíz del monorepo
git subtree push --prefix backend/crud-pucara heroku main
```

**Opción B: Usar buildpack monorepo**

```bash
heroku buildpacks:add -i 1 https://github.com/lstoll/heroku-buildpack-monorepo -a pucara-api
heroku config:set APP_BASE=backend/crud-pucara -a pucara-api
```

Usaremos Opción A por simplicidad.

---

## 3) Base de datos (Postgres)

### Opción A: Heroku Postgres Mini ($5/mes)

```bash
heroku addons:create heroku-postgresql:mini -a pucara-api
# Esto crea automáticamente la variable DATABASE_URL
```

### Opción B: Neon (gratis, externo)

1. Crear DB en Neon y copiar `DATABASE_URL`.
2. Configurar en Heroku:

```bash
heroku config:set DATABASE_URL="postgres://user:pass@host/db" -a pucara-api
```

Recomendación: usar Heroku Postgres Mini para aprovechar el crédito y tener todo integrado.

---

## 4) Variables de entorno (Config Vars)

```bash
# App Key (genera una nueva para producción)
heroku config:set APP_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))") -a pucara-api

# Node env
heroku config:set NODE_ENV=production -a pucara-api

# Puerto (Heroku lo asigna dinámicamente)
heroku config:set PORT=\$PORT -a pucara-api

# Host
heroku config:set HOST=0.0.0.0 -a pucara-api

# Log level
heroku config:set LOG_LEVEL=info -a pucara-api

# DB Connection
heroku config:set DB_CONNECTION=pg -a pucara-api

# Cloudinary
heroku config:set CLOUDINARY_CLOUD_NAME=<tu_cloud_name> -a pucara-api
heroku config:set CLOUDINARY_API_KEY=<tu_api_key> -a pucara-api
heroku config:set CLOUDINARY_API_SECRET=<tu_api_secret> -a pucara-api

# Storage provider
heroku config:set STORAGE_PROVIDER=cloudinary -a pucara-api

# Admin credentials
heroku config:set ADMIN_NAME="Admin Pucara" -a pucara-api
heroku config:set ADMIN_USERNAME=admin -a pucara-api
heroku config:set ADMIN_EMAIL=admin@pucara.com -a pucara-api
heroku config:set ADMIN_PASSWORD=<contraseña_segura> -a pucara-api

# Timezone
heroku config:set TZ=UTC -a pucara-api
```

Verificar todas:

```bash
heroku config -a pucara-api
```

---

## 5) Crear Procfile en backend

Heroku necesita un `Procfile` para saber cómo arrancar la app.

Crear `backend/crud-pucara/Procfile`:

```
web: node build/bin/server.js
release: node ace migration:run --force
```

- `web`: comando que ejecuta el servidor en producción.
- `release`: ejecuta migraciones automáticamente antes de cada deploy.

Agregar al repo:

```bash
cd backend/crud-pucara
git add Procfile
git commit -m "Add Procfile for Heroku"
git push origin main
```

---

## 6) Configurar build en package.json

Asegurar que el build de Adonis esté configurado:

```json
{
  "scripts": {
    "build": "node ace build",
    "start": "node build/bin/server.js",
    "migration:run": "node ace migration:run --force"
  }
}
```

Ya debería estar configurado.

---

## 7) Deploy de la API

### Primera vez (subtree push)

```bash
# Desde la raíz del monorepo
git subtree push --prefix backend/crud-pucara heroku main
```

Esto:

1. Sube solo el contenido de `backend/crud-pucara` a Heroku.
2. Ejecuta `npm install` y `npm run build`.
3. Ejecuta el `release` (migraciones).
4. Inicia el dyno `web`.

### Ver logs

```bash
heroku logs --tail -a pucara-api
```

### Verificar que funciona

```bash
# URL de tu API
heroku open -a pucara-api
# Visitar: https://pucara-api-xxxxx.herokuapp.com/api/v1/health (si existe)
```

### Deploys siguientes

Cada vez que hagas cambios en el backend:

```bash
git add .
git commit -m "Update backend"
git push origin main
git subtree push --prefix backend/crud-pucara heroku main
```

---

## 8) Ejecutar seeders (crear admin)

```bash
heroku run node ace db:seed -a pucara-api
```

Esto crea el usuario admin con las credenciales configuradas en `ADMIN_*`.

---

## 9) Deploy del Admin Frontend (Vercel)

### 9.1 Configurar dataProvider

Ya está configurado en `frontend/admin-frontend/src/dataProvider.ts` con la URL de Heroku:

```typescript
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://pucara-api-9424c4c471cc.herokuapp.com";
```

Para desarrollo local, crea un archivo `.env` con:

```bash
REACT_APP_API_URL=http://localhost:3333
```

### 9.2 Deploy en Vercel

1. Ir a Vercel → New Project → Import desde GitHub.
2. Seleccionar el repo `pucara`.
3. Configurar:
   - Framework Preset: Create React App
   - Root Directory: `frontend/admin-frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
4. Variables de entorno (opcional, para sobreescribir el fallback):
   - `REACT_APP_API_URL`: `https://pucara-api-9424c4c471cc.herokuapp.com`
5. Deploy.

URL resultante: `https://pucara-admin-xxxxx.vercel.app`

---

## 10) Deploy del Landing (Vercel)

### 10.1 Configurar API URL

Ya está configurado en `frontend/landing/.env.production`:

```bash
PUBLIC_API_URL=https://pucara-api-9424c4c471cc.herokuapp.com
```

### 10.2 Deploy en Vercel

1. Vercel → New Project → Import.
2. Configurar:
   - Framework Preset: Astro
   - Root Directory: `frontend/landing`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Variables de entorno (opcional, para sobreescribir el archivo .env.production):
   - `PUBLIC_API_URL`: `https://pucara-api-9424c4c471cc.herokuapp.com`
4. Deploy.

URL resultante: `https://pucara-landing-xxxxx.vercel.app`

---

## 11) Configurar CORS en la API

El archivo `backend/crud-pucara/config/cors.ts` ya está configurado con las URLs necesarias.

Cuando despliegues en Vercel, actualiza las URLs placeholder con tus URLs reales:

```typescript
import { defineConfig } from "@adonisjs/cors";

const corsConfig = defineConfig({
  enabled: true,
  origin: [
    "https://pucara-api-9424c4c471cc.herokuapp.com",
    "https://pucara-admin-frontend.vercel.app",
    "https://pucara-landing.vercel.app",
    "http://localhost:3000",
    "http://localhost:4321",
  ],
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
});

export default corsConfig;
```

Después de actualizar las URLs, commit y redeploy:

```bash
git add backend/crud-pucara/config/cors.ts
git commit -m "Update CORS with production URLs"
git push origin main
git subtree push --prefix backend/crud-pucara heroku main
```

---

## 12) Dominios personalizados (opcional)

### API (Heroku)

```bash
heroku domains:add api.pucara.com -a pucara-api
# Configurar DNS CNAME apuntando a: xxx.herokudns.com
```

### Admin y Landing (Vercel)

1. Vercel → Project Settings → Domains.
2. Agregar `admin.pucara.com` y `pucara.com`.
3. Configurar DNS según las instrucciones de Vercel.

---

## 13) Checklist final

- [ ] API corriendo en Heroku: `https://pucara-api-9424c4c471cc.herokuapp.com`
- [ ] Admin corriendo en Vercel: `https://pucara-admin-xxxxx.vercel.app`
- [ ] Landing corriendo en Vercel: `https://pucara-landing-xxxxx.vercel.app`
- [ ] CORS configurado correctamente
- [ ] Admin puede hacer login
- [ ] Imágenes suben a Cloudinary
- [ ] Migraciones ejecutadas (`heroku run node ace migration:status -a pucara-api`)
- [ ] Seeder ejecutado (usuario admin creado)

---

## 14) Comandos útiles de Heroku

```bash
# Ver logs en tiempo real
heroku logs --tail -a pucara-api

# Ejecutar comandos (migraciones, seeders, etc.)
heroku run node ace migration:run --force -a pucara-api
heroku run node ace db:seed -a pucara-api

# Abrir consola interactiva
heroku run bash -a pucara-api

# Ver config vars
heroku config -a pucara-api

# Reiniciar dynos
heroku restart -a pucara-api

# Ver estado de la app
heroku ps -a pucara-api

# Ver addons (Postgres)
heroku addons -a pucara-api

# Conectar a la base de datos
heroku pg:psql -a pucara-api
```

---

## 15) Costos estimados

Con GitHub Student Pack ($13/mes de crédito):

- **Heroku Eco Dynos**: $5/mes (siempre activos, no duermen)
- **Heroku Postgres Mini**: $5/mes (10GB, 20 conexiones)
- **Vercel (Landing + Admin)**: $0 (hobby plan)
- **Cloudinary**: $0 (free tier: 25GB storage, 25GB bandwidth)

**Total: $10/mes** (te sobran $3 de crédito).

Alternativa más económica:

- Heroku Eco Dynos: $5/mes
- Neon Postgres: $0 (free tier: 0.5GB, suficiente para MVP)
- **Total: $5/mes** (te sobran $8).

---

## 16) Troubleshooting

### Error: "Application error" en Heroku

```bash
heroku logs --tail -a pucara-api
# Revisar errores de build o runtime
```

Causas comunes:

- `Procfile` mal configurado.
- Variables de entorno faltantes (`APP_KEY`, `DATABASE_URL`).
- Migraciones fallaron (verificar en logs de `release`).

### Error: CORS en frontend

- Verificar que la URL de la API esté correctamente configurada en `cors.ts`.
- Asegurar que `credentials: true` esté habilitado.

### Error: No se pueden subir imágenes

- Verificar que `STORAGE_PROVIDER=cloudinary` esté configurado.
- Verificar credenciales de Cloudinary en config vars.

### Error: Subtree push falla

Si el subtree push es conflictivo, usar fuerza:

```bash
git push heroku `git subtree split --prefix backend/crud-pucara main`:main --force
```

---

## 17) CI/CD opcional (GitHub Actions → Heroku)

Crear `.github/workflows/deploy-heroku.yml`:

```yaml
name: Deploy API to Heroku

on:
  push:
    branches: [main]
    paths:
      - "backend/crud-pucara/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: pucara-api
          heroku_email: tu-email@example.com
          appdir: backend/crud-pucara
          buildpack: heroku/nodejs
```

Configurar `HEROKU_API_KEY` en GitHub Secrets.

---

## Próximos pasos

1. Monitoreo: configurar alertas de Heroku o integrar con Sentry.
2. Backups: Heroku Postgres Mini incluye backups automáticos diarios.
3. Escalado: si necesitas más recursos, subir a Heroku Basic ($7/dyno).
4. Custom domains: configurar DNS para `api.pucara.com`, `admin.pucara.com`, etc.

¡Listo para deploy! 🚀
