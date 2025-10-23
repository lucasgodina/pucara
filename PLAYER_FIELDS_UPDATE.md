# Actualización de Campos de Jugadores

## Resumen

Se han agregado campos estructurados directos a los modelos de **Teams** y **Players** en lugar de depender de un objeto JSON `stats`. Esto mejora la tipificación, validación y facilidad de uso en el panel de administración.

## Cambios Realizados

### 1. Backend - Base de Datos

#### Migraciones Ejecutadas

**Team Fields** (`1761177292349_create_add_landing_fields_to_teams_table.ts`):

- ✅ `slug` (string, unique, nullable)
- ✅ `emoji` (string, default: '🎮')
- ✅ `banner_url` (string, nullable)

**Player Fields** (`1761177500000_add_player_fields.ts`):

- ✅ `age` (integer, nullable)
- ✅ `role` (string, nullable)
- ✅ `country` (string, nullable, default: '🇦🇷 Argentina')
- ✅ `instagram` (string, nullable)

### 2. Backend - Modelos

#### `app/models/team.ts`

```typescript
@column() declare slug: string | null
@column() declare emoji: string | null
@column() declare bannerUrl: string | null
```

#### `app/models/player.ts`

```typescript
@column() declare age: number | null
@column() declare role: string | null
@column() declare country: string | null
@column() declare instagram: string | null
```

### 3. Backend - Validadores

#### `app/validators/player_validator.ts`

- ✅ `createPlayerValidator`: Incluye age, role, country, instagram
- ✅ `updatePlayerValidator`: Incluye age, role, country, instagram

```typescript
age: vine.number().min(0).max(150).optional().nullable(),
role: vine.string().maxLength(100).optional().nullable(),
country: vine.string().maxLength(100).optional().nullable(),
instagram: vine.string().maxLength(100).optional().nullable(),
```

### 4. Backend - Controladores

#### `app/controllers/teams_controller.ts`

- ✅ **store()**: Maneja slug, emoji, banner_url
- ✅ **update()**: Maneja slug, emoji, banner_url

#### `app/controllers/players_controller.ts`

- ✅ **store()**: Incluye age, role, country, instagram con valores por defecto
- ✅ **update()**: Actualizado `request.only()` para incluir nuevos campos
- ✅ **update()**: Actualizado lógica de asignación condicional para nuevos campos

```typescript
// En store()
player.age = data.age || null;
player.role = data.role || null;
player.country = data.country || "🇦🇷 Argentina";
player.instagram = data.instagram || null;

// En update()
if (data.age !== undefined) player.age = data.age;
if (data.role !== undefined) player.role = data.role;
if (data.country !== undefined) player.country = data.country;
if (data.instagram !== undefined) player.instagram = data.instagram;
```

### 5. Admin Frontend

#### `src/dataProvider.ts`

- ✅ **convertToReactAdmin()**: Incluye age, role, country, instagram en mapeo de players
- ✅ **convertFromReactAdmin()**: No requiere cambios (campos se pasan tal cual)

#### `src/teams.tsx`

- ✅ Formularios incluyen campos: slug, emoji, bannerUrl con helper texts

#### `src/players.tsx`

- ✅ **PlayerCreate**: Incluye NumberInput para age, TextInput para role, country, instagram
- ✅ **PlayerEdit**: Incluye los mismos campos con helpers informativos

```tsx
<TextInput source="age" label="Edad" type="number" fullWidth helperText="Edad del jugador" />
<TextInput source="role" label="Rol" fullWidth helperText="Ej: Top, Jungle, Mid, ADC, Support" />
<TextInput source="country" label="País" fullWidth helperText="Ej: 🇦🇷 Argentina, 🇧🇷 Brasil" />
<TextInput source="instagram" label="Instagram" fullWidth helperText="Usuario de Instagram (sin @)" />
```

### 6. Landing Frontend

#### `src/data/players.ts`

- ✅ Interface `ApiPlayer` actualizada con age, role, country, instagram

#### `src/data/teams.ts`

- ✅ Interface `ApiPlayer` actualizada con nuevos campos
- ✅ **mapApiPlayerToUi()**: Lee campos directos en lugar de stats JSON

```typescript
function mapApiPlayerToUi(p: ApiPlayer): Player {
  return {
    nombre: p.name,
    edad: p.age ?? 0,
    nacionalidad: p.country ?? "🇦🇷 Argentina",
    rol: p.role ?? "Jugador",
    instagram: p.instagram ?? "",
    imagen: p.photoUrl || "/players/default.jpg",
  };
}
```

