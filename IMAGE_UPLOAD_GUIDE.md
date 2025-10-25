# Guía de Implementación: Subida de Imágenes en Pucará

Sistema **progresivo y flexible** para manejo de imágenes (banners de equipos y fotos de jugadores) que permite cambiar entre proveedores usando una variable de entorno.

---

## 📋 Contexto Actual

**Estado actual:**

- Teams: Campo `banner_url` (String) - Actualmente URL externa
- Players: Campo `photo_url` (String) - Actualmente URL externa

**Formatos:** PNG, JPG, JPEG, WebP  
**Tamaño máximo:** 10MB

**Casos de uso:**

- Subir banner de equipo (1 imagen por equipo)
- Subir foto de jugador (1 imagen por jugador)

---

## 🎯 Las 3 Opciones (Prioridad: Local > Cloudinary >> AWS)

### Opción 1: Local Simple ⭐ (PRIORIDAD ALTA - OBLIGATORIO)

**Nivel:** 🔵 Básico  
**Tiempo:** 1-2 horas  
**Costo:** $0  
**Estado:** **IMPLEMENTACIÓN OBLIGATORIA**

#### Características

- Imágenes en `public/uploads/`
- Sin dependencias externas
- Perfecto para desarrollo y MVP

#### Pros ✅

- Setup rapidísimo
- Sin costos
- Control total
- No requiere internet

#### Contras ❌

- No escala bien
- Sin CDN
- Sin backup automático

---

### Opción 2: Cloudinary ⭐⭐⭐ (PRIORIDAD MEDIA-ALTA - MUY RECOMENDADO)

**Nivel:** 🟡 Intermedio  
**Tiempo:** 2-3 horas  
**Costo:** $0 (Free tier: 25GB storage + bandwidth/mes)  
**Estado:** **MUY DESEABLE PARA PRODUCCIÓN**

#### Características

- Servicio cloud especializado
- CDN global automático
- Optimización on-the-fly
- Dashboard de gestión

#### Pros ✅

- CDN global (carga rápida mundial)
- Transformaciones vía URL
- No consume espacio del servidor
- Free tier generoso
- Backups automáticos

#### Contras ❌

- Dependencia externa
- Límites en free tier

---

### Opción 3: AWS S3 ⭐⭐⭐⭐ (PRIORIDAD BAJA - PROBABLEMENTE NO SE IMPLEMENTE)

**Nivel:** 🔴 Avanzado  
**Tiempo:** 4-6 horas  
**Costo:** $$  
**Estado:** **OPCIONAL - SOLO SI SOBRA TIEMPO**

#### Pros ✅

- Escalabilidad infinita
- Estándar empresarial

#### Contras ❌

- Configuración muy compleja
- Overkill para el proyecto
- Curva de aprendizaje alta

---

## 📊 Comparación Rápida

| Criterio          | Local Simple | Cloudinary        | AWS S3        |
| ----------------- | ------------ | ----------------- | ------------- |
| **Setup**         | 🟢 1-2h      | 🟡 2-3h           | 🔴 4-6h       |
| **Costo**         | $0           | $0 (free tier)    | $$            |
| **CDN**           | ❌           | ✅ Global         | ✅ CloudFront |
| **Escalabilidad** | ⭐           | ⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐    |
| **Optimización**  | ❌           | ✅ Auto           | ⚠️ Manual     |
| **Prioridad**     | **ALTA** ✅  | **MEDIA-ALTA** ✅ | **BAJA** ⚠️   |

---

## 🏗️ Arquitectura: Sistema Flexible

### Concepto Clave

Sistema con **capa de abstracción** que permite cambiar el proveedor mediante variable de entorno (`STORAGE_PROVIDER`), sin tocar código de controladores.

### Estructura de Carpetas

```
app/
  services/
    image_storage_service.ts      ← Interfaz unificada (Factory)
  providers/
    local_storage_provider.ts     ← Implementación Local
    cloudinary_provider.ts        ← Implementación Cloudinary
    s3_provider.ts                ← Implementación AWS S3 (opcional)
  controllers/
    teams_controller.ts           ← Usa el servicio (no conoce provider)
    players_controller.ts         ← Usa el servicio (no conoce provider)
```

### Flujo de Funcionamiento

1. Controlador llama: `ImageStorageService.uploadImage(file, 'teams')`
2. Servicio lee `STORAGE_PROVIDER` del `.env`
3. Delega al provider correcto (Local/Cloudinary/S3)
4. Retorna URL de la imagen
5. Controlador guarda URL en DB

**✨ Ventaja:** Cambiar de Local a Cloudinary = actualizar `.env` + reiniciar. Sin tocar código.

---

