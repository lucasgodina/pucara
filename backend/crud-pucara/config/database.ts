import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION'),
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.makePath('database/pucara.sqlite'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    pg: {
      client: 'pg',
      connection: env.get('DATABASE_URL'),
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      // Neon requires SSL; in many environments the default CA is fine
    },
  },
})

export default dbConfig
