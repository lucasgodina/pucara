// app/controllers/user_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UserController {
  // Listar todos los usuarios (solo admin)
  async index({ response }: HttpContext) {
    try {
      const users = await User.query()
        .select('id', 'username', 'email', 'role', 'createdAt', 'updatedAt')
        .orderBy('createdAt', 'desc')

      // Agregar header Content-Range para React Admin
      response.header('Content-Range', `users 0-${users.length - 1}/${users.length}`)

      return response.ok(users)
    } catch (error) {
      return response.internalServerError('Error al obtener usuarios')
    }
  }

  // Crear nuevo usuario (solo admin)
  async store({ request, response }: HttpContext) {
    try {
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
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.internalServerError('Error al crear usuario')
    }
  }

  // Mostrar usuario específico (solo admin)
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)
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
      return response.internalServerError('Error al obtener usuario')
    }
  }

  // Actualizar usuario (solo admin)
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.notFound('Usuario no encontrado')
      }

      const { username, email, role, password } = request.only([
        'username',
        'email',
        'role',
        'password',
      ])

      // Validar que el rol sea válido
      if (role && !['admin', 'editor', 'user'].includes(role)) {
        return response.badRequest('Rol inválido')
      }

      // Verificar que el email no esté duplicado (si se está cambiando)
      if (email && email !== user.email) {
        const existingUser = await User.findBy('email', email)
        if (existingUser) {
          return response.conflict('El email ya está registrado')
        }
      }

      // Actualizar campos
      if (username) user.username = username
      if (email) user.email = email
      if (role) user.role = role
      if (password) user.password = password

      await user.save()

      return response.ok({
        message: 'Usuario actualizado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.internalServerError('Error al actualizar usuario')
    }
  }

  // Eliminar usuario (solo admin)
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.notFound('Usuario no encontrado')
      }

      // No permitir que el admin se elimine a sí mismo
      if (user.id === auth.user!.id) {
        return response.badRequest('No puedes eliminar tu propia cuenta')
      }

      await user.delete()

      return response.ok({
        message: 'Usuario eliminado exitosamente',
      })
    } catch (error) {
      return response.internalServerError('Error al eliminar usuario')
    }
  }

  // Cambiar solo el rol de un usuario (solo admin)
  async changeRole({ params, request, response, auth }: HttpContext) {
    try {
      const { role } = request.only(['role'])

      // Validar que el rol sea válido
      if (!['admin', 'editor', 'user'].includes(role)) {
        return response.badRequest('Rol inválido')
      }

      const user = await User.find(params.id)
      if (!user) {
        return response.notFound('Usuario no encontrado')
      }

      // No permitir cambiar el rol del admin actual
      if (user.id === auth.user!.id) {
        return response.badRequest('No puedes cambiar tu propio rol')
      }

      user.role = role
      await user.save()

      return response.ok({
        message: 'Rol actualizado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.internalServerError('Error al cambiar rol')
    }
  }
}
