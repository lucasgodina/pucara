# 🚀 Guía de Instalación - Landing Pucará

Esta guía te ayudará a configurar y ejecutar el sitio web de Pucará Gaming en tu entorno local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Git** ([Descargar aquí](https://git-scm.com/))
- Un editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

### Verificar instalación

```bash
node --version  # Debería mostrar v18.x.x o superior
npm --version   # Debería mostrar 9.x.x o superior
git --version   # Debería mostrar 2.x.x o superior
```

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/lucasgodina/pucara.git
cd pucara/frontend/landing
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias listadas en `package.json`, incluyendo:

- Astro (framework principal)
- Tailwind CSS (estilos)
- Vercel Adapter (deployment)
- MercadoPago SDK
- Nodemailer
- Y más...

⏱️ **Nota**: La instalación puede tardar 1-2 minutos dependiendo de tu conexión.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa las variables necesarias:

```bash
# Ya existe un archivo .env base, solo necesitas completar los valores
```

Abre el archivo `.env` y completa las siguientes variables según tus necesidades:

#### Variables Opcionales (para desarrollo básico no son necesarias):

```env
# SMTP - Para envío de emails del formulario de contacto
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# reCAPTCHA - Para validación de formularios
RECAPTCHA_SECRET_KEY=tu-recaptcha-secret-key
```

#### Variables Requeridas (solo si usarás la tienda):

```env
# MercadoPago - Credenciales para pagos
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890abcdef  # Usa credenciales TEST para desarrollo
MERCADOPAGO_PUBLIC_KEY=TEST-abcdef1234567890
```

**¿Dónde conseguir las credenciales de MercadoPago?**

1. Crea una cuenta en [MercadoPago](https://www.mercadopago.com.ar/)
2. Ve a [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel/credentials)
3. Usa las credenciales de **TEST** para desarrollo

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en: **http://localhost:4321**

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Genera el build de producción
npm run preview  # Previsualiza el build de producción localmente
npm run astro    # Ejecuta comandos de Astro CLI
```

## 📁 Estructura del Proyecto

```
landing/
├── src/
│   ├── pages/          # Páginas del sitio (rutas automáticas)
│   │   ├── index.astro     # Página inicial (redirect a /home)
│   │   ├── home.astro      # Home principal
│   │   ├── about.astro     # Sobre nosotros
│   │   ├── contact.astro   # Contacto
│   │   ├── news.astro      # Noticias
│   │   ├── teams/          # Páginas de equipos
│   │   └── store/          # Tienda online
│   ├── components/     # Componentes reutilizables
│   │   ├── navbar.astro
│   │   ├── footer.astro
│   │   ├── hero.astro
│   │   ├── PlayerCard.astro
│   │   └── ...
│   ├── layouts/        # Layouts base
│   │   └── Layout.astro
│   ├── data/          # Datos estáticos
│   │   └── teams.ts
│   └── assets/        # Assets procesados
├── public/            # Archivos estáticos (imágenes, etc.)
├── api/              # Funciones serverless
│   └── contact.js
├── .env              # Variables de entorno (NO subir a git)
├── astro.config.mjs  # Configuración de Astro
├── tailwind.config.cjs  # Configuración de Tailwind
└── package.json      # Dependencias del proyecto
```

## 🎨 Tecnologías Utilizadas

- **[Astro](https://astro.build/)** - Framework web estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript con tipos
- **[Vercel](https://vercel.com/)** - Plataforma de deployment
- **[MercadoPago](https://www.mercadopago.com.ar/)** - Procesamiento de pagos
- **[Nodemailer](https://nodemailer.com/)** - Envío de emails

## 🔧 Configuración Adicional

### Configuración de SMTP para Gmail

Si quieres habilitar el envío de emails desde el formulario de contacto:

1. Habilita la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una "App Password" en: https://myaccount.google.com/apppasswords
3. Usa esa contraseña en la variable `SMTP_PASS` del archivo `.env`

### Configuración de ngrok (para webhooks locales)

Si necesitas probar webhooks de MercadoPago en local:

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta: `ngrok http 4321`
3. Copia la URL generada (ej: `https://abc123.ngrok-free.app`)
4. Agrégala a la variable `NGROK_URL` en `.env`

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error de puerto en uso

Si el puerto 4321 está ocupado:

```bash
# Mata el proceso en ese puerto (Windows)
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# O usa otro puerto
npm run dev -- --port 3000
```

### Error de build

```bash
# Verifica que todas las extensiones sean .astro (minúscula)
# Limpia la caché de Astro
rm -rf .astro dist
npm run build
```

### Vulnerabilidades de npm

Las vulnerabilidades detectadas en `path-to-regexp` son de dependencias de `@astrojs/vercel` y no afectan el desarrollo local. Para reducirlas:

```bash
npm audit fix
```

## 🚀 Deployment en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Haz push de tus cambios a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com/)
3. Configura las variables de entorno en el dashboard de Vercel
4. Deploy automático 🎉

### Opción 2: Desde CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Variables de entorno en Vercel

No olvides configurar las variables de entorno en el dashboard de Vercel:

- `MERCADOPAGO_ACCESS_TOKEN` (usa credenciales de PRODUCCIÓN)
- `MERCADOPAGO_PUBLIC_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (si usas email)

## 📚 Recursos Adicionales

- [Documentación de Astro](https://docs.astro.build/)
- [Documentación de Tailwind](https://tailwindcss.com/docs)
- [Guía de MercadoPago](./FuncionAPIMercadoPago.md)
- [Guía de Frontend](./docs/guia-integracion-frontend.md)
- [Guía de consumo con Astro](./docs/guia-consumo-astro.md)

## 💡 Tips para Desarrollo

1. **Hot Reload**: Los cambios se reflejan automáticamente en el navegador
2. **Extensión de VS Code**: Instala "Astro" para mejor soporte de sintaxis
3. **Tailwind IntelliSense**: Instala la extensión para autocompletado de clases
4. **Console**: Usa la consola del navegador para debugging

## 🤝 Contribuir

1. Crea una rama nueva: `git checkout -b feature/nueva-funcionalidad`
2. Haz commits descriptivos: `git commit -m "feat: agrega nueva sección"`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request en GitHub

## 📞 Soporte

Si tenés problemas o preguntas:

- Abrí un issue en GitHub
- Consultá en el grupo del equipo
- Revisá la documentación en la carpeta `docs/`

---

¡Éxitos con el desarrollo! 🎮🚀
