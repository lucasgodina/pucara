import vine from '@vinejs/vine'

/**
 * Validator for creating a new player
 */
export const createPlayerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255),
    team_id: vine.string().uuid().optional().nullable(),
    bio: vine.string().optional().nullable(),
    stats: vine.record(vine.string()).optional().nullable(),
    photo_url: vine.string().url().optional().nullable(),
  })
)

/**
 * Validator for updating a player
 */
export const updatePlayerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).optional(),
    team_id: vine.string().uuid().optional().nullable(),
    bio: vine.string().optional().nullable(),
    stats: vine.record(vine.string()).optional().nullable(),
    photo_url: vine.string().url().optional().nullable(),
  })
)

/**
 * Validator for player ID parameter
 */
export const playerIdValidator = vine.compile(
  vine.object({
    player_id: vine.string().uuid(),
  })
)

/**
 * Validator for assigning team to player
 */
export const assignTeamValidator = vine.compile(
  vine.object({
    team_id: vine.string().uuid().nullable(),
  })
)

/**
 * Validator for player query filters
 */
export const playerFiltersValidator = vine.compile(
  vine.object({
    teamId: vine.string().uuid().optional(),
    isFreeAgent: vine.boolean().optional(),
  })
)
