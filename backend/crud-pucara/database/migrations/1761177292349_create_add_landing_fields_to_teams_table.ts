import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').nullable().unique()
      table.string('emoji').nullable().defaultTo('🎮')
      table.string('banner_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
      table.dropColumn('emoji')
      table.dropColumn('banner_url')
    })
  }
}
