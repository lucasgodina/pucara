# TECHNOLOGIES_RECAP.MD

Documentación exhaustiva de las tecnologías, frameworks, librerías y herramientas utilizadas en el proyecto Pucará.

---

## 📁 ROOT (Monorepo)

### Gestión del Monorepo

#### **Node.js + npm workspaces**

- **Uso**: Gestión del monorepo que contiene backend y frontend
- **Por qué**: Node.js es el runtime estándar para JavaScript/TypeScript. Permite ejecutar scripts de gestión y coordinar múltiples proyectos desde la raíz
- **Ventajas**: Ecosistema maduro, amplia compatibilidad, facilita la gestión de dependencias compartidas

#### **Concurrently** (^8.2.2)

- **Uso**: Ejecución paralela de múltiples comandos npm (API + Admin + Landing simultáneamente)
- **Por qué**: Permite levantar todos los servicios del monorepo con un solo comando (`npm run dev:all`)
- **Ventajas**: Simplifica el desarrollo, muestra logs de múltiples procesos con códigos de color, mejora la experiencia del desarrollador

### Scripts de Gestión

- `dev:all`: Levanta API, admin y landing simultáneamente
- `install:all`: Instala dependencias en todos los proyectos
- `build:all`: Construye todos los proyectos para producción

---

## 🎨 FRONTEND

El frontend está dividido en dos aplicaciones independientes:

### 1. Admin Frontend (Panel de Administración CRUD)

#### **React** (^19.1.0)

- **Uso**: Librería principal para construir la interfaz de usuario del panel administrativo
- **Por qué**: Librería declarativa, componible y con un ecosistema maduro. React 19 trae mejoras en rendimiento y nuevas características
- **Ventajas**: Virtual DOM eficiente, gran comunidad, amplia documentación, hot reload para desarrollo ágil

#### **React Admin** (^5.9.1)

- **Uso**: Framework completo para construir interfaces de administración (CRUD)
- **Por qué**: Proporciona componentes pre-construidos para gestión de datos (tablas, formularios, autenticación, etc.), reduciendo significativamente el tiempo de desarrollo
- **Ventajas**:
  - Componentes listos para usar (DataGrid, Forms, List, Edit, Create)
  - Integración con Material-UI
  - Sistema de autenticación incluido
  - Gestión de estado integrada
  - Adaptadores para diferentes APIs

#### **Material-UI (MUI)** (^7.2.0)

- **@mui/material**: Componentes de UI siguiendo Material Design
- **@mui/icons-material**: Iconos de Material Design
- **@mui/x-data-grid**: Componente avanzado de tabla/grid
- **@emotion/react** y **@emotion/styled**: Sistema de estilos CSS-in-JS
- **Uso**: Sistema de diseño y componentes visuales
- **Por qué**: Design system completo, profesional y accesible. Se integra perfectamente con React Admin
- **Ventajas**:
  - Componentes responsive y accesibles por defecto
  - Theming avanzado
  - Documentación excelente
  - Personalizable

#### **ra-data-json-server** (^5.9.1)

- **Uso**: Data provider para React Admin que se comunica con APIs REST
- **Por qué**: Adaptador que facilita la conexión entre React Admin y la API de AdonisJS
- **Ventajas**: Mapeo automático de peticiones CRUD a endpoints REST

#### **TypeScript** (^4.9.5)

- **Uso**: Lenguaje tipado para el desarrollo del frontend admin
- **Por qué**: Proporciona type safety, mejor autocompletado y detección temprana de errores
- **Ventajas**: Mejor experiencia de desarrollo, código más mantenible, refactoring más seguro

#### **Create React App (CRA)** con **react-app-rewired**

- **react-scripts** (5.0.1): Configuración y scripts de CRA
- **react-app-rewired** (^2.2.1): Permite modificar la configuración de webpack sin eject
- **customize-cra** (^1.0.0): Helpers para personalizar CRA
- **Por qué**: CRA ofrece una configuración zero-config para empezar rápido. react-app-rewired permite ajustes sin perder las ventajas de CRA
- **Ventajas**: Configuración simplificada, optimizaciones out-of-the-box

