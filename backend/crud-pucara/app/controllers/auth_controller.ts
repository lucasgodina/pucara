// app/controllers/auth_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.verifyCredentials(email, password)

    // Crear el token con expiración de 7 días
    const token = await User.accessTokens.create(user, [], { expiresIn: '7 days' })

    return {
      type: 'bearer',
      value: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    }
  }

  // Registro de usuarios
  async register({ request, response }: HttpContext) {
    try {
      const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

      // Verificar que el email no exista
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({ message: 'El email ya está registrado' })
      }

      // Crear el usuario
      const user = await User.create({
        fullName,
        email,
        password,
      })

      return response.created({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al registrar usuario' })
    }
  }

  // Obtener perfil del usuario autenticado
  async me({ response, auth }: HttpContext) {
    try {
      const user = auth.user!

      return response.ok({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener perfil' })
    }
  }

  // Cerrar sesión
  async logout({ response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return response.ok({
        message: 'Sesión cerrada exitosamente',
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al cerrar sesión' })
    }
  }
}
