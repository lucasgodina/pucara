import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'players'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stats')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('stats').nullable()
    })
  }
}
