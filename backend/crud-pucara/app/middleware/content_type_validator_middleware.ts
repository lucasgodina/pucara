import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Content-Type validation middleware
 * Ensures POST/PATCH/PUT requests have correct Content-Type
 */
export default class ContentTypeValidatorMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    // Only validate content type for requests that should have a body
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      const contentType = request.header('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        return response.badRequest({
          success: false,
          message: 'Content-Type debe ser application/json',
          code: 'INVALID_CONTENT_TYPE',
        })
      }
    }

    await next()
  }
}