## Estado de Migraciones

```bash
✅ migrated database/migrations/1761177292349_create_add_landing_fields_to_teams_table
✅ migrated database/migrations/1761177500000_add_player_fields
```

## Pruebas Recomendadas

### 1. Backend (Puerto 3333)

```bash
cd backend/crud-pucara
npm run dev
```

**Probar endpoints:**

- POST `/api/v1/players` - Crear jugador con todos los campos
- PATCH `/api/v1/players/:id` - Actualizar campos individuales
- GET `/api/v1/players/:id` - Verificar que devuelve todos los campos

### 2. Admin Frontend (Puerto 3000)

```bash
cd frontend/admin-frontend
npm start
```

**Probar flujo:**

1. Ir a "Players" → "Create"
2. Llenar todos los campos incluyendo edad, rol, país, instagram
3. Guardar y verificar que se crea correctamente
4. Editar jugador y modificar campos
5. Verificar que los cambios persisten

### 3. Landing (Puerto 4321)

```bash
cd frontend/landing
npm run dev
```

**Probar visualización:**

1. Navegar a `/teams`
2. Seleccionar un equipo
3. Verificar que las tarjetas de jugadores muestran:
   - Edad correcta (no "0 años")
   - Rol del jugador
   - Nacionalidad con emoji
   - Link de Instagram

## Ejemplo de Datos

### Crear Jugador en Admin

```json
{
  "name": "Juan Pérez",
  "age": 23,
  "role": "Mid Laner",
  "country": "🇦🇷 Argentina",
  "instagram": "juanperez",
  "teamId": "uuid-del-equipo",
  "bio": "Jugador profesional de League of Legends",
  "photoUrl": "https://example.com/foto.jpg"
}
```

### Respuesta del Backend

```json
{
  "success": true,
  "message": "Jugador creado exitosamente",
  "data": {
    "playerId": "uuid-generado",
    "name": "Juan Pérez",
    "age": 23,
    "role": "Mid Laner",
    "country": "🇦🇷 Argentina",
    "instagram": "juanperez",
    "teamId": "uuid-del-equipo",
    "bio": "Jugador profesional de League of Legends",
    "stats": null,
    "photoUrl": "https://example.com/foto.jpg",
    "createdAt": "2024-01-22T12:00:00.000Z",
    "updatedAt": "2024-01-22T12:00:00.000Z"
  }
}
```

### Visualización en Landing

Las tarjetas de jugadores ahora mostrarán:

- **Edad**: 23 años (en lugar de "0 años")
- **Rol**: Mid Laner (en lugar de "Jugador")
- **Nacionalidad**: 🇦🇷 Argentina
- **Instagram**: @juanperez

## Notas Importantes

1. **Campos `stats` todavía existe**: Se mantiene para compatibilidad backward, pero ya no es necesario para edad, rol, país e instagram.

2. **Valores por defecto**:

   - `country`: '🇦🇷 Argentina' (al crear)
   - `emoji` (teams): '🎮'
   - Los demás campos nullable pueden quedar en `null`

3. **Validación**:

   - `age`: 0-150 años
   - `role`, `country`, `instagram`: Máximo 100 caracteres

4. **Migración de datos existentes**: Si hay jugadores con datos en `stats` JSON, se pueden migrar ejecutando un script que copie los valores a los nuevos campos.

## Comandos Útiles

```bash
# Correr todos los servidores desde la raíz
npm run dev:all

# Solo backend
npm run dev:api

# Solo admin
npm run dev:admin

# Solo landing
npm run dev:landing

# Ejecutar migraciones
cd backend/crud-pucara
node ace migration:run

# Rollback última migración
node ace migration:rollback

# Ver estado de migraciones
node ace migration:status
```

## Próximos Pasos (Opcional)

1. **Migración de datos**: Script para copiar datos de `stats` JSON a nuevos campos
2. **Deprecar stats**: Una vez migrados todos los datos, considerar remover `stats` del frontend
3. **Agregar más campos**: Considerar campos adicionales como:
   - `twitchUrl`
   - `twitterUrl`
   - `championPool` (para LOL)
   - `rank` o `tier`
4. **Validación de URLs de Instagram**: Agregar validación para formato de usuario
5. **Imágenes por defecto**: Sistema de avatares generados si no hay `photoUrl`