## 💻 Implementación Paso a Paso

### ⚙️ FASE 0: Preparación Común (OBLIGATORIO - 30 minutos)

#### Paso 1: Configurar bodyparser para recibir archivos

**Archivo:** `config/bodyparser.ts`

**Qué hacer:**

- Editar sección `multipart`
- Habilitar `autoProcess: true`
- Configurar `limit: '10mb'`
- Agregar `types: ['multipart/form-data']`
- Configurar `tmpFileName()` para archivos temporales

#### Paso 2: Configurar variables de entorno

**Archivo:** `.env`

**Agregar:**

- `STORAGE_PROVIDER=local` (opciones: 'local', 'cloudinary', 's3')
- Variables de Cloudinary (CLOUD_NAME, API_KEY, API_SECRET) - dejar vacías por ahora
- Variables de AWS (REGION, BUCKET_NAME, ACCESS_KEY, SECRET_KEY) - dejar vacías por ahora

**Archivo:** `start/env.ts`

**Agregar validaciones:**

- `STORAGE_PROVIDER` como enum con valores permitidos
- Variables de Cloudinary como opcionales
- Variables de AWS como opcionales

---

### 🏠 FASE 1: Implementar Local Storage (PRIORIDAD ALTA - 1-2 horas)

#### Paso 1: Crear provider local

**Archivo:** `app/providers/local_storage_provider.ts`

**Crear clase `LocalStorageProvider` con:**

- Constantes: `ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']`
- Constante: `MAX_SIZE = 10 * 1024 * 1024` (10MB)
- Método `uploadImage(file, folder)`:
  - Validar extensión permitida
  - Validar tamaño máximo
  - Generar nombre único con `cuid()`
  - Crear carpeta si no existe (`public/uploads/{folder}/`)
  - Mover archivo a carpeta
  - Retornar objeto con `url` (ruta relativa: `/uploads/{folder}/{nombre}`)
- Método `deleteImage(imageUrl)`:
  - Extraer path del URL
  - Eliminar archivo con `fs.unlink()`
  - No lanzar error si no existe (catch silencioso)

#### Paso 2: Crear carpetas públicas

**PowerShell:**

- `cd backend/crud-pucara`
- Crear `public/uploads/teams` (con `-Force`)
- Crear `public/uploads/players` (con `-Force`)
- Crear `.gitkeep` en ambas carpetas

#### Paso 3: Actualizar .gitignore

**Archivo:** `.gitignore`

**Agregar:**

- `public/uploads/**/*` (ignorar todo el contenido)
- `!public/uploads/**/.gitkeep` (mantener `.gitkeep`)

---

### ☁️ FASE 2: Implementar Cloudinary (PRIORIDAD MEDIA-ALTA - 2-3 horas)

#### Paso 1: Instalar SDK

**Terminal:**

- `npm install cloudinary`

#### Paso 2: Configurar Cloudinary

**Archivo:** `config/cloudinary.ts`

**Crear configuración:**

- Importar `v2 as cloudinary` de 'cloudinary'
- Verificar si `STORAGE_PROVIDER === 'cloudinary'`
- Si es así, configurar con `cloudinary.config()` usando variables de entorno
- Exportar `cloudinary` como default

#### Paso 3: Crear provider Cloudinary

**Archivo:** `app/providers/cloudinary_provider.ts`

**Crear clase `CloudinaryProvider` con:**

- Mismas constantes que LocalStorageProvider
- Método `uploadImage(file, folder)`:
  - Validar extensión y tamaño (igual que Local)
  - Subir con `cloudinary.uploader.upload()`
  - Configurar folder: `pucara/{folder}`
  - Agregar transformaciones: límite 1920px, calidad auto, formato auto
  - Retornar objeto con `url` y `publicId`
- Método `deleteImage(imageUrl, publicId?)`:
  - Si hay `publicId`, usarlo directamente
  - Si no, extraer public_id del URL con regex
  - Eliminar con `cloudinary.uploader.destroy()`
- Método extra `getTransformedUrl(url, options)`:
  - Generar URL con transformaciones (width, height, crop)
  - Insertar parámetros en formato Cloudinary

#### Paso 4: Configurar credenciales

**Pasos en Cloudinary:**

1. Ir a https://cloudinary.com/
2. Crear cuenta gratuita (usar email corporativo)
3. Ir al Dashboard
4. Copiar Cloud Name, API Key y API Secret
5. Agregar a `.env` del proyecto

**Variables en `.env`:**

- `STORAGE_PROVIDER=cloudinary`
- `CLOUDINARY_CLOUD_NAME=tu_valor`
- `CLOUDINARY_API_KEY=tu_valor`
- `CLOUDINARY_API_SECRET=tu_valor`

