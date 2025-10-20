import type { HttpContext } from '@adonisjs/core/http'

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
  errors?: any[]
  code?: string
}

export interface PaginatedResponse extends ApiResponse {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Standardized API response helper
 */
export class ResponseHelper {
  /**
   * Success response
   */
  static success(ctx: HttpContext, data: any, message = 'Operación exitosa', statusCode = 200) {
    return ctx.response.status(statusCode).json({
      success: true,
      message,
      data,
    })
  }

  /**
   * Created response (201)
   */
  static created(ctx: HttpContext, data: any, message = 'Recurso creado exitosamente') {
    return this.success(ctx, data, message, 201)
  }

  /**
   * Error response
   */
  static error(
    ctx: HttpContext,
    message: string,
    statusCode = 500,
    code = 'ERROR',
    errors: any[] = []
  ) {
    return ctx.response.status(statusCode).json({
      success: false,
      message,
      code,
      errors: errors.length > 0 ? errors : undefined,
    })
  }

  /**
   * Validation error response (400)
   */
  static validationError(ctx: HttpContext, errors: any[], message = 'Datos de entrada inválidos') {
    return this.error(ctx, message, 400, 'VALIDATION_ERROR', errors)
  }

  /**
   * Not found response (404)
   */
  static notFound(ctx: HttpContext, message = 'Recurso no encontrado') {
    return this.error(ctx, message, 404, 'NOT_FOUND')
  }

  /**
   * Unauthorized response (401)
   */
  static unauthorized(ctx: HttpContext, message = 'No autorizado') {
    return this.error(ctx, message, 401, 'UNAUTHORIZED')
  }

  /**
   * Forbidden response (403)
   */
  static forbidden(ctx: HttpContext, message = 'Acceso denegado') {
    return this.error(ctx, message, 403, 'FORBIDDEN')
  }

  /**
   * Conflict response (409)
   */
  static conflict(ctx: HttpContext, message = 'Conflicto con el estado actual del recurso') {
    return this.error(ctx, message, 409, 'CONFLICT')
  }

  /**
   * Paginated response
   */
  static paginated(
    ctx: HttpContext,
    data: any[],
    pagination: { page: number; limit: number; total: number },
    message = 'Datos obtenidos exitosamente'
  ) {
    const totalPages = Math.ceil(pagination.total / pagination.limit)

    return ctx.response.json({
      success: true,
      message,
      data,
      pagination: {
        ...pagination,
        totalPages,
      },
    })
  }
}
