import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Clave primaria autoincremental

      table
        .integer('tokenable_id') // Relación con tabla users
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Si se elimina el usuario, se eliminan sus tokens

      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash').notNullable()
      table.text('abilities').notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // Marca de creación
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('last_used_at', { useTz: true }).nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName) // Elimina la tabla si se revierte la migración
  }
}
