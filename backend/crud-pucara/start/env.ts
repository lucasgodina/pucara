/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  /*
  |----------------------------------------------------------
  | Admin user credentials
  |----------------------------------------------------------
  */
  ADMIN_NAME: Env.schema.string.optional(),
  ADMIN_EMAIL: Env.schema.string.optional(),
  ADMIN_PASSWORD: Env.schema.string.optional(),
  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_CONNECTION: Env.schema.enum(['sqlite'] as const),
  /*
  |----------------------------------------------------------
  | Variables for storage providers
  |----------------------------------------------------------
  */
  STORAGE_PROVIDER: Env.schema.enum(['local', 'cloudinary', 's3'] as const),
  /*
  |----------------------------------------------------------
  | Cloudinary configuration
  |----------------------------------------------------------
  */
  CLOUDINARY_CLOUD_NAME: Env.schema.string.optional(),
  CLOUDINARY_API_KEY: Env.schema.string.optional(),
  CLOUDINARY_API_SECRET: Env.schema.string.optional(),
})