#### **cross-env** (^7.0.3)

- **Uso**: Setear variables de entorno de forma cross-platform
- **Por qué**: Necesario para configurar `NODE_OPTIONS` y otras variables en Windows/Linux/Mac
- **Ventajas**: Compatible con todos los sistemas operativos

#### **Testing**

- **@testing-library/react** (^16.3.0): Testing de componentes React
- **@testing-library/jest-dom** (^6.6.3): Matchers personalizados para Jest
- **@testing-library/user-event** (^13.5.0): Simulación de interacciones de usuario
- **@types/jest**: Tipos TypeScript para Jest
- **Por qué**: React Testing Library promueve mejores prácticas de testing (testing como usuario final)
- **Ventajas**: Tests más robustos y mantenibles

#### Configuraciones especiales

- **Proxy**: `http://localhost:3333` - Redirige peticiones API al backend en desarrollo
- **NODE_OPTIONS**: `--max-old-space-size=12288` - Aumenta memoria disponible para evitar errores de heap en builds grandes
- **GENERATE_SOURCEMAP**: `false` - Reduce tamaño de build
- **TSC_COMPILE_ON_ERROR**: `true` - Permite compilar con errores TypeScript (útil en desarrollo)

---

### 2. Landing Page (Sitio público)

#### **Astro** (^5.11.0)

- **Uso**: Framework principal para construir el sitio web público
- **Por qué**: Arquitectura "Islands" que envía 0 JavaScript por defecto, mejorando drasticamente el rendimiento
- **Ventajas**:
  - Extremadamente rápido (genera HTML estático)
  - SEO-friendly por defecto
  - Soporte para múltiples frameworks (React, Vue, Svelte, etc.)
  - Build times muy rápidos
  - Ideal para sitios de contenido

#### **Tailwind CSS** (^3.4.17)

- **@astrojs/tailwind** (^6.0.2): Integración oficial de Tailwind con Astro
- **autoprefixer** (^10.4.21): Añade prefijos CSS automáticamente
- **postcss** (^8.5.6): Procesador de CSS
- **Uso**: Framework CSS utility-first para estilos
- **Por qué**: Permite crear diseños custom rápidamente sin salir del HTML, CSS altamente optimizado
- **Ventajas**:
  - Desarrollo rápido con clases utilitarias
  - CSS minificado y tree-shaken en producción
  - Sistema de diseño consistente
  - Responsive design simplificado
  - Configuración personalizada (colores, breakpoints, animaciones)

#### Configuración personalizada de Tailwind

