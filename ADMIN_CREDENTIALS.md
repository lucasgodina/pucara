# 🔐 Credenciales de Administrador

## Información del Usuario Admin

Cuando ejecutas el comando `node ace db:seed`, se crea automáticamente un usuario administrador con las siguientes credenciales:

### 📧 Credenciales por Defecto

| Campo               | Valor                             |
| ------------------- | --------------------------------- |
| **Nombre completo** | `Administrador`                   |
| **Email**           | `psammartino@pucaragaming.com.ar` |
| **Contraseña**      | `admin123`                        |

---

## 🔧 Cómo Modificar las Credenciales

Si deseas cambiar el email o contraseña por defecto del administrador, debes editar el archivo del seeder:

### Ubicación del archivo:

```
backend/crud-players-pucara/database/seeders/admin_seeder.ts
```

### Ejemplo de modificación:

```typescript
await User.create({
  fullName: 'Tu Nombre', // ← Cambia el nombre
  email: 'tumail@ejemplo.com', // ← Cambia el email
  password: 'TuContraseñaSegura123', // ← Cambia la contraseña
})
```

---

## 🚀 Cómo Ejecutar el Seeder

### Primera vez (crear el usuario):

```bash
node ace db:seed
```

### Si ya existe el usuario:

El seeder verificará automáticamente si el usuario ya existe usando el email. Si existe, no lo volverá a crear y mostrará el mensaje:

```
ℹ️  Usuario Admin ya existe
```

### Para recrear el usuario (si necesitas cambiar las credenciales):

**Opción 1: Eliminar el usuario desde la base de datos**

```bash
# Conectarte a SQLite
sqlite3 database/pucara.sqlite

# Eliminar el usuario
DELETE FROM users WHERE email = 'psammartino@pucaragaming.com.ar';

# Salir
.exit
```

Luego ejecuta nuevamente:

```bash
node ace db:seed
```

**Opción 2: Recrear toda la base de datos (CUIDADO: Elimina todos los datos)**

```bash
# Eliminar todas las tablas
node ace migration:rollback

# Recrear las tablas
node ace migration:run

# Crear el usuario admin
node ace db:seed
```

---

## 🔐 Seguridad - Recomendaciones

### ⚠️ IMPORTANTE para Producción:

1. **Nunca uses credenciales por defecto en producción**
2. **Cambia la contraseña inmediatamente después del primer login**
3. **Usa contraseñas fuertes** (mínimo 12 caracteres, con letras, números y símbolos)
4. **Usa variables de entorno** para las credenciales sensibles

### Ejemplo usando variables de entorno:

#### 1. Agregar al archivo `.env`:

```env
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@tupucaragaming.com
ADMIN_PASSWORD=SuperContraseñaSegura123!
```

#### 2. Actualizar el archivo `start/env.ts`:

```typescript
export default await Env.create(new URL('../', import.meta.url), {
  // ... otras variables
  ADMIN_NAME: Env.schema.string.optional(),
  ADMIN_EMAIL: Env.schema.string.optional(),
  ADMIN_PASSWORD: Env.schema.string.optional(),
})
```

#### 3. Modificar el seeder:

```typescript
import User from '#models/user'
import env from '#start/env'

export default class AdminSeeder {
  public async run() {
    const adminEmail = env.get('ADMIN_EMAIL', 'psammartino@pucaragaming.com.ar')
    const existingUser = await User.findBy('email', adminEmail)

    if (existingUser) {
      console.log('ℹ️  Usuario Admin ya existe')
      return
    }

    await User.create({
      fullName: env.get('ADMIN_NAME', 'Administrador'),
      email: adminEmail,
      password: env.get('ADMIN_PASSWORD', 'admin123'),
    })

    console.log('✅ Usuario Admin creado exitosamente')
  }
}
```

---

## 📝 Login en la API

Para autenticarte con estas credenciales, usa el endpoint de login:

### Endpoint:

```
POST http://localhost:3333/login
```

### Body (JSON):

```json
{
  "email": "psammartino@pucaragaming.com.ar",
  "password": "admin123"
}
```

### Respuesta esperada:

```json
{
  "type": "bearer",
  "value": "oat_xxx...",
  "user": {
    "id": 1,
    "fullName": "Administrador",
    "email": "psammartino@pucaragaming.com.ar",
    "createdAt": "2025-10-19T..."
  }
}
```

---

## 🔄 Cambiar Contraseña después del Login

Aunque actualmente no hay un endpoint específico para cambiar contraseña, puedes agregarlo o cambiarla directamente en la base de datos.

### Cambio manual en SQLite:

```bash
sqlite3 database/pucara.sqlite

# Ver el hash actual
SELECT password FROM users WHERE email = 'psammartino@pucaragaming.com.ar';
```

Para cambiar la contraseña de forma segura, es mejor usar un endpoint de la API o el Tinker de AdonisJS:

```bash
node ace tinker
```

Luego en el REPL:

```javascript
const User = await import('#models/user')
const user = await User.default.findBy('email', 'psammartino@pucaragaming.com.ar')
user.password = 'NuevaContraseñaSegura123!'
await user.save()
```

---

## 📚 Recursos Adicionales

- [Documentación de AdonisJS Auth](https://docs.adonisjs.com/guides/authentication)
- [Guía de Seeders](https://docs.adonisjs.com/guides/database/seeders)
- [Testing de la API](./TESTING_API.md)
- [Documentación de la API](./API_DOCUMENTATION.md)
