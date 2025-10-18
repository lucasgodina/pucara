import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import app from '@adonisjs/core/services/app'

/**
 * Global error handler middleware
 * Provides consistent error responses across the API
 */
export default class GlobalErrorHandlerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await next()
    } catch (error) {
      // Only handle in production/non-debug mode to avoid interfering with development
      if (app.inProduction) {
        return this.handleError(ctx, error)
      }

      // Re-throw in development for better debugging
      throw error
    }
  }

  private handleError(ctx: HttpContext, error: any) {
    const { response } = ctx

    // Validation errors (from Vine)
    if (error.messages) {
      return response.badRequest({
        message: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        errors: error.messages,
      })
    }

    // Database/Model errors
    if (error.code) {
      switch (error.code) {
        case 'ER_DUP_ENTRY':
        case 'SQLITE_CONSTRAINT_UNIQUE':
          return response.conflict({
            message: 'Ya existe un registro con estos datos',
            code: 'DUPLICATE_ENTRY',
          })

        case 'ER_NO_REFERENCED_ROW':
        case 'SQLITE_CONSTRAINT_FOREIGNKEY':
          return response.badRequest({
            message: 'Referencia a un registro inexistente',
            code: 'FOREIGN_KEY_CONSTRAINT',
          })
      }
    }

    // HTTP errors (404, 403, etc.)
    if (error.status) {
      return response.status(error.status).send({
        message: error.message || 'Error en la solicitud',
        code: error.code || 'HTTP_ERROR',
      })
    }

    // Generic server errors
    console.error('Unhandled error:', error)
    return response.internalServerError({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    })
  }
}
