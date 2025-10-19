# 🚀 Guía Rápida: MercadoPago + Ngrok

## 📖 ¿Qué es esto?

Sistema de pagos con **MercadoPago** en **Astro** usando **Ngrok** para recibir webhooks en desarrollo local.

**Problema:** MercadoPago necesita enviar webhooks pero `localhost` no es accesible desde Internet.  
**Solución:** Ngrok crea un túnel HTTPS público → tu `localhost:4321`

---

## 🏗️ Arquitectura

```
Usuario → /store → POST /api/create-preference
    ↓
MercadoPago crea checkout
    ↓
Usuario paga
    ↓
MercadoPago → Webhook via Ngrok → localhost:4321/api/webhook
    ↓
Backend procesa y responde 200 OK
```

---

## ⚙️ Configuración

### 1️⃣ Instalar dependencias

```powershell
cd pucara/frontend/landing/Mvp-Pucara
npm install
```

### 2️⃣ Configurar `.env`

```env
# Obtén estas credenciales en:
# https://www.mercadopago.com.ar/developers/panel/credentials

MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx...
MERCADOPAGO_PUBLIC_KEY=TEST-xxxx...
NGROK_URL=  # Se configura después
NODE_ENV=development
```

### 3️⃣ Instalar Ngrok

**Opción 1: Descarga manual**
```powershell
# Descarga de: https://ngrok.com/download
# Extrae a: C:\Users\TU_USUARIO\ngrok\
```

**Opción 2: Chocolatey**
```powershell
choco install ngrok
```

### 4️⃣ Autenticar Ngrok (primera vez)

```powershell
# Obtén tu token en: https://dashboard.ngrok.com/get-started/your-authtoken
C:\Users\TU_USUARIO\ngrok\ngrok.exe config add-authtoken TU_TOKEN
```

---

## 🚀 Iniciar Sistema

### Terminal 1: Astro

```powershell
cd C:\ruta\pucara\frontend\landing\Mvp-Pucara
npm run dev
```

### Terminal 2: Ngrok

```powershell
C:\Users\TU_USUARIO\ngrok\ngrok.exe http 4321
```

**📋 Copia la URL de "Forwarding"** (ej: `https://abc123.ngrok-free.app`)

### Configurar Ngrok URL

1. Edita `.env`:
   ```env
   NGROK_URL=https://abc123.ngrok-free.app
   ```

2. Reinicia Astro:
   - `Ctrl+C` en Terminal 1
   - `npm run dev`

---

## 🧪 Testing

### 1. Abrir tienda
http://localhost:4321/store

### 2. Usar tarjeta de prueba

| Campo | Valor |
|-------|-------|
| Número | `5031 7557 3453 0604` |
| Nombre | `APRO` |
| CVV | `123` |
| Vencimiento | `11/25` |

### 3. Verificar

- ✅ Logs en terminal: `🔔 Webhook recibido`
- ✅ Inspector ngrok: http://localhost:4040 (código 200)
- ✅ Redirección a `/store/success`

---

## 🐛 Problemas Comunes

### Webhooks dan 403 Forbidden

**Causa:** Vite bloquea el host de ngrok

**Solución:** Verifica `astro.config.mjs`:
```javascript
export default defineConfig({
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev']
    }
  }
});
```
Reinicia Astro después.

---

### Webhooks no llegan

**Checklist:**
- [ ] Ngrok está corriendo (Terminal 2)
- [ ] `NGROK_URL` en `.env` es correcta
- [ ] Reiniciaste Astro después de configurar
- [ ] Logs muestran: `🔔 Public URL (ngrok): https://...`

---

### "Algo salió mal" en checkout

**Causa:** Credenciales mezcladas (TEST + PRODUCCIÓN)

**Solución:** Ambas credenciales deben ser TEST o ambas PRODUCCIÓN.

---

### URL de ngrok cambia cada vez

**Normal en plan gratuito.** Cada vez que reinicies ngrok:
1. Copia la nueva URL
2. Actualiza `.env`
3. Reinicia Astro

**Solución permanente:** Upgrade a plan pago = dominio estático

---

## 📊 Archivos Clave

### `src/pages/api/create-preference.ts`
Crea preferencia de pago en MercadoPago cuando usuario hace clic en "COMPRAR".

**Importante:**
- `notification_url` usa `NGROK_URL`
- Define `back_urls` (success/failure/pending)
- Incluye datos del `payer`

### `src/pages/api/webhook.ts`
Recibe notificaciones de MercadoPago cuando se procesa el pago.

**Importante:**
- Siempre responde `200 OK`
- Lee `body.topic` o `body.type`
- Procesa según tipo: `payment` o `merchant_order`

### `astro.config.mjs`
Configuración de Vite para permitir conexiones de ngrok.

**Importante:**
- Define `allowedHosts` con dominios de ngrok
- Sin esto, Vite bloquea los webhooks

---

## 🔒 Seguridad

- ⚠️ **Nunca** subas `.env` a Git
- ✅ Access Token solo se usa en backend
- ✅ En producción, usa variables de entorno del hosting

---

## 🚀 Producción

Cuando deploys (Vercel, Netlify, etc.):

1. **Cambia credenciales a PRODUCCIÓN**
2. **Elimina `NGROK_URL`** del `.env`
3. **Configura webhooks** en MercadoPago con tu dominio real
4. **Usa tarjetas reales** para testing

---

## 📚 Recursos

- 📖 [Docs MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)
- 📖 [Docs Ngrok](https://ngrok.com/docs)
- 💳 [Tarjetas de Prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards)
- 🔔 [Webhooks](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/notifications/webhooks)

---

## ✅ Checklist

```
□ npm install ejecutado
□ .env configurado con credenciales TEST
□ Ngrok instalado y autenticado
□ Terminal 1: Astro corriendo (npm run dev)
□ Terminal 2: Ngrok corriendo (ngrok http 4321)
□ NGROK_URL configurada en .env
□ Astro reiniciado
□ Compra de prueba exitosa
□ Webhook visible en logs (200 OK)
```

**¡Listo!** 🎉

---

**Tecnologías:** Astro • MercadoPago • Ngrok  
**Fecha:** Octubre 2025 