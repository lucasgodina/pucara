import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'players'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('player_id').primary()
      table.string('name').notNullable()
      table.text('bio').nullable()
      table.json('stats').nullable()
      table.string('photo_url').nullable()
      table.uuid('team_id').nullable().references('team_id').inTable('teams').onDelete('SET NULL')
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
