import { defineConfig } from '@adonisjs/static'

/**
 * Configuration options to tweak the static files middleware.
 * The complete set of options are documented on the
 * official documentation website.
 *
 * https://docs.adonisjs.com/guides/static-assets
 */
const staticServerConfig = defineConfig({
  enabled: true, // Habilitado para servir imágenes desde public/uploads
  etag: true,
  lastModified: true,
  dotFiles: 'ignore',
})

export default staticServerConfig
