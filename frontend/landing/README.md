# Landing Page - Pucará Esports

Sitio web público construido con **Astro 5** con SSR para presentar equipos, jugadores y noticias de Pucará Gaming.

---

## 🎯 Descripción

Landing page con arquitectura Islands que ofrece contenido optimizado para SEO, tiempos de carga ultra-rápidos y diseño responsive.

**Secciones principales:**

- **Home** - Hero section con destacados
- **Teams** - Showcase de equipos con roster
- **Players** - Perfiles de jugadores
- **News** - Blog de noticias y actualizaciones
- **Contact** - Formulario de contacto (Nodemailer)
- **Sponsors** - Patrocinadores y partners

---

## 🛠️ Stack Tecnológico

| Tecnología           | Versión | Propósito                     |
| -------------------- | ------- | ----------------------------- |
| **Astro**            | 5.11.0  | Framework SSR principal       |
| **Tailwind CSS**     | 3.4.17  | Framework CSS utility-first   |
| **TypeScript**       | 5.8.3   | Type safety                   |
| **Sharp**            | 0.34.3  | Optimización de imágenes      |
| **Nodemailer**       | 7.0.5   | Envío de emails               |
| **Mercado Pago SDK** | 2.9.0   | Pasarela de pagos (opcional)  |
| **@astrojs/vercel**  | 8.0.4   | Adapter para deploy en Vercel |

---

## 📁 Estructura

```
src/
├── pages/               # Rutas del sitio (.astro files)
│   ├── index.astro      # Página principal
│   ├── teams.astro      # Listado de equipos
│   ├── players.astro    # Listado de jugadores
│   ├── news.astro       # Blog de noticias
│   └── contact.astro    # Formulario de contacto
│
├── components/          # Componentes reutilizables
│   ├── Navbar.astro     # Barra de navegación
│   ├── Footer.astro     # Pie de página
│   ├── PlayerCard.astro # Card de jugador
│   ├── TeamCard.astro   # Card de equipo
│   └── NewsCard.astro   # Card de noticia
│
├── layouts/             # Layouts base
│   └── Layout.astro     # Layout principal (header + footer)
│
├── data/                # Datos del sitio (JSON, TS)
│   ├── teams.ts         # Información de equipos
│   └── players.ts       # Información de jugadores
│
└── assets/              # Imágenes, fuentes, íconos

public/                  # Assets estáticos (sirve directo)
├── players/             # Fotos de jugadores
├── founders/            # Fotos de fundadores
└── site.webmanifest     # PWA manifest

api/                     # Serverless functions (Vercel)
└── contact.js           # Endpoint de formulario de contacto

docs/                    # Guías de integración
└── guia-integracion-crud.md
```

---

## 🎨 Configuración de Tailwind

### Paleta de colores custom

```js
colors: {
  primary: '#ea601a',      // Naranja principal
  'primary-dark': '#c54d14',
  'primary-light': '#ff7a33',
}
```

### Breakpoints responsive

```js
mobile-s: '320px'
mobile-m: '375px'
mobile-l: '425px'
tablet: '768px'
laptop: '1024px'
laptop-l: '1440px'
'2xl': '1536px'
'3xl': '1920px'
```

### Animaciones custom

- `fadeIn` - Fade in suave
- `slideUp` - Slide desde abajo
- `pulse-glow` - Efecto glow pulsante

---

## 📦 Instalación Rápida

> ⚠️ **Nota**: Este proyecto es parte de un monorepo. Se recomienda instalar desde la raíz.

### Desde la raíz del monorepo (recomendado):

```bash
npm run install:all
```

### Desde este directorio:

```bash
npm install
```

---

## 🚀 Desarrollo

### Iniciar servidor de desarrollo

```bash
npm run dev
```

**URL**: http://localhost:4321

### Comandos disponibles

```bash
npm run dev           # Dev server con hot reload
npm run build         # Build SSR para producción
npm run preview       # Preview del build
npm run astro         # CLI de Astro
```

---

## ✨ Características

### Optimizaciones de Astro

- ✅ **Islands Architecture** - JavaScript solo donde se necesita
- ✅ **SSR (Server-Side Rendering)** - SEO optimizado
- ✅ **Image optimization** - WebP automático con Sharp
- ✅ **Code splitting** - Carga selectiva de componentes
- ✅ **HTML comprimido** - Minificación en producción
- ✅ **Inline CSS** - Estilos críticos inline

### Funcionalidades

- ✅ **Formulario de contacto** funcional con Nodemailer
- ✅ **Integración con Instagram** (opcional, ver guía)
- ✅ **Responsive design** con Tailwind
- ✅ **PWA ready** con manifest.json
- ✅ **Mercado Pago** para pagos (opcional)
- ✅ **Lazy loading** de imágenes
- ✅ **SEO tags** en todas las páginas

---

## 🔌 Integración con Backend

### Consumir API de AdonisJS

```typescript
// Ejemplo: Obtener equipos
const response = await fetch("http://localhost:3333/api/v1/teams");
const teams = await response.json();
```

Ver guía completa: `docs/guia-integracion-crud.md`

---

## 📝 Variables de Entorno

```env
# .env
PUBLIC_API_URL=http://localhost:3333/api/v1

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Mercado Pago (opcional)
MP_ACCESS_TOKEN=your_access_token

# Instagram API (opcional)
IG_USER_ID=your_instagram_business_id
IG_ACCESS_TOKEN=your_long_lived_token
```

---

## 🚀 Deployment

### Build para producción

```bash
npm run build
```

Genera carpeta `dist/` con SSR configurado para Vercel.

### Deploy en Vercel (recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a `main`

**Output**: Server-side rendering habilitado automáticamente

### Configuración Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

Ver guías completas:

- `../../DEPLOY_GUIDE_MVP.md` (stack gratuito)
- `../../DEPLOY_GUIDE_HEROKU.md` (con GitHub Student Pack)

---

## 🎨 Personalización

### Cambiar colores

Editar `tailwind.config.cjs` en la sección `theme.extend.colors`

### Añadir nueva página

1. Crear archivo en `src/pages/` (ej: `sponsors.astro`)
2. Usar layout: `import Layout from '../layouts/Layout.astro'`
3. La ruta será automática: `/sponsors`

### Añadir componente interactivo

```astro
---
// Componente con JavaScript (Island)
import InteractiveButton from '../components/InteractiveButton.jsx';
---

<InteractiveButton client:load />
```

Directivas disponibles: `client:load`, `client:idle`, `client:visible`

---

## 📘 Documentación Adicional

- **Astro Docs**: https://docs.astro.build/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Guía de integración CRUD**: `docs/guia-integracion-crud.md`
- **Instagram API**: `../../INSTAGRAM_API_GUIDE.md`
- **Mercado Pago**: `FuncionAPIMercadoPago.md`
- **Instalación detallada**: `INSTALLATION_GUIDE.md`