---

### 🏭 FASE 3: Implementar AWS S3 (PRIORIDAD BAJA - 4-6 horas - OPCIONAL)

**NOTA:** Esta implementación es opcional y probablemente no se realice por tiempo.

#### Paso 1: Instalar SDK

**Terminal:**

- `npm install @aws-sdk/client-s3`

#### Paso 2: Configurar S3

**Archivo:** `config/aws.ts`

**Crear:**

- Variable `s3Client` inicializada en null
- Si `STORAGE_PROVIDER === 's3'`, crear instancia de `S3Client` con credentials
- Exportar objeto `AWS_CONFIG` con bucket, region, cloudFrontUrl
- Exportar `s3Client`

#### Paso 3: Crear provider S3

**Archivo:** `app/providers/s3_provider.ts`

**Crear clase `S3Provider` con:**

- Mismas constantes
- Método `uploadImage(file, folder)`:
  - Validar cliente S3 configurado
  - Validar extensión y tamaño
  - Generar key único: `{folder}/{cuid()}.{ext}`
  - Leer archivo como buffer
  - Subir con `PutObjectCommand`
  - Retornar URL (CloudFront si configurado, sino S3 directo)
- Método `deleteImage(imageUrl)`:
  - Extraer key del URL (considerar CloudFront vs S3)
  - Eliminar con `DeleteObjectCommand`

#### Paso 4: Configurar AWS

**Pasos en AWS:**

1. Crear cuenta AWS
2. Crear bucket S3 (ej: `pucara-uploads`)
3. Configurar permisos (público para lectura, privado para escritura)
4. Crear usuario IAM con política de acceso al bucket
5. Generar Access Key y Secret Access Key
6. (Opcional) Configurar CloudFront para CDN

**Variables en `.env`:**

- `STORAGE_PROVIDER=s3`
- `AWS_REGION=us-east-1`
- `AWS_BUCKET_NAME=pucara-uploads`
- `AWS_ACCESS_KEY_ID=tu_key`
- `AWS_SECRET_ACCESS_KEY=tu_secret`
- `AWS_CLOUDFRONT_URL=https://...` (opcional)

---

### 🔌 FASE 4: Servicio Unificado (CORE - 30 minutos)

#### Crear servicio con patrón Factory

**Archivo:** `app/services/image_storage_service.ts`

**Crear clase `ImageStorageService`:**

**Constructor:**

- Leer `STORAGE_PROVIDER` del env
- Usar `switch` para instanciar provider correcto:
  - `'cloudinary'` → `new CloudinaryProvider()`
  - `'s3'` → `new S3Provider()`
  - `'local'` (default) → `new LocalStorageProvider()`
- Guardar en `this.provider`
- Hacer `console.log()` indicando provider activo

**Método `uploadImage(file, folder)`:**

- Delegar a `this.provider.uploadImage(file, folder)`
- Retornar resultado

**Método `deleteImage(imageUrl, publicId?)`:**

- Delegar a `this.provider.deleteImage(imageUrl, publicId)`
- Retornar resultado

**Método `getProviderName()`:**

- Retornar valor de `STORAGE_PROVIDER`

**Exportar:**

- `export default new ImageStorageService()` (singleton)

---

### 🎮 FASE 5: Actualizar Controladores (1 hora)

#### Teams Controller

**Archivo:** `app/controllers/teams_controller.ts`

**Importar:**

- `imageStorageService from '#services/image_storage_service'`

**Método `store()`:**

- Validar payload con validator
- Obtener archivo: `const banner = request.file('banner')`
- Si hay banner:
  - Subir: `const result = await imageStorageService.uploadImage(banner, 'teams')`
  - Guardar URL: `bannerUrl = result.url`
- Crear team con `bannerUrl`
- Retornar respuesta created

**Método `update()`:**

- Buscar team existente
- Validar payload
- Obtener archivo banner
- Si hay banner:
  - Eliminar anterior si existe: `await imageStorageService.deleteImage(team.bannerUrl)`
  - Subir nuevo: `const result = await imageStorageService.uploadImage(banner, 'teams')`
  - Actualizar: `team.bannerUrl = result.url`
- Hacer merge con payload
- Guardar y retornar

**Método `destroy()`:**

- Buscar team
- Si tiene banner: `await imageStorageService.deleteImage(team.bannerUrl)`
- Eliminar team
- Retornar noContent

#### Players Controller

**Archivo:** `app/controllers/players_controller.ts`

**Hacer exactamente lo mismo que Teams pero:**

- Usar `request.file('photo')` en vez de `banner`
- Usar campo `photoUrl` en vez de `bannerUrl`
- Usar folder `'players'` en vez de `'teams'`

