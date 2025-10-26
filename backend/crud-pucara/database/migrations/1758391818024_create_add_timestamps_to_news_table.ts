import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      if (!this.schema.hasColumn(this.tableName, 'created_at')) {
        table.timestamp('created_at').defaultTo(this.now())
      }
      if (!this.schema.hasColumn(this.tableName, 'updated_at')) {
        table.timestamp('updated_at').defaultTo(this.now())
      }
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
  }
}
