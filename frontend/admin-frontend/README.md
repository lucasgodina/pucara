# Admin Panel - Pucará Esports

Panel de administración CRUD construido con **React Admin** para gestionar equipos, jugadores, noticias y usuarios de la plataforma Pucará.

---

## 🎯 Descripción

Interfaz de administración completa que consume la API REST de AdonisJS. Proporciona gestión visual de todos los recursos mediante componentes Material-UI.

**Recursos gestionados:**
- **Equipos** (Teams) - CRUD completo con imágenes
- **Jugadores** (Players) - Gestión de roster con asignación de equipos
- **Noticias** (News) - Sistema de contenido con editor
- **Usuarios** (Users) - Administración de cuentas (solo admin)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 19.1.0 | Librería UI principal |
| **React Admin** | 5.9.1 | Framework para interfaces admin |
| **Material-UI** | 7.2.0 | Componentes y sistema de diseño |
| **TypeScript** | 4.9.5 | Type safety |
| **Create React App** | 5.0.1 | Build tooling |
| **react-app-rewired** | 2.2.1 | Custom webpack config |

---

## 📁 Estructura

```
src/
├── App.tsx              # Configuración principal de React Admin
├── authProvider.ts      # Lógica de autenticación (login, logout, permisos)
├── dataProvider.ts      # Conexión con API REST (ra-data-json-server)
├── CustomLayout.tsx     # Layout con sidebar y AppBar
├── Dashboard.tsx        # Página principal con estadísticas
├── ThemeContext.tsx     # Context para tema claro/oscuro
├── players.tsx          # Componentes CRUD de jugadores
├── teams.tsx            # Componentes CRUD de equipos
├── news.tsx             # Componentes CRUD de noticias
└── users.tsx            # Componentes CRUD de usuarios (admin)

public/
├── index.html           # HTML base
└── manifest.json        # PWA manifest

config-overrides.js      # Configuración webpack custom
```

---

## 🔐 Autenticación

**Sistema**: Bearer Token (Access Token de AdonisJS)  
**Storage**: localStorage (`auth` key con token y user data)  
**Flujo**:
1. Login en `/login` → envía credenciales a `/api/v1/auth/login`
2. Token guardado en localStorage
3. Requests incluyen header: `Authorization: Bearer {token}`
4. Logout revoca token en backend y limpia localStorage

**Roles**:
- `admin` - Acceso completo a todos los recursos
- `editor` - Gestión de contenido (equipos, jugadores, noticias)
- `user` - Solo lectura

---

## 📦 Instalación Rápida

> ⚠️ **Nota**: Este proyecto es parte de un monorepo. Se recomienda instalar desde la raíz.

### Desde la raíz del monorepo (recomendado):
```bash
npm run install:all
```

### Desde este directorio:
```bash
npm install
```

---

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
npm start
```

**URL**: http://localhost:3000

### Credenciales de prueba
- **Email**: admin@pucara.com
- **Password**: admin123

### Comandos disponibles
```bash
npm start          # Dev server con hot reload
npm run build      # Build para producción
npm test           # Ejecutar tests
npm run eject      # Exponer configuración CRA (no recomendado)
```

---

## 🎨 Características

### Funcionalidades principales
- ✅ **DataGrid avanzado** con paginación, filtros y ordenamiento
- ✅ **Formularios inteligentes** con validación client-side
- ✅ **Upload de imágenes** con preview en tiempo real
- ✅ **Theme switcher** (modo claro/oscuro)
- ✅ **Dashboard** con métricas y estadísticas
- ✅ **Sidebar responsive** con navegación por recursos
- ✅ **Gestión de relaciones** (jugador ↔ equipo)
- ✅ **Control de permisos** basado en roles

### Componentes React Admin usados
- `<List>` - Listas con DataGrid de Material-UI
- `<Edit>` - Formularios de edición
- `<Create>` - Formularios de creación
- `<Show>` - Vista detallada de recursos
- `<SimpleForm>` - Formularios simples
- `<ReferenceField>` - Mostrar relaciones
- `<ReferenceInput>` - Selects para relaciones

---

## 🔌 Conexión con Backend

**Base URL**: Configurada en `src/dataProvider.ts`

```typescript
const apiUrl = 'http://localhost:3333/api/v1';
```

**Mapeo de recursos**:
- `/teams` → Equipos
- `/players` → Jugadores
- `/news` → Noticias
- `/users` → Usuarios

**Data Provider**: `ra-data-json-server` adaptado para la API de AdonisJS

---

## 📝 Variables de Entorno

```env
# .env
REACT_APP_API_URL=http://localhost:3333/api/v1
REACT_APP_API_BASE=http://localhost:3333

# .env.production
REACT_APP_API_URL=https://tu-api.com/api/v1
REACT_APP_API_BASE=https://tu-api.com
```

---

## 🚀 Deployment

### Build para producción
```bash
npm run build
```

Genera carpeta `build/` con archivos estáticos optimizados.

### Plataformas recomendadas
- **Vercel** (recomendado) - Deploy automático desde GitHub
- **Netlify** - Alternativa con tier gratuito
- **GitHub Pages** - Para proyectos públicos

Ver guía completa en: `../../DEPLOY_GUIDE_HEROKU.md` o `../../DEPLOY_GUIDE_MVP.md`

---

## 🎨 Personalización

### Cambiar tema
Editar `src/ThemeContext.tsx` para modificar colores, tipografía, etc.

### Añadir nuevo recurso
1. Crear archivo en `src/` (ej: `sponsors.tsx`)
2. Definir componentes `<List>`, `<Edit>`, `<Create>`
3. Registrar en `src/App.tsx`:
```tsx
<Resource name="sponsors" list={SponsorList} edit={SponsorEdit} create={SponsorCreate} />
```

---

## 📘 Documentación Adicional

- **React Admin**: https://marmelab.com/react-admin/
- **Material-UI**: https://mui.com/
- **Guías del monorepo**: Ver archivos `.md` en la raíz del proyecto
