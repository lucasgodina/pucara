// app/middleware/role_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
  /**
   * Manejo del middleware
   * @param roles - array de roles permitidos
   */
  public async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
    // 1. Verificar que el usuario esté autenticado
    await auth.check()

    if (!auth.user) {
      return response.unauthorized('Debes iniciar sesión')
    }

    // 2. Verificar si el rol del usuario está en la lista permitida
    if (!roles.includes(auth.user.role)) {
      return response.forbidden('No tienes permisos para acceder a esta ruta')
    }

    // 3. Pasar al siguiente middleware/controlador
    await next()
  }
}
