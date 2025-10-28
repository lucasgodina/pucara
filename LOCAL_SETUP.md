# Setup Local — Guía paso a paso

Esta guía te llevará desde cero hasta tener el proyecto corriendo localmente usando comandos desde la raíz del monorepo.

---

## Requisitos previos

Antes de empezar, asegurate de tener instalado:

- **Node.js 18+**: descargar desde [nodejs.org](https://nodejs.org/)
- **Git**: descargar desde [git-scm.com](https://git-scm.com/)
- **Editor de código**: recomendado VS Code

Verificar versiones:

```bash
node --version    # Debe ser v18 o superior
npm --version     # Debe ser v9 o superior
git --version
```

---

## Paso 1: Clonar el repositorio

Abrir terminal y ejecutar:

```bash
git clone https://github.com/lucasgodina/pucara.git
cd pucara
```

**¿Qué hace esto?**

- Descarga todo el código del proyecto a tu máquina
- Entra a la carpeta raíz del monorepo

---

## Paso 2: Instalar todas las dependencias

Desde la raíz del proyecto:

```bash
npm run install:all
```

**¿Qué hace esto?**

- Instala dependencias del backend (AdonisJS, Lucid ORM, etc.)
- Instala dependencias del admin (React, React Admin, MUI, etc.)
- Instala dependencias del landing (Astro, etc.)
- Todo en un solo comando. Tarda 3-5 minutos.

---

## Paso 3: Configurar el backend

### 3.1 Crear archivo de variables de entorno

```bash
# Windows (PowerShell)
copy backend\crud-pucara\.env.example backend\crud-pucara\.env

# Mac/Linux
cp backend/crud-pucara/.env.example backend/crud-pucara/.env
```

### 3.2 Generar APP_KEY

```bash
cd backend/crud-pucara
node ace generate:key
cd ../..
```

**Importante:** Copiar la clave generada y pegarla en `backend/crud-pucara/.env` en la línea `APP_KEY=`.

### 3.3 Editar credenciales del admin

Abrir `backend/crud-pucara/.env` y configurar:

```env
# Credenciales del usuario administrador (cambialas)
ADMIN_NAME=Tu Nombre
ADMIN_USERNAME=admin
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=contraseña-segura-123

# Para desarrollo local, usar almacenamiento local
STORAGE_PROVIDER=local

# Base de datos SQLite (ya configurado)
DB_CONNECTION=sqlite
```

### 3.4 Crear base de datos y usuario admin

Desde la raíz:

```bash
cd backend/crud-pucara
node ace migration:run
node ace db:seed
cd ../..
```

**¿Qué hace esto?**

- `migration:run`: crea todas las tablas (users, teams, players, news, access_tokens)
- `db:seed`: crea el usuario admin con las credenciales del `.env`

---

## Paso 4: Levantar todos los servicios

Desde la raíz del proyecto:

```bash
npm run dev
```

**¿Qué hace esto?**

- Levanta el backend en http://localhost:3333
- Levanta el admin en http://localhost:3000
- Levanta el landing en http://localhost:4321
- Todo en paralelo con logs coloreados (verde=api, azul=admin, magenta=landing)

**Verificar que funciona:**

- El terminal muestra logs de los 3 servicios
- Backend: http://localhost:3333 (mensaje de bienvenida)
- Admin: http://localhost:3000 (página de login)
- Landing: http://localhost:4321 (sitio público)

**Para detener:** `Ctrl + C` una sola vez detiene los 3 servicios.

---

## Paso 5: Probar el flujo completo

### 5.1 Login en el admin

1. Ir a http://localhost:3000
2. Loguearse con las credenciales del `.env` (ej: `admin` / `contraseña-segura-123`)
3. Deberías ver el dashboard con menú: Teams, Players, News, Users

### 5.2 Crear contenido

1. **Crear un equipo:**

   - Teams → Create
   - Completar: name, slug, description
   - Subir banner (opcional)
   - Save

2. **Crear un jugador:**
   - Players → Create
   - Completar: name, age, role, country
   - Asignar al equipo creado
   - Subir foto (opcional)
   - Save

### 5.3 Ver en el landing

1. Ir a http://localhost:4321
2. Deberías ver el equipo y jugador que creaste
3. Navegar por las secciones

---

## Problemas comunes

### Error: "Port 3333 is already in use"

**Solución:** Ya hay algo corriendo en ese puerto. Detenerlo o cambiar el puerto en `backend/crud-pucara/.env`:

```env
PORT=3334
```

### Error: "Cannot find module 'xxx'"

**Solución:** Las dependencias no se instalaron correctamente. Ejecutar:

```bash
npm run install:all
```

### Error al hacer login en el admin

**Solución:**

- Verificar que los 3 servicios estén corriendo (`npm run dev`)
- Verificar las credenciales en `backend/crud-pucara/.env`
- Asegurarse de haber ejecutado `node ace db:seed`

### Error: "Database not found"

**Solución:** No se ejecutaron las migraciones:

```bash
cd backend/crud-pucara
node ace migration:run
node ace db:seed
cd ../..
```

### La landing no muestra datos

**Solución:**

- Verificar que el backend esté corriendo
- Crear contenido desde el admin panel primero
- Refrescar la página del landing

### Error: "APP_KEY is required"

**Solución:** Falta configurar la APP_KEY en el `.env`:

```bash
cd backend/crud-pucara
node ace generate:key
# Copiar la clave generada al .env
cd ../..
```
