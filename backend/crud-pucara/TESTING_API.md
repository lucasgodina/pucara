# 🧪 Testing API - BackendPucara

## 📋 Pasos para Probar la API

### 1. Preparar el entorno

```bash
# Instalar dependencias
npm install

# Configurar base de datos
node ace migration:run

# Crear usuario admin
node ace db:seed

# Iniciar servidor
node ace serve --watch
```

### 2. Probar Login del Admin

```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "@pucaragaming.com.ar",
    "password": "admin123"
  }'
```

**Respuesta esperada:**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "@pucaragaming.com.ar",
    "role": "admin"
  }
}
```

### 3. Crear Usuario Editor (como Admin)

```bash
# Usar el token del paso anterior
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "editor1",
    "email": "editor@example.com",
    "password": "editor123",
    "role": "editor"
  }'
```

### 4. Crear Usuario Espectador (como Admin)

```bash
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "espectador1",
    "email": "espectador@example.com",
    "password": "espectador123",
    "role": "espectador"
  }'
```

### 5. Listar Todos los Usuarios (como Admin)

```bash
curl -X GET http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN_ADMIN}"
```

### 6. Login como Editor

```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "editor@example.com",
    "password": "editor123"
  }'
```

### 7. Crear Noticia (como Editor)

```bash
curl -X POST http://localhost:3333/news \
  -H "Authorization: Bearer {TOKEN_EDITOR}" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Primera noticia del editor",
    "fecha": "2024-01-15",
    "comentario": "Esta es mi primera noticia como editor"
  }'
```

### 8. Ver Todas las Noticias

```bash
curl -X GET http://localhost:3333/news \
  -H "Authorization: Bearer {TOKEN_EDITOR}"
```

### 9. Ver Mis Noticias (como Editor)

```bash
curl -X GET http://localhost:3333/my-news \
  -H "Authorization: Bearer {TOKEN_EDITOR}"
```

### 10. Cambiar Rol de Usuario (como Admin)

```bash
curl -X PATCH http://localhost:3333/users/{EDITOR_ID}/role \
  -H "Authorization: Bearer {TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{"role": "espectador"}'
```

### 11. Probar Permisos (Editor no puede crear noticias después del cambio)

```bash
# Intentar crear noticia como ex-editor (ahora espectador)
curl -X POST http://localhost:3333/news \
  -H "Authorization: Bearer {TOKEN_EDITOR}" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Noticia que no debería poder crear",
    "fecha": "2024-01-15",
    "comentario": "Esta noticia no se debería crear"
  }'
```

**Respuesta esperada:**

```json
{
  "message": "No tienes permisos para crear noticias"
}
```

## 🔍 Verificaciones Importantes

### ✅ **Lo que debe funcionar:**

1. Admin puede crear usuarios con cualquier rol
2. Admin puede cambiar roles de usuarios
3. Admin puede ver todas las noticias de todos los usuarios
4. Editor puede crear/editar/eliminar solo sus noticias
5. Espectador solo puede ver noticias
6. Los permisos se respetan correctamente

### ❌ **Lo que NO debe funcionar:**

1. Editor no puede crear usuarios
2. Editor no puede editar noticias de otros
3. Espectador no puede crear/editar/eliminar noticias
4. Usuarios no autenticados no pueden acceder a rutas protegidas

## 🚨 Casos de Error a Probar

### 1. Token inválido

```bash
curl -X GET http://localhost:3333/users \
  -H "Authorization: Bearer token_invalido"
```

### 2. Sin token

```bash
curl -X GET http://localhost:3333/users
```

### 3. Rol insuficiente

```bash
# Editor intenta acceder a ruta de admin
curl -X GET http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN_EDITOR}"
```

### 4. Email duplicado

```bash
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer {TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "duplicado",
    "email": "@pucaragaming.com.ar",
    "password": "password123",
    "role": "editor"
  }'
```

## 📊 Verificación de Base de Datos

### Verificar usuarios creados:

```sql
SELECT id, username, email, role, created_at FROM users;
```

### Verificar noticias creadas:

```sql
SELECT n.id, n.titulo, n.fecha, n.comentario, u.username, u.role
FROM news n
JOIN users u ON n.user_id = u.id;
```

### Verificar tokens activos:

```sql
SELECT * FROM access_tokens;
```

## 🎯 Resultado Esperado

Al final de todas las pruebas, deberías tener:

- 1 usuario admin
- 1 usuario editor (o espectador si cambiaste el rol)
- 1 usuario espectador
- Al menos 1 noticia creada por el editor
- Sistema de permisos funcionando correctamente
- Todas las rutas protegidas funcionando según el rol
