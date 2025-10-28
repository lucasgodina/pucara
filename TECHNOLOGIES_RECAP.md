# TECHNOLOGIES_RECAP

Documentación de las tecnologías utilizadas en el proyecto Pucará, ordenadas por importancia.

---

## 🔧 BACKEND (AdonisJS 6)

### **AdonisJS** (^6.18.0)

- **Uso**: Framework principal del backend, proporciona toda la arquitectura de la API REST
- **Por qué**: Framework full-stack con TypeScript nativo, arquitectura MVC robusta, ORM incluido y CLI potente
- **Ventajas**: Productividad alta, estructura opinionada, autenticación integrada, HMR, validación de datos

### **Lucid ORM** (@adonisjs/lucid ^21.6.1)

- **Uso**: ORM para interactuar con la base de datos
- **Por qué**: ORM oficial de AdonisJS con excelente integración TypeScript
- **Ventajas**: Query Builder fluido, migrations/seeders, relaciones entre modelos, type safety

### **Better-SQLite3** (^11.10.0)

- **Uso**: Driver de base de datos SQLite (desarrollo)
- **Por qué**: Base de datos en archivo, ideal para desarrollo, sin servidor separado
- **Ventajas**: Rápido, transacciones ACID, fácil migración a PostgreSQL en producción

### **@adonisjs/auth** (^9.4.0)

- **Uso**: Sistema de autenticación con Access Tokens (7 días, revocables)
- **Por qué**: Autenticación stateless para APIs, múltiples guards, integrado con Lucid
- **Ventajas**: Token-based auth, roles (admin/editor/user), single session para admin

### **VineJS** (@vinejs/vine ^3.0.1)

- **Uso**: Validación de datos de entrada en requests
- **Por qué**: Type inference automática, mensajes claros, performance optimizada
- **Ventajas**: Validaciones asíncronas, integración TypeScript superior

### **@adonisjs/cors** (^2.2.1)

- **Uso**: Manejo de CORS para comunicación frontend-backend
- **Por qué**: Necesario para cross-origin requests
- **Ventajas**: Configuración centralizada, reglas granulares

### **Cloudinary** (opcional, producción)

- **Uso**: Almacenamiento de imágenes en la nube
- **Por qué**: CDN global, transformaciones on-the-fly, free tier generoso
- **Ventajas**: Optimización automática, responsive images, backup

### **LocalStorageProvider** (desarrollo)

- **Uso**: Almacenamiento local de imágenes en `public/uploads/`
- **Por qué**: Desarrollo sin dependencias externas
- **Ventajas**: Sin configuración, rápido, ideal para testing

---

## 🎨 FRONTEND ADMIN (React Admin)

### **React** (^19.1.0)

- **Uso**: Librería principal para UI del panel administrativo
- **Por qué**: Ecosistema maduro, componible, Virtual DOM eficiente
- **Ventajas**: Hot reload, gran comunidad, amplia documentación

### **React Admin** (^5.9.1)

- **Uso**: Framework completo para interfaces CRUD
- **Por qué**: Reduce desarrollo del panel admin en 80%, componentes pre-construidos
- **Ventajas**: DataGrid, Forms, Auth integrados, adaptadores para APIs REST

### **Material-UI (MUI)** (^7.2.0)

- **Uso**: Sistema de diseño y componentes visuales (Material Design)
- **Por qué**: Design system profesional, accesible, integrado con React Admin
- **Ventajas**: Componentes responsive, theming avanzado, @mui/x-data-grid para tablas

### **TypeScript** (^4.9.5)

- **Uso**: Lenguaje tipado para frontend admin
- **Por qué**: Type safety, detección temprana de errores
- **Ventajas**: Autocompletado superior, refactoring seguro

### **ra-data-json-server** (^5.9.1)

- **Uso**: Data provider para conectar React Admin con API REST de AdonisJS
- **Por qué**: Mapeo automático de peticiones CRUD a endpoints
- **Ventajas**: Configuración simple, adaptable

---

## 🌐 FRONTEND LANDING (Astro 5)

### **Astro** (^5.11.0)

- **Uso**: Framework principal para sitio público
- **Por qué**: Arquitectura Islands (0 JS por defecto), extremadamente rápido, SEO-friendly
- **Ventajas**: HTML estático, build rápido, soporte multi-framework, ideal para contenido

### **Tailwind CSS** (^3.4.17)

- **Uso**: Framework CSS utility-first para estilos
- **Por qué**: Desarrollo rápido sin salir del HTML, CSS optimizado con tree-shaking
- **Ventajas**: Responsive design simplificado, sistema de diseño consistente, configuración custom

### **@astrojs/vercel** (^8.0.4)

