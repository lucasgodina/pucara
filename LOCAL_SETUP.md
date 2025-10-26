# 🚀 Guía de Configuración Local - Pucara Monorepo

Esta guía te ayudará a configurar y ejecutar el proyecto Pucara completo en tu máquina local.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js**: v18.x o superior ([Descargar](https://nodejs.org/))
- **npm**: v9.x o superior (viene con Node.js)
- **Git**: Para clonar el repositorio ([Descargar](https://git-scm.com/))

Verificar instalaciones:

**Windows (PowerShell):**

```powershell
node --version    # Debe mostrar v18.x o superior
npm --version     # Debe mostrar v9.x o superior
git --version     # Debe mostrar v2.x o superior
```

**Linux/Mac (Terminal):**

```bash
node --version    # Debe mostrar v18.x o superior
npm --version     # Debe mostrar v9.x o superior
git --version     # Debe mostrar v2.x o superior
```

---

## 📁 Estructura del Monorepo

```
pucara/
├── backend/
│   └── crud-pucara/          # API REST con AdonisJS
│       ├── app/
│       ├── database/
│       ├── public/uploads/   # Imágenes subidas (creado automáticamente)
│       └── .env              # Configuración del backend
├── frontend/
│   ├── admin-frontend/       # Panel de administración (React Admin)
│   └── landing/              # Sitio web público (Astro)
└── package.json              # Scripts del monorepo
```

---

## 🔧 Instalación Paso a Paso

### 1️⃣ Clonar el Repositorio

**Windows (PowerShell) / Linux / Mac:**

```bash
git clone https://github.com/lucasgodina/pucara.git
cd pucara
```

### 2️⃣ Instalar Dependencias del Monorepo Raíz

**Windows (PowerShell) / Linux / Mac:**

```bash
npm install
```

Esto instalará `concurrently`, que permite ejecutar múltiples servicios simultáneamente.

### 3️⃣ Instalar Dependencias de Todos los Proyectos

**Windows (PowerShell) / Linux / Mac:**

```bash
npm run install:all
```

Este comando instalará las dependencias de:

- Backend (AdonisJS API)
- Admin Frontend (React Admin)
- Landing (Astro)

⏱️ **Tiempo estimado**: 2-5 minutos dependiendo de tu conexión.

---

## ⚙️ Configuración del Backend

### 4️⃣ Configurar Variables de Entorno

1. Navegar al directorio del backend:

**Windows (PowerShell) / Linux / Mac:**

```bash
cd backend/crud-pucara
```

2. Crear archivo `.env` desde el ejemplo:

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux/Mac:**

```bash
cp .env.example .env
```

3. Abrir `.env` y configurar:

```env
# Puerto y host
PORT=3333
HOST=localhost
NODE_ENV=development

# Base de datos (SQLite por defecto)
DB_CONNECTION=sqlite

# Credenciales del administrador inicial
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Proveedor de almacenamiento de imágenes
STORAGE_PROVIDER=local

# Cloudinary (dejar vacío si usas local)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AWS S3 (dejar vacío si usas local)
AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 5️⃣ Generar APP_KEY

El `APP_KEY` es requerido por AdonisJS para encriptación:

**Windows (PowerShell) / Linux / Mac:**

```bash
node ace generate:key
```

Esto generará una clave y la agregará automáticamente a tu `.env`.

### 6️⃣ Ejecutar Migraciones de Base de Datos

**Windows (PowerShell) / Linux / Mac:**

```bash
node ace migration:run
```

Esto creará las tablas necesarias en la base de datos SQLite (`database/pucara.sqlite`).

### 7️⃣ Crear Usuario Administrador

**Windows (PowerShell) / Linux / Mac:**

```bash
node ace db:seed
```

Esto creará el usuario administrador con las credenciales del `.env`:

- **Email**: `admin@example.com` (o el que configuraste)
- **Password**: `admin123` (o el que configuraste)

### 8️⃣ Volver al Directorio Raíz

**Windows (PowerShell) / Linux / Mac:**

```bash
cd ../..
```

---

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar Todo (Recomendado)

Desde el directorio raíz del proyecto:

**Windows (PowerShell) / Linux / Mac:**

```bash
npm run dev:all
```

Esto iniciará simultáneamente:

- ✅ **API Backend** en `http://localhost:3333`
- ✅ **Admin Frontend** en `http://localhost:3000`
- ✅ **Landing** en `http://localhost:4321`

### Opción 2: Ejecutar Servicios Individuales

Si prefieres ejecutar servicios por separado (en terminales diferentes):

**Terminal 1 - Backend API:**

**Windows (PowerShell) / Linux / Mac:**

```bash
npm run dev:api
# O bien: cd backend/crud-pucara && npm run dev
```

**Terminal 2 - Admin Frontend:**

**Windows (PowerShell) / Linux / Mac:**

```bash
npm run dev:admin
# O bien: cd frontend/admin-frontend && npm start
```

**Terminal 3 - Landing:**

**Windows (PowerShell) / Linux / Mac:**

```bash
npm run dev:landing
# O bien: cd frontend/landing && npm run dev
```

---

## 🌐 URLs de Acceso

Una vez que todos los servicios estén corriendo:

| Servicio        | URL                   | Descripción                           |
| --------------- | --------------------- | ------------------------------------- |
| **API Backend** | http://localhost:3333 | API REST de AdonisJS                  |
| **Admin Panel** | http://localhost:3000 | Panel de administración (React Admin) |
| **Landing**     | http://localhost:4321 | Sitio web público (Astro)             |

---

## 🔐 Credenciales de Acceso

### Admin Panel (http://localhost:3000)

- **Email**: `admin@example.com` (o el configurado en `.env`)
- **Password**: `admin123` (o el configurado en `.env`)

---

## 🧪 Verificar que Todo Funciona

### 1. Verificar Backend

Abre en tu navegador: http://localhost:3333

Deberías ver un mensaje de bienvenida o respuesta de la API.

### 2. Verificar Admin Panel

1. Abre: http://localhost:3000
2. Inicia sesión con las credenciales del administrador
3. Deberías ver el dashboard con:
   - News (Noticias)
   - Users (Usuarios)
   - Teams (Equipos)
   - Players (Jugadores)

### 3. Verificar Landing

Abre: http://localhost:4321

Deberías ver la landing page del proyecto Pucara.

### 4. Probar Subida de Imágenes

**En el Admin Panel:**

1. Ve a **Teams** → **Create**
2. Completa el formulario y sube una imagen de banner
3. Guarda el equipo
4. La imagen debería guardarse en `backend/crud-pucara/public/uploads/teams/`

**En el Admin Panel:**

1. Ve a **Players** → **Create**
2. Completa el formulario y sube una foto
3. Guarda el jugador
4. La imagen debería guardarse en `backend/crud-pucara/public/uploads/players/`

---

## 🔄 Comandos Útiles

### Desde el Directorio Raíz

**Windows (PowerShell) / Linux / Mac:**

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar todo en desarrollo
npm run dev:all

# Ejecutar solo el backend
npm run dev:api

# Ejecutar solo el admin frontend
npm run dev:admin

# Ejecutar solo la landing
npm run dev:landing

# Build de todos los proyectos
npm run build:all
```

### Desde backend/crud-pucara

**Windows (PowerShell) / Linux / Mac:**

```bash
# Ejecutar migraciones
node ace migration:run

# Revertir última migración
node ace migration:rollback

# Crear seed de admin
node ace db:seed

# Ejecutar tests
npm test

# Linting
npm run lint

# Type checking
npm run typecheck
```

---

## 🐛 Solución de Problemas Comunes

### Problema: "PORT 3333 already in use"

**Solución**: Otro proceso está usando el puerto 3333.

**Windows (PowerShell):**

```powershell
# Encontrar el proceso
netstat -ano | findstr :3333

# Matar el proceso (reemplaza PID con el número encontrado)
taskkill /PID <PID> /F

# O cambiar el puerto en backend/crud-pucara/.env
PORT=3334
```

**Linux/Mac:**

```bash
# Encontrar el proceso
lsof -i :3333

# Matar el proceso (reemplaza PID con el número encontrado)
kill -9 <PID>

# O cambiar el puerto en backend/crud-pucara/.env
PORT=3334
```

### Problema: "Cannot find module '@adonisjs/...'"

**Solución**: Las dependencias del backend no están instaladas.

**Windows (PowerShell) / Linux / Mac:**

```bash
cd backend/crud-pucara
npm install
cd ../..
```

### Problema: "Database migration failed"

**Solución**: Elimina la base de datos y vuelve a crear las migraciones.

**Windows (PowerShell):**

```powershell
cd backend/crud-pucara
Remove-Item database/pucara.sqlite -Force
node ace migration:run
node ace db:seed
cd ../..
```

**Linux/Mac:**

```bash
cd backend/crud-pucara
rm -f database/pucara.sqlite
node ace migration:run
node ace db:seed
cd ../..
```

### Problema: "Login failed" en Admin Panel

**Solución**: Verifica que el usuario administrador existe.

**Windows (PowerShell) / Linux / Mac:**

```bash
cd backend/crud-pucara
node ace db:seed
cd ../..
```

### Problema: "Cannot upload images"

**Solución**: Las carpetas se crean automáticamente al subir la primera imagen. Si hay un error de permisos:

**Windows (PowerShell):**

```powershell
cd backend/crud-pucara
# Verificar que existe la carpeta public
Test-Path public
cd ../..
```

**Linux/Mac:**

```bash
cd backend/crud-pucara
# Verificar que existe la carpeta public
ls -la public
# Si necesitas dar permisos
chmod -R 755 public
cd ../..
```

### Problema: "Module not found" en Admin Frontend

**Solución**: Reinstala las dependencias del admin frontend.

**Windows (PowerShell):**

```powershell
cd frontend/admin-frontend
Remove-Item -Recurse -Force node_modules
npm install
cd ../..
```

**Linux/Mac:**

```bash
cd frontend/admin-frontend
rm -rf node_modules
npm install
cd ../..
```

---

## 📦 Base de Datos

### SQLite (Por Defecto)

El proyecto usa SQLite para desarrollo local. La base de datos se crea automáticamente en:

```
backend/crud-pucara/database/pucara.sqlite
```

**Nota**: Las carpetas de imágenes (`public/uploads/teams/` y `public/uploads/players/`) se crean automáticamente al subir la primera imagen.

**Ventajas**:

- ✅ No requiere instalación de servidor de base de datos
- ✅ Archivo único y portable
- ✅ Perfecto para desarrollo local

### Estructura de Tablas

- **users**: Usuarios del sistema (admin, editores)
- **news**: Noticias publicadas
- **teams**: Equipos de esports
- **players**: Jugadores
- **player_teams**: Historial de jugadores en equipos (no implementado aún)

---

## 🖼️ Sistema de Almacenamiento de Imágenes

### Proveedor Local (Por Defecto)

Las imágenes se guardan en el servidor en:

```
backend/crud-pucara/public/uploads/
├── teams/      # Banners de equipos
└── players/    # Fotos de jugadores
```

**Acceso a imágenes**: `http://localhost:3333/uploads/{folder}/{filename}`

### Cambiar a Cloudinary (Opcional)

1. Crear cuenta gratuita en [cloudinary.com](https://cloudinary.com)
2. Obtener credenciales del dashboard
3. Editar `backend/crud-pucara/.env`:

```env
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Instalar dependencia:

**Windows (PowerShell) / Linux / Mac:**

```bash
cd backend/crud-pucara
npm install cloudinary
cd ../..
```

5. Reiniciar el backend

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

- [README.md](./README.md) - Overview general del proyecto
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Sistema de autenticación
- [IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md) - Subida de imágenes
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migración de usuarios
- [PLAYER_FIELDS_UPDATE.md](./PLAYER_FIELDS_UPDATE.md) - Actualización de campos
- [TECHNOLOGIES_RECAP.md](./TECHNOLOGIES_RECAP.md) - Stack tecnológico

### Documentación Externa

- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [React Admin Documentation](https://marmelab.com/react-admin/Documentation.html)
- [Astro Documentation](https://docs.astro.build/)

---

## 🎯 Próximos Pasos

Una vez que tengas todo corriendo:

1. **Explora el Admin Panel**: Crea equipos, jugadores, noticias
2. **Prueba subir imágenes**: Verifica que el sistema de storage funciona
3. **Revisa la Landing**: Personaliza el contenido público
4. **Lee la documentación**: Familiarízate con la arquitectura

---

## 💡 Tips para Desarrollo

### Hot Reload

Todos los servicios tienen hot reload activado:

- **Backend**: Se recarga automáticamente al guardar archivos `.ts`
- **Admin Frontend**: React refresh al guardar componentes
- **Landing**: Astro refresh al guardar páginas/componentes

### Debugging

**Backend (AdonisJS)**:

- Los logs aparecen en la terminal donde ejecutaste `npm run dev:api`
- Usa `console.log()` o el logger de AdonisJS

**Frontend (React Admin)**:

- Usa las DevTools del navegador (F12)
- Network tab para ver llamadas a la API
- Console para logs

### VS Code Extensions Recomendadas

- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **AdonisJS**: Snippets y soporte
- **Astro**: Soporte para archivos .astro

---

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias:

1. Abre un issue en GitHub
2. Crea un pull request con tus cambios
3. Sigue las convenciones de código del proyecto

---

## 📄 Licencia

Este proyecto es privado. Ver [LICENSE](./LICENSE) para más detalles.

---

## ✅ Checklist de Verificación

Usa esta lista para verificar que todo está configurado correctamente:

- [ ] Node.js v18+ instalado
- [ ] npm instalado
- [ ] Repositorio clonado
- [ ] Dependencias del monorepo instaladas (`npm install`)
- [ ] Dependencias de todos los proyectos instaladas (`npm run install:all`)
- [ ] Archivo `.env` creado en `backend/crud-pucara/`
- [ ] `APP_KEY` generada en el `.env`
- [ ] Migraciones ejecutadas (`node ace migration:run`)
- [ ] Usuario admin creado (`node ace db:seed`)
- [ ] Backend corriendo en http://localhost:3333
- [ ] Admin frontend corriendo en http://localhost:3000
- [ ] Landing corriendo en http://localhost:4321
- [ ] Login exitoso en el admin panel
- [ ] Subida de imágenes funciona correctamente

---

**¡Listo! 🎉 Tu entorno de desarrollo local está configurado y funcionando.**

Si tienes problemas, consulta la sección de [Solución de Problemas](#-solución-de-problemas-comunes) o revisa los logs en las terminales.
