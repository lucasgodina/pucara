// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized('Credenciales inválidas')
    }

    const isValidPassword = await user.verifyPassword(password)
    if (!isValidPassword) {
      return response.unauthorized('Credenciales inválidas')
    }

    // Crear el token con expiración de 1 hora
    const token = await User.accessTokens.create(user, [], { expiresIn: '1h' })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }
  }

  // Registro de usuarios (solo admin puede registrar)
  async register({ request, response, auth }: HttpContext) {
    try {
      // Verificar que solo los admin puedan registrar usuarios
      if (auth.user!.role !== 'admin') {
        return response.forbidden('Solo los administradores pueden registrar usuarios')
      }

      const { username, email, password, role } = request.only([
        'username',
        'email',
        'password',
        'role',
      ])

      // Validar que el rol sea válido
      const validRoles = ['admin', 'editor', 'user']
      if (!validRoles.includes(role)) {
        return response.badRequest('Rol inválido')
      }

      // Verificar que el email no exista
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict('El email ya está registrado')
      }

      // Crear el usuario
      const user = await User.create({
        username,
        email,
        password,
        role,
      })

      return response.created({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.internalServerError('Error al registrar usuario')
    }
  }

  // Obtener perfil del usuario autenticado
  async profile({ response, auth }: HttpContext) {
    try {
      const user = await User.find(auth.user!.id)
      if (!user) {
        return response.notFound('Usuario no encontrado')
      }

      return response.ok({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    } catch (error) {
      return response.internalServerError('Error al obtener perfil')
    }
  }

  // Cerrar sesión
  async logout({ response, auth }: HttpContext) {
    try {
      // Invalidar el token actual
      if (auth.user && auth.user.currentAccessToken) {
        await User.accessTokens.delete(auth.user, auth.user.currentAccessToken.identifier)
      }

      return response.ok({
        message: 'Sesión cerrada exitosamente',
      })
    } catch (error) {
      return response.internalServerError('Error al cerrar sesión')
    }
  }
}
