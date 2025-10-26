import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('achievements')
      table.dropColumn('emoji')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('achievements').nullable()
      table.string('emoji').nullable().defaultTo('🎮')
    })
  }
}
