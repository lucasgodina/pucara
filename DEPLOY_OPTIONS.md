# Opciones de Deploy para Pucará (Monorepo)

Este repositorio contiene 3 apps independientes que pueden desplegarse juntas o por separado:

- Backend API: AdonisJS 6 (Node 20), base de datos, subida de imágenes.
- Admin Frontend: React (CRA) estático.
- Landing: Astro (SSR hoy con adapter Vercel, fácilmente convertible a estático si se desea).

Recomendación general: separar responsabilidades por servicio y usar proveedores con free tier sólido. Evitar SQLite en producción; preferir Postgres administrado. Para imágenes, Cloudinary es el camino más simple y barato.

---

## Tabla rápida (costo y dificultad)

| Opción | Qué hostea | Proveedor(es) | Costo aprox | Dificultad | Pros | Contras |
|---|---|---|---:|:--:|---|---|
| A | Landing (Astro), Admin (CRA) | Vercel | $0–$20 | 🟢 | Autodeploy, dominios y SSL fáciles | Límites free, funciones/SSR con cold start |
| B | API (Adonis) | Render | $0–$7 | 🟢 | Muy simple, DB y logs integrados | Free duerme; latencia al despertar |
| C | API (Adonis) | Railway | $0–$5 | 🟢 | Simple, Postgres incluido | Créditos mensuales variables |
| D | API (Adonis) + DB + Nginx | VPS (Hetzner/DO) | $5–$12 | 🟠 | Control total, sin cold starts | Mantenimiento DevOps, backups, monitoreo |
| E | API (Adonis, Docker) | Fly.io | $0–$6 | 🟠 | Escala fácil, regiones | Config inicial más técnica |
| F | Landing + Admin (estático), API (PaaS) | Cloudflare Pages + Render | $0 | 🟢 | Muy barato, CDN global | Requiere ajustar adapter de Astro |
| G | Todo en Azure/AWS/GCP | App Service / EB | $$ | 🔴 | Enterprise, integraciones | Costos, complejidad alta |

Notas:
- Precios estimados para uso bajo (MVP). Impuestos/transferencia pueden aplicar.
- Para DB production: Neon/Render/Railway Postgres free tiers cubren MVP.
- Para imágenes: Cloudinary free tier suele alcanzar (25 GB/mes).

---

## Rutas recomendadas (según etapa)

### 1) Desarrollo y MVP (rápido y casi gratis)
- Landing (Astro): Vercel (actual adapter listo). Autodeploy por rama.
- Admin (CRA): Vercel (estático).
- API (Adonis): Render o Railway (Node service) + Postgres administrado (Neon/Render/Railway).
- Imágenes: Cloudinary (STORAGE_PROVIDER=cloudinary). Evitar disco local en PaaS.

Por qué: cero servidores que mantener, CI/CD integrado y dominios/SSL automáticos.

### 2) Staging/Producción simple (menor latencia, más control)
- Landing + Admin: Vercel/Netlify/Cloudflare Pages (cualquiera va bien).
- API: Fly.io (Docker) o un VPS pequeño (Hetzner CX22 / DO Basic 1GB) con Docker Compose.
- DB: Neon/Render Postgres (backups automáticos).
- Imágenes: Cloudinary.

### 3) Producción con control total (DevOps propio)
- VPS único con Docker Compose: Nginx (reverse proxy + SSL), API (Adonis + PM2), Admin (Nginx estático), Landing (Astro SSR con Node), Postgres administrado externo.
- Imágenes: Cloudinary; local solo si necesitas residencia y tienes backups.

Coste: $5–$12/mes + dominio.

---

## Detalle por servicio

### Landing (Astro)
- Estado actual: SSR con adapter Vercel (astro.config.mjs).
- Opciones:
  1) Vercel (recomendado): sin cambios. Setear variables PUBLIC_* según requiera.
  2) Netlify: cambiar adapter a `@astrojs/netlify`.
  3) Cloudflare Pages: cambiar a `@astrojs/cloudflare` (o convertir a estático si no se usan endpoints SSR).
- Costos: $0 en free para tráficos bajos. CDN global.

### Admin Frontend (CRA)
- Estático. Opciones fáciles: Vercel, Netlify, Cloudflare Pages, S3+CloudFront.
- Config: apuntar a API_URL de producción (ya no hay proxy como en dev). 
- Costos: $0 en free tiers.

### API Backend (AdonisJS)
- Requisitos: Node 20, variables de entorno, CORS, Auth tokens, subida de archivos.
- Opciones:
  1) Render/Railway (simple): crear servicio web Node con start script `node build/server.js`/`node ace serve --production` según tu build; configurar ENV; añadir health check opcional.
  2) Fly.io (Docker): Dockefile + `fly launch`; asignar volumen si necesitas disco (evitado si usas Cloudinary y Postgres). Buen rendimiento.
  3) VPS (Docker Compose): Nginx (443), API, Watchtower, UFW; PM2 para procesos Node si no usas Docker. Más trabajo, máximo control.