---

### 🎨 FASE 6: Frontend React Admin (1 hora)

#### Actualizar componentes de Teams

**Archivo:** `src/teams.tsx`

**En formulario de edición/creación:**

- Importar `ImageInput` y `ImageField` de react-admin
- Agregar campo `ImageInput`:
  - `source="banner"`
  - `label="Banner del Equipo"`
  - `accept="image/*"`
  - `maxSize={10000000}` (10MB)
- Dentro de ImageInput, agregar `<ImageField source="src" title="title" />`
- Agregar campo separado para mostrar imagen actual:
  - `<ImageField source="bannerUrl" label="Banner Actual" />`

#### Actualizar componentes de Players

**Archivo:** `src/players.tsx`

**Hacer lo mismo pero:**

- Usar `source="photo"` y `source="photoUrl"`
- Label: "Foto del Jugador"

#### Actualizar dataProvider

**Archivo:** `src/dataProvider.ts`

**Crear función `convertFileToFormData(data)`:**

- Crear `new FormData()`
- Iterar sobre keys del data
- Si el valor tiene `rawFile instanceof File`:
  - Agregar el archivo: `formData.append(key, data[key].rawFile)`
- Si no:
  - Agregar como JSON string: `formData.append(key, JSON.stringify(data[key]))`
- Retornar formData

**Actualizar métodos `create` y `update`:**

- Verificar si hay archivo (banner o photo) en `params.data`
- Si hay archivo:
  - Convertir a FormData
  - Hacer fetch con body: formData
  - **NO enviar header Content-Type** (el navegador lo setea automático)
- Si no hay archivo:
  - Usar JSON normal como siempre

---

## 🎯 Roadmap de Implementación Recomendado

### Sprint 1: MVP Local (1-2 días) - OBLIGATORIO ✅

**Día 1:**

- [ ] Fase 0: Preparación común (bodyparser, env vars)
- [ ] Fase 1: Local Storage Provider
- [ ] Fase 4: Servicio unificado
- [ ] Fase 5: Actualizar controladores Teams y Players

**Día 2:**

- [ ] Fase 6: Frontend React Admin
- [ ] Testing básico
- [ ] Documentar endpoints en `API_DOCUMENTATION.md`

**Resultado:** Sistema funcional con almacenamiento local.

---

### Sprint 2: Cloudinary Producción (2-3 días) - MUY DESEABLE ✅

**Día 1:**

- [ ] Crear cuenta Cloudinary
- [ ] Fase 2: Implementar CloudinaryProvider
- [ ] Configurar credenciales

**Día 2:**

- [ ] Crear comando de migración
- [ ] Testear migración en desarrollo
- [ ] Migrar imágenes existentes

**Día 3:**

- [ ] Cambiar `STORAGE_PROVIDER=cloudinary`
- [ ] Testing exhaustivo en staging
- [ ] Deploy a producción
- [ ] Monitorear uso en Cloudinary Dashboard

**Resultado:** Sistema escalable con CDN global.

---

### Sprint 3: AWS S3 (1 semana) - OPCIONAL ⚠️

**NOTA:** Probablemente no se implemente por falta de tiempo.

**Solo hacer si:**

- ✅ Local y Cloudinary funcionan perfecto
- ✅ Sobra tiempo de desarrollo
- ✅ Hay necesidad específica de AWS

**Pasos:**

- [ ] Configurar cuenta AWS
- [ ] Crear bucket S3
- [ ] Configurar CloudFront
- [ ] Fase 3: Implementar S3Provider
- [ ] Testing exhaustivo
- [ ] Migración (si aplica)

**Resultado:** Infraestructura enterprise-grade.

---

## 📊 Estimación de Costos

### Escenario: Proyecto Pucará (estimación realista)

**Datos esperados:**

- 50 equipos × 1 banner = 50 imágenes
- 500 jugadores × 1 foto = 500 imágenes
- Total: **550 imágenes** (~250MB storage)
- Tráfico: ~20GB/mes (cada imagen vista 40 veces/mes aprox)

| Provider       | Storage        | Bandwidth      | Total/mes             |
| -------------- | -------------- | -------------- | --------------------- |
| **Local**      | $0             | $0             | **$0** ⚠️ (no escala) |
| **Cloudinary** | $0 (free tier) | $0 (free tier) | **$0** ✅ (perfecto)  |
| **AWS S3**     | ~$0.20         | ~$2            | **~$2.20**            |

**Conclusión:** Cloudinary free tier es perfecto para Pucará. Incluye 25GB storage + 25GB bandwidth/mes, más que suficiente.

---
