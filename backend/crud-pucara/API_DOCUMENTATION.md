# API Documentation - BackendPucara

## 🔐 Autenticación

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## 👥 Gestión de Usuarios (Solo Admin)

### Listar todos los usuarios

```http
GET /users
Authorization: Bearer {token}
```

### Crear nuevo usuario

```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "password": "password123",
  "role": "editor"
}
```

### Ver usuario específico

```http
GET /users/{id}
Authorization: Bearer {token}
```

### Actualizar usuario

```http
PUT /users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "usuario_actualizado",
  "email": "nuevo@email.com",
  "role": "espectador"
}
```

### Cambiar rol de usuario

```http
PATCH /users/{id}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "editor"
}
```

### Eliminar usuario

```http
DELETE /users/{id}
Authorization: Bearer {token}
```

## 📰 Gestión de Noticias

### Listar todas las noticias (Todos pueden ver)

```http
GET /news
Authorization: Bearer {token}
```

### Ver noticia específica (Todos pueden ver)

```http
GET /news/{id}
Authorization: Bearer {token}
```

### Crear noticia (Admin y Editor)

```http
POST /news
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Nueva noticia",
  "fecha": "2024-01-15",
  "comentario": "Contenido de la noticia"
}
```

### Actualizar noticia

- **Admin**: Puede editar cualquier noticia
- **Editor**: Solo puede editar sus propias noticias

```http
PUT /news/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Título actualizado",
  "comentario": "Comentario actualizado"
}
```

### Eliminar noticia

- **Admin**: Puede eliminar cualquier noticia
- **Editor**: Solo puede eliminar sus propias noticias

```http
DELETE /news/{id}
Authorization: Bearer {token}
```

### Ver mis noticias (Admin y Editor)

```http
GET /my-news
Authorization: Bearer {token}
```

### Ver noticias por usuario (Solo Admin)

```http
GET /users/{userId}/news
Authorization: Bearer {token}
```

## 🔑 Perfil y Sesión

### Obtener perfil

```http
GET /profile
Authorization: Bearer {token}
```

### Cerrar sesión

```http
POST /logout
Authorization: Bearer {token}
```

## 📋 Roles y Permisos

### Admin

- ✅ Crear, editar, eliminar usuarios
- ✅ Cambiar roles de usuarios
- ✅ Crear, editar, eliminar cualquier noticia
- ✅ Ver todas las noticias de todos los usuarios
- ✅ Acceso completo a la API

### Editor

- ✅ Crear, editar, eliminar sus propias noticias
- ✅ Ver todas las noticias
- ✅ Ver sus propias noticias
- ❌ No puede gestionar usuarios
- ❌ No puede editar noticias de otros

### Espectador

- ✅ Ver todas las noticias
- ❌ No puede crear, editar o eliminar noticias
- ❌ No puede gestionar usuarios

## 🚀 Ejemplos de Uso

### 1. Admin crea un editor

```bash
# Login como admin
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Crear editor (usar token del login)
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"username": "editor1", "email": "editor@example.com", "password": "editor123", "role": "editor"}'
```

### 2. Editor crea noticia

```bash
# Login como editor
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email": "editor@example.com", "password": "editor123"}'

# Crear noticia (usar token del login)
curl -X POST http://localhost:3333/news \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Mi primera noticia", "fecha": "2024-01-15", "comentario": "Contenido de prueba"}'
```

### 3. Admin cambia rol de usuario

```bash
# Cambiar rol de editor a espectador
curl -X PATCH http://localhost:3333/users/{USER_ID}/role \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"role": "espectador"}'
```

## 🔒 Seguridad

- Todas las rutas (excepto login) requieren autenticación
- Los roles se verifican en cada endpoint
- Los editores solo pueden modificar sus propias noticias
- Los admin tienen acceso completo
- Las contraseñas se hashean automáticamente
- Los tokens JWT se manejan automáticamente

## 📝 Notas Importantes

1. **Fechas**: Usar formato ISO (YYYY-MM-DD)
2. **IDs**: Los IDs son números enteros
3. **Roles**: Solo se permiten: `admin`, `editor`, `espectador`
4. **Emails**: Deben ser únicos en la base de datos
5. **Tokens**: Incluir en header `Authorization: Bearer {token}`