- **Breakpoints custom**: Desde mobile-s (320px) hasta 3xl (1920px) para máximo control responsive
- **Paleta de colores**: Sistema de colores primary (naranja #ea601a) con variantes
- **Animaciones custom**: fadeIn, slideUp, pulse-glow para interacciones dinámicas
- **Shadows custom**: Efectos glow para estética gaming
- **Font family**: Ubuntu como tipografía principal

#### **@astrojs/vercel** (^8.0.4)

- **Uso**: Adaptador para desplegar Astro en Vercel
- **Por qué**: Optimiza el build específicamente para la plataforma Vercel
- **Ventajas**: Server-side rendering, edge functions, optimizaciones automáticas

#### **Sharp** (^0.34.3)

- **Uso**: Procesamiento y optimización de imágenes
- **Por qué**: Astro lo usa para optimizar imágenes automáticamente (responsive images, lazy loading, formatos modernos como WebP)
- **Ventajas**: Imágenes más livianas, mejor performance, mejor Core Web Vitals

#### **Shiki** (^1.26.0)

- **Uso**: Syntax highlighting para bloques de código
- **Por qué**: Mismo highlighter que usa VS Code, altamente personalizable
- **Ventajas**: Highlighting preciso, múltiples temas, support para muchos lenguajes

#### **TypeScript** (^5.8.3)

- **Uso**: Lenguaje tipado para el desarrollo
- **@astrojs/check** (^0.9.4): Type checking para archivos Astro
- **Por qué**: Type safety, mejor DX, detección de errores en tiempo de desarrollo
- **Ventajas**: Código más robusto, mejor autocompletado en .astro files

#### **Nodemailer** (^7.0.5)

- **Uso**: Envío de emails desde el formulario de contacto
- **Por qué**: Librería estándar de Node.js para envío de emails, muy confiable
- **Ventajas**: Soporte para múltiples transportes (SMTP, Gmail, etc.), templates HTML

#### **Mercado Pago SDK** (^2.9.0)

- **Uso**: Integración con la pasarela de pagos de Mercado Pago
- **Por qué**: Principal plataforma de pagos en LATAM
- **Ventajas**: Checkout Pro, webhooks, manejo de suscripciones, amplia documentación

#### Configuraciones de build

- **output**: `server` - Habilita SSR (Server-Side Rendering)
- **inlineStylesheets**: `auto` - Optimiza la carga de CSS
- **compressHTML**: `true` - Minifica HTML en producción
- **allowedHosts**: Configurado para ngrok (desarrollo/testing con URLs públicas)

---

## 🔧 BACKEND

### **AdonisJS** (^6.18.0)

- **Uso**: Framework principal del backend, proporciona toda la arquitectura de la API REST
- **Por qué**: Framework full-stack de Node.js altamente productivo, con TypeScript de primera clase y arquitectura MVC robusta
- **Ventajas**:
  - ORM Lucid integrado
  - Sistema de autenticación incluido
  - CLI potente (Ace commands)
  - Hot Module Replacement (HMR)
  - Validación de datos integrada
  - TypeScript nativo
  - Estructura de carpetas opinionada y organizada
  - Middleware system robusto

### Base de Datos

#### **Lucid ORM** (@adonisjs/lucid ^21.6.1)

- **Uso**: ORM (Object-Relational Mapping) para interactuar con la base de datos
- **Por qué**: ORM oficial de AdonisJS con excelente integración TypeScript
- **Ventajas**:
  - Query Builder fluido
  - Migrations y seeders
  - Relaciones entre modelos
  - Type safety con TypeScript
  - Soft deletes, scopes, hooks

#### **Better-SQLite3** (^11.10.0)

- **Uso**: Driver de base de datos SQLite
- **Por qué**: SQLite es ideal para desarrollo y proyectos pequeños/medianos. Better-SQLite3 es más rápido que el driver original
- **Ventajas**:
  - Base de datos en archivo (sin servidor separado)
  - Rápido y eficiente
  - Perfecto para desarrollo
  - Fácil de migrar a PostgreSQL/MySQL en producción
  - Transacciones ACID

### Autenticación y Seguridad

#### **@adonisjs/auth** (^9.4.0)

- **Uso**: Sistema completo de autenticación
- **Configuración**: Access Tokens (API tokens) para autenticación stateless
- **Por qué**: Solución oficial de AdonisJS, bien integrada con el ecosistema
- **Ventajas**:
  - Múltiples guards (session, tokens, etc.)
  - Token-based authentication para APIs
  - User providers configurables
  - Middleware de autenticación

#### **@adonisjs/cors** (^2.2.1)

- **Uso**: Manejo de CORS (Cross-Origin Resource Sharing)
- **Por qué**: Necesario para que el frontend pueda comunicarse con el backend desde diferentes orígenes
- **Ventajas**: Configuración centralizada, reglas granulares

### Validación de Datos

#### **VineJS** (@vinejs/vine ^3.0.1)

- **Uso**: Validación de datos de entrada (requests)
- **Por qué**: Librería moderna de validación con excelente integración TypeScript y mensajes de error claros
- **Ventajas**:
  - Type inference automática
  - Validaciones asíncronas
  - Mensajes de error personalizables
  - Performance optimizada

#### **@adonisjs/validator** (^13.0.2)

- **Uso**: Sistema de validación legacy/alternativo de AdonisJS
- **Por qué**: Compatibilidad con versiones anteriores
- **Nota**: El proyecto usa principalmente VineJS

### Utilidades y Helpers

#### **Luxon** (^3.6.1)

- **Uso**: Manipulación de fechas y horas
- **Por qué**: Librería moderna, inmutable y con mejor API que Moment.js. Es el estándar en AdonisJS
- **Ventajas**:
  - Manejo de timezones
  - Parsing y formatting robusto
  - Inmutabilidad
  - TypeScript support

#### **UUID** (^11.1.0)

- **Uso**: Generación de identificadores únicos universales
- **Por qué**: IDs únicos para recursos, tokens, referencias externas
- **Ventajas**: Globalmente únicos, seguros para uso distribuido

#### **reflect-metadata** (^0.2.2)

- **Uso**: Metadatos de reflexión para decorators de TypeScript
- **Por qué**: Requerido por AdonisJS para inyección de dependencias y decorators
- **Ventajas**: Habilita características avanzadas de TypeScript

### Servir Archivos Estáticos

#### **@adonisjs/static** (^1.1.1)

- **Uso**: Servir archivos estáticos (imágenes, PDFs, etc.) desde la carpeta `public/`
- **Por qué**: Necesario para servir assets del backend
- **Ventajas**: Optimizaciones de caché, configuración simple

### Development Tools

#### **TypeScript** (~5.8)

- **@adonisjs/tsconfig** (^1.4.0): Configuración TypeScript optimizada para AdonisJS
- **ts-node-maintained** (^10.9.5): Ejecutar TypeScript directamente
- **Uso**: Lenguaje principal del backend
- **Por qué**: Type safety, mejor DX, detección temprana de errores
- **Ventajas**: Autocompletado superior, refactoring seguro, código más mantenible

#### **Hot Hook** (^0.4.0)

- **Uso**: Hot Module Replacement (HMR) para controladores y middleware
- **Por qué**: Acelera el desarrollo al actualizar código sin reiniciar el servidor
- **Ventajas**: Desarrollo más rápido, mantiene el estado de la aplicación

#### **@adonisjs/assembler** (^7.8.2)

- **Uso**: Build tool de AdonisJS para producción
- **Por qué**: Compila TypeScript a JavaScript optimizado para producción
- **Ventajas**: Tree shaking, optimizaciones, source maps

#### **ESLint** (^9.26.0)

- **@adonisjs/eslint-config** (^2.0.0): Configuración ESLint de AdonisJS
- **Uso**: Linter para mantener calidad de código
- **Por qué**: Detecta errores, enforza estilo de código consistente
- **Ventajas**: Prevención de bugs, código más limpio

#### **Prettier** (^3.5.3)

- **@adonisjs/prettier-config** (^1.4.4): Configuración Prettier de AdonisJS
- **Uso**: Formateador de código automático
- **Por qué**: Código consistente sin discusiones de estilo
- **Ventajas**: Formateo automático, integración con editor

#### **pino-pretty** (^13.0.0)

- **Uso**: Pretty-printing de logs en desarrollo
- **Por qué**: Logs más legibles durante el desarrollo (AdonisJS usa Pino para logging)
- **Ventajas**: Logs coloreados, formato estructurado

### Testing

#### **Japa** (^4.2.0)

- **@japa/runner** (^4.2.0): Test runner
- **@japa/assert** (^4.0.1): Assertions
- **@japa/api-client** (^3.1.0): Testing de APIs HTTP
- **@japa/plugin-adonisjs** (^4.0.0): Integración con AdonisJS
- **Uso**: Framework de testing completo para el backend
- **Por qué**: Test runner oficial de AdonisJS, diseñado específicamente para testing de aplicaciones AdonisJS
- **Ventajas**:
  - Tests rápidos
  - Sintaxis clara
  - Soporte para tests unitarios y funcionales
  - API client para testing de endpoints
  - Integración con la base de datos de testing

#### **@swc/core** (1.11.24)

- **Uso**: Compilador ultra-rápido de TypeScript/JavaScript
- **Por qué**: Acelera la ejecución de tests compilando TypeScript a JavaScript
- **Ventajas**: 20x más rápido que TypeScript compiler, escrito en Rust

### Path Aliases

AdonisJS utiliza un sistema de imports con alias (#) para evitar rutas relativas:

- `#controllers/*` → `./app/controllers/*.js`
- `#models/*` → `./app/models/*.js`
- `#middleware/*` → `./app/middleware/*.js`
- `#validators/*` → `./app/validators/*.js`
- `#config/*` → `./config/*.js`
- Y más...

**Por qué**: Imports más limpios, refactoring más fácil, no más `../../../../../../`

---

## 🎯 Arquitectura General del Proyecto

### Monorepo Structure

```
Root (Monorepo Management)
├── Backend (AdonisJS REST API)
│   ├── SQLite Database
│   ├── Authentication (Token-based)
│   ├── CRUD Operations (Teams, Players, News, Users)
│   └── Port 3333
│
├── Frontend Admin (React + React Admin)
│   ├── CRUD Interface
│   ├── Material-UI Components
│   └── Port 3000
│
└── Frontend Landing (Astro + Tailwind)
    ├── Public Website (SSR)
    ├── Mercado Pago Integration
    └── Vercel Deployment
```

### Flujo de Datos

1. **Admin → Backend**: React Admin consume API REST en `/api/v1` con autenticación por tokens
2. **Landing → Backend**: Astro consume endpoints públicos (GET) para mostrar datos
3. **Landing → Mercado Pago**: Integración directa para pagos
4. **Landing → Email**: Nodemailer para formulario de contacto

### Por qué esta arquitectura

#### Separación de responsabilidades

- **Backend único**: Una sola fuente de verdad para datos
- **Admin separado**: Interfaz especializada para gestión (CRUD completo)
- **Landing separado**: Sitio público optimizado para performance y SEO

#### Ventajas

- **Escalabilidad**: Cada parte puede escalar independientemente
- **Mantenibilidad**: Cambios en un área no afectan a las otras
- **Performance**: Landing ultra-rápido (Astro), Admin rico en features (React)
- **SEO**: Landing con SSR y HTML estático para mejor indexación
- **Developer Experience**: Tecnologías especializadas para cada caso de uso

---

## 📊 Resumen de Decisiones Técnicas

### Backend: AdonisJS

**Elegido por**: Framework full-featured, TypeScript nativo, productividad alta, ORM robusto, autenticación incluida, CLI potente

### Frontend Admin: React + React Admin + MUI

**Elegido por**: Necesidad de CRUD completo, componentes pre-construidos, Material Design profesional, integración perfecta

### Frontend Landing: Astro + Tailwind

**Elegido por**: Performance extrema, SEO-first, HTML estático, flexibilidad en estilos, ideal para contenido

### Base de Datos: SQLite

**Elegido por**: Simplicidad en desarrollo, sin servidor adicional, fácil migración futura, suficiente para el caso de uso actual

### Autenticación: Token-based (Access Tokens)

**Elegido por**: Arquitectura stateless, ideal para APIs REST, compatible con múltiples clientes

### Estilos: Tailwind CSS

**Elegido por**: Desarrollo rápido, CSS optimizado, diseño consistente, personalización completa

### Testing: Japa (Backend)

**Elegido por**: Integración oficial con AdonisJS, tests rápidos, sintaxis clara

### Deployment: Vercel (Landing)

**Elegido por**: Optimizaciones automáticas para Astro, edge functions, CDN global, CI/CD integrado

---

**Última actualización**: Octubre 2025
