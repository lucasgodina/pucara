import vine from '@vinejs/vine'

/**
 * Validator for creating a new team
 */
export const createTeamValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255),
    slug: vine.string().optional().nullable(),
    banner_url: vine.string().optional().nullable(),
    description: vine.string().optional().nullable(),
  })
)

/**
 * Validator for updating a team
 */
export const updateTeamValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).optional(),
    slug: vine.string().optional().nullable(),
    banner_url: vine.string().optional().nullable(),
    description: vine.string().optional().nullable(),
  })
)

/**
 * Validator for team ID parameter
 */
export const teamIdValidator = vine.compile(
  vine.object({
    team_id: vine.string().uuid(),
  })
)
