# Guía de Deploy (MVP rápido y barato)

Arquitectura elegida:

- Landing (Astro) → Vercel (SSR con adapter ya configurado)
- Admin (React CRA) → Vercel (estático)
- API (AdonisJS) → Render (Web Service Node)
- Base de datos → Neon (Postgres administrado) o Render Postgres
- Imágenes → Cloudinary

Tiempo estimado: 30–60 minutos.

---

## 0) Prerrequisitos

- Cuentas gratuitas: Vercel, Render, Neon (o Render Postgres), Cloudinary
- Dominio (opcional): si vas a usar `pucara.com`/subdominios
- Repo conectado a GitHub (recomendado)

---

## 1) Cloudinary (imágenes)

1. Crear cuenta en Cloudinary y entrar al Dashboard.
2. Obtener credenciales:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
3. Guardarlas para usarlas como variables de entorno en la API.

Por qué primero: así evitamos almacenamiento local en el server y tenemos CDN/optimización gratis.

---

## 2) Base de datos (Postgres)

Opción A (recomendada): Neon

1. Crear un proyecto en Neon.
2. Crear una base de datos (db `pucara`).
3. Copiar la `DATABASE_URL` (formato `postgres://user:pass@host/db`).

Opción B: Render Postgres (similar, también free tier)

No uses SQLite en producción.

---

## 3) Deploy de la API (Render)

Repositorio: `backend/crud-pucara`

1. En Render → New → Web Service → Connect repo → seleccionar `backend/crud-pucara`.
2. Configuración del servicio:
   - Runtime: Node
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Region: cercana a tus usuarios
3. Variables de entorno (Environment → Add):
   - `NODE_ENV=production`
   - `APP_KEY` (cadena segura; si no tienes una, genera una con 32+ chars)
   - `PORT=10000` (Render define PORT automáticamente; puedes dejarla vacía si Render inyecta)
   - `STORAGE_PROVIDER=cloudinary`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
   - `DATABASE_URL=postgres://...` (de Neon/Render)
   - `ADMIN_EMAIL=tu@email.com`
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=algoseguro`
   - `CORS_ORIGIN=https://admin-tuapp.vercel.app,https://tuapp.vercel.app` (ajusta luego con tus dominios)
4. Post Deploy (migraciones):
   - En Render, usa “Shell” o un “Manual Deploy Command” tras el primer deploy:
   - Comando sugerido: `node build/ace.js migration:run --force`
   - Alternativa: crear un Job de Render que ejecute eso post-deploy.
5. Esperar a que el servicio quede `Live` y anotar la URL pública: `https://api-tuapp.onrender.com`.

Verificación rápida:

- `GET https://api-tuapp.onrender.com/api/v1/teams` (debe responder 200 con array)
- `POST /login` con el admin del seeder (si existe endpoint en Backend A)

---

## 4) Deploy del Admin (Vercel)

Repositorio: `frontend/admin-frontend`

1. En Vercel → New Project → Import Git Repository → seleccionar `frontend/admin-frontend`.
2. Framework Preset: “Create React App” (auto-detectado).
3. Variables de entorno (Production):
   - Recomendado: parametrizar el `dataProvider` para leer `REACT_APP_API_URL` y `REACT_APP_API_URL_V1`.
   - Si no lo haces aún, puedes dejarlo hardcodeado y regresar luego. Mejor práctica: agregar:
     - `REACT_APP_API_URL=https://api-tuapp.onrender.com`
     - `REACT_APP_API_URL_V1=https://api-tuapp.onrender.com/api/v1`
4. Deploy. La URL quedará como `https://admin-tuapp.vercel.app`.

Prueba:

- Login con ADMIN del seeder.
- Crear un equipo y subir banner (debe ir a Cloudinary y verse en el Admin y la Landing).

Nota: si el data provider está hardcodeado a `http://localhost:3333`, planifica un pequeño ajuste en el código para leer `process.env.REACT_APP_API_URL` y usarlo en producción.

---

## 5) Deploy de la Landing (Vercel)

Repositorio: `frontend/landing` (Astro con adapter Vercel ya configurado)

1. En Vercel → New Project → seleccionar `frontend/landing`.
2. Variables de entorno (Production):
   - `PUBLIC_BACKEND_API_URL=https://api-tuapp.onrender.com`
3. Deploy. URL: `https://tuapp.vercel.app`.

Prueba:

- Home cargando equipos y jugadores (imágenes deben apuntar al backend/Cloudinary).

---

## 6) CORS y dominios

En la API (Render):

- Confirmar `CORS_ORIGIN` con los dominios finales de Vercel, por ejemplo:
  - `https://admin-tuapp.vercel.app`
  - `https://tuapp.vercel.app`
- Si cambias a tu dominio propio:
  - `https://admin.pucara.com,https://pucara.com`

En la Landing/Admin: apuntar a la URL pública de la API.

---

## 7) Checklist final

- [ ] API Live en Render con migraciones ejecutadas
- [ ] Cloudinary credenciales correctas (subida/lectura/borra)
- [ ] Admin en Vercel con login OK y CRUD funcionando
- [ ] Landing en Vercel consumiendo la API (imágenes visibles)
- [ ] CORS configurado con los dos dominios de Vercel

---

## 8) Costos estimados (MVP uso personal)

- Vercel (Admin + Landing): $0
- Render (API): $0–$7 según plan (free puede dormir)
- Neon/Render Postgres: $0
- Cloudinary: $0 (free tier suele alcanzar)

---

## 9) Siguientes pasos sugeridos

- ~~Parametrizar `dataProvider` del Admin para leer `REACT_APP_API_URL` en build~~ ✅ Ya implementado
- Agregar Health Check a la API.
- Configurar dominios propios (opcional) y actualizar `CORS_ORIGIN`.
- Si lo necesitás, mover Landing a modo estático (Cloudflare Pages) para bajar aún más costos.
- Implementar rate limiting en endpoints de autenticación.
- Configurar logging y monitoreo en producción.
