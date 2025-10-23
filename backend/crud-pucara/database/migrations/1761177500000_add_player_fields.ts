import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'players'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('age').nullable()
      table.string('role').nullable()
      table.string('country').nullable().defaultTo('🇦🇷 Argentina')
      table.string('instagram').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('age')
      table.dropColumn('role')
      table.dropColumn('country')
      table.dropColumn('instagram')
    })
  }
}
