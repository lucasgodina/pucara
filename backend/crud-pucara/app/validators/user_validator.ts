import vine from '@vinejs/vine'

/**
 * Validator for creating a new user
 */
export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(50).optional(),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    role: vine.enum(['admin', 'editor', 'user']).optional(),
    full_name: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validator for updating a user
 */
export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(50).optional(),
    email: vine.string().email().normalizeEmail().optional(),
    password: vine.string().minLength(8).optional(),
    role: vine.enum(['admin', 'editor', 'user']).optional(),
    full_name: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validator for user ID parameter
 */
export const userIdValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
