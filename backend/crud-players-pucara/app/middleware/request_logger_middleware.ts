import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Request logging middleware
 * Logs all API requests with method, URL, status and response time
 */
export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const startTime = Date.now()

    // Log incoming request
    logger.info(`${request.method()} ${request.url()}`, {
      ip: request.ip(),
      userAgent: request.header('user-agent'),
      body: request.method() !== 'GET' ? request.body() : undefined,
    })

    await next()

    // Log response
    const responseTime = Date.now() - startTime
    const { response } = ctx

    logger.info(`${request.method()} ${request.url()} - ${response.getStatus()}`, {
      responseTime: `${responseTime}ms`,
      status: response.getStatus(),
    })
  }
}
