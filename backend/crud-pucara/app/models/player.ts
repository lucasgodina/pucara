import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Team from './team.js'

export default class Player extends BaseModel {
  @column({ isPrimary: true, columnName: 'player_id' })
  declare playerId: string

  @column()
  declare name: string

  @column()
  declare age: number | null

  @column()
  declare role: string | null

  @column()
  declare country: string | null

  @column()
  declare instagram: string | null

  @column()
  declare bio: string | null

  @column()
  declare stats: Record<string, string> | null

  @column({ columnName: 'photo_url' })
  declare photoUrl: string | null

  @column({ columnName: 'team_id' })
  declare teamId: string | null

  @belongsTo(() => Team, {
    foreignKey: 'teamId',
    localKey: 'teamId',
  })
  declare team: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
