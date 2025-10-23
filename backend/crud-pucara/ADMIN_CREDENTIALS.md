# 🔐 Credenciales de Administrador

## ⚠️ IMPORTANTE - Seguridad

Las credenciales de administrador se configuran mediante **variables de entorno** para mayor seguridad.

---

## 🚀 Configuración Inicial (Desarrollo)

### 1. Configurar variables de entorno

Editá el archivo `.env` y configurá las credenciales:
```env
ADMIN_NAME=Tu Nombre
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=tu_password_seguro_aqui
```

### 2. Ejecutar el seeder
```bash
node ace db:seed
```

Esto creará automáticamente el usuario admin con las credenciales configuradas en `.env`.

---

## 🔑 Credenciales por Defecto (si no configuraste el .env)

Si no configuraste las variables de entorno, se usarán estos valores por defecto:

- **Email:** `admin@pucara.local`
- **Password:** `admin123`

⚠️ **Estos valores son solo para desarrollo local. NUNCA uses credenciales por defecto en producción.**

---

## 🔒 Recomendaciones de Seguridad

### Para Desarrollo:
1. ✅ Usa credenciales diferentes a las de producción
2. ✅ No compartas tu archivo `.env` (está en `.gitignore`)
3. ✅ Usa passwords de al menos 8 caracteres

### Para Producción:
1. 🔴 **OBLIGATORIO:** Cambia todas las credenciales por defecto
2. 🔴 **OBLIGATORIO:** Usa passwords fuertes (mínimo 16 caracteres)
3. 🔴 **OBLIGATORIO:** Usa emails reales y seguros
4. 🔴 Considera usar autenticación de dos factores (2FA)
5. 🔴 Usa variables de entorno del servidor (no el archivo `.env`)

### Ejemplo de password seguro:
```
# Malo (NUNCA uses esto)
admin123

# Bueno
P@ssw0rd!2024$Pucara

# Mejor
K8x#mQ2$vL9@pN4&wR7^eT1!zY6
```

---

## 🔄 Cómo Recrear el Usuario Admin

Si necesitas cambiar las credenciales:

### Opción 1: Eliminar y recrear (Desarrollo)
```bash
# 1. Eliminar base de datos completa
node ace migration:rollback

# 2. Recrear tablas
node ace migration:run

# 3. Editar .env con nuevas credenciales

# 4. Crear usuario admin
node ace db:seed
```

### Opción 2: Cambiar password con Tinker
```bash
node ace tinker
```

Luego ejecutá:
```javascript
const User = (await import('#models/user')).default
const user = await User.findBy('email', 'tu-email@ejemplo.com')
user.password = 'nueva_password_segura'
await user.save()
console.log('✅ Password actualizado')
```

Salir con `.exit`

---

## 📚 Más Información

- Las credenciales se configuran en: `backend-crud-pucara/.env`
- El seeder está en: `database/seeders/admin_seeder.ts`
- Nunca subas el archivo `.env` a git (ya está en `.gitignore`)

---

## ❓ Troubleshooting

**Error: "Usuario Admin ya existe"**
- El seeder detectó que ya hay un usuario con ese email
- Si querés recrearlo, eliminá el usuario existente primero

**No puedo hacer login**
- Verificá que el servidor backend esté corriendo (`node ace serve --watch`)
- Verificá que las credenciales en `.env` coincidan con las que estás usando
- Revisá los logs del servidor para ver errores

**Olvidé mi password**
- Usá la Opción 2 (Tinker) para cambiarla
- O eliminá la base de datos y recreala (perderás todos los datos)

## 📚 Recursos Adicionales

- [Documentación de AdonisJS Auth](https://docs.adonisjs.com/guides/authentication)
- [Guía de Seeders](https://docs.adonisjs.com/guides/database/seeders)
- [Testing de la API](./TESTING_API.md)
- [Documentación de la API](./API_DOCUMENTATION.md)