- Logs/monitoreo: proveedor o Loki/Promtail en VPS.
- Costos: $0–$7 típico.

### Base de Datos
- No usar SQLite en producción.
- Recomendado: Postgres administrado (Neon/Render/Railway). 
- Migración: actualizar `config/database.ts` a Postgres; setear `DATABASE_URL`.
- Backups: incluidos en proveedores administrados; en VPS usar pg_dump + cron.
- Costos: $0–$5 típico.

### Archivos/Imágenes
- Recomendado: Cloudinary (STORAGE_PROVIDER=cloudinary). Sin estado en el servidor, CDN y optimización.
- Alternativa: disco local solo en VPS único (no escalable). Asegurar backups y espacio.

---

## Configuración de dominios

- Subdominios:
  - Landing: `pucara.com` / `www.pucara.com`
  - Admin: `admin.pucara.com`
  - API: `api.pucara.com`
- CORS (API): permitir orígenes del Admin y Landing en producción.
- SSL: automático en Vercel/Netlify/Cloudflare; en VPS usar Caddy o Nginx + certbot.

---

## Variables de entorno (mínimas)

Backend (Adonis):
- APP_KEY
- NODE_ENV=production
- PORT=3333
- STORAGE_PROVIDER=cloudinary|local|s3
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (si cloudinary)
- DATABASE_URL (Postgres)
- ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME (seeder)
- CORS_ORIGIN=https://admin.pucara.com,https://pucara.com

Admin (CRA):
- REACT_APP_API_URL=https://api.pucara.com (o mecanismo equivalente en tu dataProvider)

Landing (Astro):
- PUBLIC_BACKEND_API_URL=https://api.pucara.com

---

## Flujos de CI/CD

- Vercel/Netlify/Cloudflare: conectar repo GitHub. Deploy por rama (main → producción, previews por PR).
- Render/Railway: auto deploy on push; variables de entorno en panel.
- VPS: GitHub Actions → build & deploy por SSH o contenedores (Docker Compose). Renovación SSL automatizada (Caddy recomendado).

---

## Plantillas de decisiones

### Opción recomendada (rápida y barata)
- Landing: Vercel
- Admin: Vercel
- API: Render (free o $7) 
- DB: Neon (free)
- Imágenes: Cloudinary (free)

Resultado: $0–$7/mes, sin servidores que mantener, escalable para MVP.

### Opción rendimiento/control moderado
- Landing/Admin: Vercel/Cloudflare Pages
- API: Fly.io (Docker)
- DB: Render/Neon
- Imágenes: Cloudinary

Resultado: baja latencia, costos similares y buen control de despliegue.

### Opción control total (VPS)
- Un VPS pequeño (Hetzner/DO) con Docker Compose: Nginx, API, Admin estático, Landing SSR, monitoreo, backups.

Resultado: costo bajo estable (\~$5–$12) pero más DevOps.

---

## Checklist por opción

### PaaS mixto (Vercel + Render)
- [ ] Crear proyectos en Vercel (Landing/Admin) y Render (API)
- [ ] Configurar variables de entorno
- [ ] Apuntar Admin/Landing a API_URL de prod
- [ ] CORS en API a dominios de Vercel
- [ ] Probar subida de imágenes y visualización en Landing

### Fly.io
- [ ] Dockerfile para API
- [ ] `fly launch` y secrets
- [ ] Postgres administrado externo
- [ ] Health checks y regiones cercanas a usuarios

### VPS (Docker Compose)
- [ ] Instalar Docker + docker-compose
- [ ] Compose con: nginx + api + (astro ssr) + admin estático
- [ ] Certificados (Caddy o Nginx + certbot)
- [ ] Backups DB (pg_dump) y rotación de logs

---

## Notas de arquitectura

- Arquitectura sin estado en API (imágenes y DB fuera del pod) facilita escalar y redeploy sin pérdida.
- Evitar escribir en disco en PaaS (sistemas efímeros); usar Cloudinary.
- Mantener adapters de Astro según proveedor; para Vercel ya están listos.

---

## Preguntas para elegir camino

1) ¿Prioridad costo $0 o rendimiento/control?
2) ¿Tenemos alguien que administre un VPS? 
3) ¿Necesitamos SSR real en Landing o podemos pasarla a estática? 
4) ¿Volumen estimado de imágenes? (Cloudinary free suele alcanzar)

Con estas respuestas puedo dejarte armado el pipeline y plantillas de infra en 1-2 horas.
