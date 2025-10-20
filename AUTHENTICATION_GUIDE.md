# 🔐 Guía Completa del Sistema de Autenticación - Pucara

**Fecha de actualización:** 19 de Octubre de 2025  
**Backend:** AdonisJS 6 + SQLite3  
**Frontend:** React Admin

---

## 📋 Tabla de Contenidos

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Credenciales por Defecto](#credenciales-por-defecto)
3. [Flujo de Autenticación](#flujo-de-autenticación)
4. [Endpoints de API](#endpoints-de-api)
5. [Cómo Hacer Login](#cómo-hacer-login)
6. [Troubleshooting](#troubleshooting)
7. [Configuración del Frontend](#configuración-del-frontend)

---

## 🎯 Resumen del Sistema

El proyecto Pucara utiliza un sistema de autenticación basado en **JWT (JSON Web Tokens)** implementado con:

- **Backend:** AdonisJS 6 con `@adonisjs/auth` y tokens de acceso
- **Base de Datos:** SQLite3 (tablas `users` y `access_tokens`)
- **Frontend:** React Admin con `authProvider` personalizado
- **Tokens:** Bearer tokens con expiración de 7 días

---

## 🔑 Credenciales por Defecto

Después de ejecutar `node ace db:seed`, se crea un usuario administrador:

| Campo               | Valor                             |
| ------------------- | --------------------------------- |
| **Nombre Completo** | `Administrador`                   |
| **Email**           | `psammartino@pucaragaming.com.ar` |
| **Contraseña**      | `admin123`                        |

### ⚠️ IMPORTANTE

- Estas credenciales son para **desarrollo únicamente**
- Cambia la contraseña en producción
- El campo de usuario en el login es el **EMAIL**, no un username

---

## 🔄 Flujo de Autenticación

### 1. Login (Usuario → Backend)

```
Usuario ingresa credenciales
         ↓
Frontend envía POST a /api/v1/auth/login
         ↓
Backend verifica email + password
         ↓
Backend genera JWT token
         ↓
Frontend guarda token en localStorage
         ↓
Usuario autenticado ✅
```

### 2. Requests Autenticados

```
Frontend hace request a API
         ↓
Agrega header: Authorization: Bearer {token}
         ↓
Backend valida token
         ↓
Si válido → Procesa request
Si inválido → Error 401
```

### 3. Logout

```
Usuario hace logout
         ↓
Frontend llama /api/v1/auth/logout
         ↓
Backend invalida el token
         ↓
Frontend limpia localStorage
         ↓
Redirige a login
```

---

## 🌐 Endpoints de API

### Base URL

```
http://localhost:3333/api/v1
```

### Rutas Públicas (No requieren autenticación)

#### 1. **Login**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "psammartino@pucaragaming.com.ar",
  "password": "admin123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "type": "bearer",
  "value": "oat_MQ.X3VEd2FzTXBrOGpUdkN4c0x3VVhabjZILUwtUG9vOHc1eEx1d2tpNDEwMTI2MDU1ODM",
  "user": {
    "id": 1,
    "fullName": "Administrador",
    "email": "psammartino@pucaragaming.com.ar"
  }
}
```

**Respuesta de Error (401):**

```json
{
  "message": "Invalid user credentials"
}
```

#### 2. **Registro de Usuario**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

**Respuesta Exitosa (201):**

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 2,
    "fullName": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

### Rutas Protegidas (Requieren autenticación)

#### 3. **Obtener Perfil del Usuario Actual**

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Respuesta (200):**

```json
{
  "id": 1,
  "fullName": "Administrador",
  "email": "psammartino@pucaragaming.com.ar",
  "createdAt": "2025-10-20T00:50:57.000+00:00",
  "updatedAt": "2025-10-20T00:50:57.000+00:00"
}
```

#### 4. **Logout**

```http
DELETE /api/v1/auth/logout
Authorization: Bearer {token}
```

**Respuesta (200):**

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🖥️ Cómo Hacer Login

### Desde el Frontend (React Admin)

1. **Abrir el navegador:** http://localhost:3000
2. **Ingresar credenciales:**
   - **Username/Email:** `psammartino@pucaragaming.com.ar`
   - **Password:** `admin123`
3. **Click en "Sign in"**

### Desde la Terminal (Testing)

```powershell
# PowerShell
$body = @{
    email = "psammartino@pucaragaming.com.ar"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:3333/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Ver el token
$response.value
```

```bash
# Bash/Linux
curl -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "psammartino@pucaragaming.com.ar",
    "password": "admin123"
  }'
```

### Desde Postman/Insomnia

1. **Method:** POST
2. **URL:** `http://localhost:3333/api/v1/auth/login`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**

```json
{
  "email": "psammartino@pucaragaming.com.ar",
  "password": "admin123"
}
```

---

## 🔧 Troubleshooting

### Problema 1: "Credenciales inválidas"

**Síntomas:**

- Frontend muestra "Invalid credentials"
- Backend responde 401

**Soluciones:**

✅ **Verificar que el usuario existe en la base de datos:**

```bash
cd backend/crud-players-pucara
sqlite3 database/pucara.sqlite
```

```sql
SELECT * FROM users WHERE email = 'psammartino@pucaragaming.com.ar';
.exit
```

✅ **Recrear el usuario admin:**

```bash
cd backend/crud-players-pucara
node ace db:seed
```

✅ **Verificar que el email es correcto:**

- Debe ser exactamente: `psammartino@pucaragaming.com.ar`
- No usar username, usar el email completo

✅ **Verificar que la contraseña es correcta:**

- Debe ser exactamente: `admin123`
- Es case-sensitive

### Problema 2: "Cannot connect to server"

**Síntomas:**

- Frontend no puede conectarse al backend
- Error de red o CORS

**Soluciones:**

✅ **Verificar que el backend está corriendo:**

```bash
cd backend/crud-players-pucara
npm run dev
```

Deberías ver:

```
Server address: http://localhost:3333
```

✅ **Verificar el puerto correcto:**

- Backend: http://localhost:3333
- Frontend: http://localhost:3000

✅ **Verificar CORS:**
El backend ya tiene CORS configurado en `config/cors.ts`

### Problema 3: "No se recibió token"

**Síntomas:**

- Login parece exitoso pero no redirige
- Error: "No se recibió token"

**Causa:**
El `authProvider` del frontend está buscando el token en el lugar incorrecto.

**Solución:**
El backend devuelve:

```json
{
  "value": "oat_xxx..."
}
```

Pero el frontend busca:

```typescript
data.token.token; // ❌ Incorrecto
```

Debería ser:

```typescript
data.value; // ✅ Correcto
```

Ver la sección [Configuración del Frontend](#configuración-del-frontend) para corregir esto.

### Problema 4: Token expirado

**Síntomas:**

- Después de 7 días, el usuario es deslogueado automáticamente
- Error 401 en requests

**Solución:**

- Hacer login nuevamente
- Los tokens expiran por seguridad

**Para cambiar la duración del token:**

Editar `backend/crud-pucara/app/controllers/auth_controller.ts`:

```typescript
// Cambiar de 7 días a otro valor
const token = await User.accessTokens.create(user, [], {
  expiresIn: "30 days", // o '1 hour', '1 week', etc.
});
```

---

## ⚙️ Configuración del Frontend

### Ubicación

```
frontend/admin-frontend/src/authProvider.ts
```

### Problema Actual

El `authProvider` tiene URLs y formato de respuesta incorrectos:

```typescript
// ❌ URL incorrecta
const res = await fetch(`${AUTH_URL}/login`, { ... })

// ❌ Formato de token incorreto
const token = data?.token?.token
```

### Configuración Correcta

**Archivo: `frontend/admin-frontend/src/authProvider.ts`**

```typescript
import type { AuthProvider } from "react-admin";

const AUTH_URL = "http://localhost:3333/api/v1"; // ✅ Correcto

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
      // ✅ Ruta correcta
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Credenciales inválidas");
    }

    const data = await res.json();
    const token: string | undefined = data?.value; // ✅ Formato correcto

    if (!token) throw new Error("No se recibió token");

    localStorage.setItem("auth", token);
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return Promise.resolve();
  },

  logout: async () => {
    const token = localStorage.getItem("auth");
    try {
      if (token) {
        await fetch(`${AUTH_URL}/auth/logout`, {
          // ✅ Ruta correcta
          method: "DELETE", // ✅ Método correcto
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // tolerante a fallos en logout del backend
    } finally {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
    }
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),

  checkError: (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    // Si en el futuro agregas roles
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve(userData.role || "user");
    }
    return Promise.resolve("user");
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve({
        id: userData.id,
        fullName: userData.fullName,
        avatar: undefined,
      });
    }
    return Promise.resolve({ id: "me", fullName: "Usuario" });
  },
};
```

---

## 📊 Estructura de la Base de Datos

### Tabla: `users`

| Campo        | Tipo     | Descripción                    |
| ------------ | -------- | ------------------------------ |
| `id`         | INTEGER  | ID único del usuario           |
| `full_name`  | VARCHAR  | Nombre completo                |
| `email`      | VARCHAR  | Email (único)                  |
| `password`   | VARCHAR  | Hash de la contraseña (bcrypt) |
| `created_at` | DATETIME | Fecha de creación              |
| `updated_at` | DATETIME | Fecha de actualización         |

### Tabla: `access_tokens`

| Campo          | Tipo     | Descripción                  |
| -------------- | -------- | ---------------------------- |
| `id`           | INTEGER  | ID del token                 |
| `tokenable_id` | INTEGER  | ID del usuario (FK)          |
| `type`         | VARCHAR  | Tipo de token (`auth_token`) |
| `hash`         | VARCHAR  | Hash del token               |
| `expires_at`   | DATETIME | Fecha de expiración          |
| `created_at`   | DATETIME | Fecha de creación            |

---

## 🚀 Comandos Útiles

### Crear nuevo usuario manualmente

```bash
cd backend/crud-pucara
node ace tinker
```

```javascript
const User = await import("#models/user");
await User.default.create({
  fullName: "Nuevo Usuario",
  email: "nuevo@ejemplo.com",
  password: "password123",
});
```

### Listar todos los usuarios

```bash
sqlite3 backend/crud-pucara/database/pucara.sqlite
```

```sql
SELECT id, full_name, email, created_at FROM users;
.exit
```

### Ver tokens activos

```sql
SELECT
  at.id,
  u.email,
  at.expires_at,
  at.created_at
FROM access_tokens at
JOIN users u ON at.tokenable_id = u.id
WHERE at.expires_at > datetime('now');
```

### Limpiar tokens expirados

```sql
DELETE FROM access_tokens
WHERE expires_at < datetime('now');
```

---

## 📚 Referencias

- [AdonisJS Auth Documentation](https://docs.adonisjs.com/guides/authentication)
- [React Admin Auth Provider](https://marmelab.com/react-admin/Authentication.html)
- [JWT Introduction](https://jwt.io/introduction)

---

## ✅ Checklist de Verificación

Antes de reportar un problema de login, verifica:

- [ ] Backend está corriendo en http://localhost:3333
- [ ] Frontend está corriendo en http://localhost:3000
- [ ] Usuario admin fue creado con `node ace db:seed`
- [ ] Estás usando el EMAIL, no un username
- [ ] Email es exactamente: `psammartino@pucaragaming.com.ar`
- [ ] Contraseña es exactamente: `admin123`
- [ ] El `authProvider` tiene las URLs correctas
- [ ] El `authProvider` usa `data.value` para el token
- [ ] La consola del navegador no muestra errores CORS

---

## 🎉 ¡Listo!

Si seguiste esta guía y corregiste el `authProvider`, deberías poder hacer login exitosamente con las credenciales del administrador.

**¿Problemas adicionales?** Revisa los logs del backend y la consola del navegador para más detalles.
