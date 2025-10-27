// app/controllers/auth_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    // Aceptar tanto 'username' como 'email' del request
    const identifier = request.input('username') || request.input('email')
    const password = request.input('password')

    if (!identifier || !password) {
      return response.badRequest({
        message: 'Username/email y password son requeridos',
      })
    }

    // Intentar login con username o email
    const user = await User.verifyCredentials(identifier, password)

    // Single session para admin: eliminar todos los tokens anteriores para evitar
    // problemas de concurrencia y asegurar que solo hay una sesión activa.
    // Usuarios con rol 'editor' y 'user' pueden tener múltiples sesiones simultáneas.
    if (user.role === 'admin') {
      await User.accessTokens.all(user).then((tokens) => {
        return Promise.all(tokens.map((t) => User.accessTokens.delete(user, t.identifier)))
      })
    }

    // Crear el token con expiración de 7 días
    const token = await User.accessTokens.create(user, [], { expiresIn: '7 days' })

    return {
      type: 'bearer',
      value: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  }

  // Registro de usuarios
  async register({ request, response }: HttpContext) {
    try {
      const { fullName, username, email, password } = request.only([
        'fullName',
        'username',
        'email',
        'password',
      ])

      // Verificar que el email no exista
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({ message: 'El email ya está registrado' })
      }

      // Verificar que el username no exista (si se proporcionó)
      if (username) {
        const existingUsername = await User.findBy('username', username)
        if (existingUsername) {
          return response.conflict({ message: 'El username ya está registrado' })
        }
      }

      // Crear el usuario
      const user = await User.create({
        fullName,
        username,
        email,
        password,
        role: 'user', // Por defecto es user
      })

      return response.created({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
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
        username: user.username,
        email: user.email,
        role: user.role,
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
