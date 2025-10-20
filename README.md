# Pucará Monorepo

Estructura reorganizada en dos capas principales:

```
frontend/
  admin-frontend/   # Panel de administración (CRUD)

backend/
  crud-pucara/  # API AdonisJS (equipos, jugadores, usuarios, noticias)
```

## Cómo levantar cada parte

1. Backend API (AdonisJS)

```powershell
cd .\backend\crud-pucara
npm install
node ace migration:run
node ace serve --watch
```

Verifica salud:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3333/"
Invoke-RestMethod -Method GET -Uri "http://localhost:3333/api/v1/teams"
Invoke-RestMethod -Method GET -Uri "http://localhost:3333/api/v1/players"
```

2. Admin Frontend (React Admin)

```powershell
cd .\frontend\admin-frontend
npm install
npm start
```

El admin usa la API en `http://localhost:3333/api/v1` (CORS habilitado). El CRUD se hace exclusivamente desde este panel.

## Scripts desde la carpeta raíz

Puedes manejar todo desde la raíz con npm scripts:

```powershell
# Instalar dependencias de backend y admin
npm run install:all

# Levantar solo la API
npm run dev:api

# Levantar solo el admin
npm run dev:admin

# Levantar ambos (API y admin) en paralelo
npm run dev:all
```

Builds:

```powershell
npm run build:api
npm run build:admin
```

### Notas de troubleshooting

- Si al levantar el admin aparece "JavaScript heap out of memory", usamos el flag de memoria en `dev:admin` (NODE_OPTIONS=--max-old-space-size=4096). También podés probar versiones LTS de Node (por ejemplo 20.x) si el problema persiste.

## ¿La conexión sigue funcionando?

Sí. La API no cambió de URL. Solo se movió el código al subdirectorio `backend/crud-pucara`. Mientras levantes el backend desde ese path y el admin desde su carpeta, todo sigue operando igual:

- API: http://localhost:3333/api/v1
- Admin: http://localhost:3000

Si querés consumir solo lectura desde otro frontend (por ejemplo Astro), usá exclusivamente GET de la API. Las guías específicas quedaron dentro del backend:

- `backend/crud-pucara/docs/guia-integracion-frontend.md`
- `backend/crud-pucara/docs/guia-consumo-astro.md`
