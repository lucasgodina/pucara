import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  // En desarrollo acepta todos los orígenes
  origin: [
    'https://pucara-api-9424c4c471cc.herokuapp.com', // URL de Heroku (para CORS interno)
    'https://pucara-admin-frontend.vercel.app',
    'https://pucara-landing.vercel.app',
    'http://localhost:3000', // Admin frontend en desarrollo
    'http://localhost:4321', // Landing en desarrollo
  ],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