- **Uso**: Adaptador para SSR en Vercel
- **Por qué**: Optimiza build para Vercel, habilita server-side rendering
- **Ventajas**: Edge functions, optimizaciones automáticas

### **Sharp** (^0.34.3)

- **Uso**: Procesamiento y optimización de imágenes
- **Por qué**: Astro lo usa para responsive images, lazy loading, WebP automático
- **Ventajas**: Mejor Core Web Vitals, imágenes livianas

### **Nodemailer** (^7.0.5)

- **Uso**: Envío de emails desde formulario de contacto
- **Por qué**: Librería estándar de Node.js para emails
- **Ventajas**: Soporte SMTP/Gmail, templates HTML

### **Mercado Pago SDK** (^2.9.0)

- **Uso**: Integración con pasarela de pagos
- **Por qué**: Principal plataforma de pagos en LATAM
- **Ventajas**: Checkout Pro, webhooks, suscripciones

### **TypeScript** (^5.8.3)

- **Uso**: Type checking para archivos .astro
- **Por qué**: Type safety en componentes Astro
- **Ventajas**: @astrojs/check valida tipos en build

---

## 🛠️ CALIDAD DE CÓDIGO

### **TypeScript** (~5.8 backend, ^5.8.3 landing, ^4.9.5 admin)

- **Uso**: Lenguaje principal del proyecto
- **Por qué**: Type safety reduce errores en producción, mejor DX
- **Ventajas**: Autocompletado, refactoring seguro, documentación implícita

### **ESLint** (^9.26.0)

- **Uso**: Linter para mantener calidad de código
- **Por qué**: Detecta errores, enforza estilo consistente
- **Ventajas**: @adonisjs/eslint-config, prevención de bugs

### **Prettier** (^3.5.3)

- **Uso**: Formateador automático de código
- **Por qué**: Código consistente sin discusiones de estilo
- **Ventajas**: @adonisjs/prettier-config, integración con editor

---

## 📦 MONOREPO

### **Node.js + npm**

- **Uso**: Runtime y gestor de paquetes del monorepo
- **Por qué**: Runtime estándar para JavaScript/TypeScript, npm workspaces para monorepo
- **Ventajas**: Ecosistema maduro, dependencias compartidas

### **Concurrently** (^8.2.2)

- **Uso**: Ejecución paralela de dev servers (API + Admin + Landing)
- **Por qué**: Un solo comando (`npm run dev`) levanta todo
- **Ventajas**: Logs coloreados, mejor DX

### Scripts principales

- `npm run dev`: Levanta todo el monorepo
- `npm run install:all`: Instala todas las dependencias
- `npm run build:all`: Build de todos los proyectos
- `npm run lint:all`: Linting en todo el código
- `npm run format:all`: Formateo global

---

## 🧪 TESTING

### **Japa** (^4.2.0) - Backend

- **Uso**: Framework de testing para AdonisJS
- **Por qué**: Test runner oficial, diseñado para AdonisJS
- **Ventajas**: @japa/api-client para testing de endpoints, rápido

### **React Testing Library** (^16.3.0) - Frontend Admin

- **Uso**: Testing de componentes React
- **Por qué**: Promueve testing como usuario final
- **Ventajas**: @testing-library/jest-dom, @testing-library/user-event

---

## 🚀 DEPLOYMENT

### **PostgreSQL** (producción)

- **Uso**: Base de datos en producción (Heroku Postgres Mini o Neon)
- **Por qué**: Lucid soporta múltiples drivers, migración simple desde SQLite
- **Ventajas**: Robusto, escalable, transacciones ACID

### **Heroku** (recomendado con GitHub Student Pack)

- **Uso**: Hosting del backend API
- **Por qué**: $13/mes de crédito con GitHub Student Pack, Eco Dynos + Postgres Mini = $5-10/mes
- **Ventajas**: Deploy con git push, config vars, easy scaling

### **Vercel** (frontend)

- **Uso**: Hosting de Landing (Astro) y Admin (React)
- **Por qué**: Tier gratuito generoso, optimizado para Astro/React
- **Ventajas**: Deploy automático desde GitHub, edge network, SSL

---

## 📚 UTILIDADES

### **Luxon** (^3.6.1)

- **Uso**: Manipulación de fechas y horas
- **Por qué**: Moderno, inmutable, estándar en AdonisJS
- **Ventajas**: Timezones, parsing robusto

### **UUID** (^11.1.0)

- **Uso**: Generación de identificadores únicos
- **Por qué**: IDs seguros para tokens, referencias externas
- **Ventajas**: Globalmente únicos

### **Hot Hook** (^0.4.0)

- **Uso**: Hot Module Replacement en AdonisJS
- **Por qué**: Desarrollo más rápido sin reiniciar servidor
- **Ventajas**: Mantiene estado de la aplicación
