// app/controllers/user_controller.ts
import User from '#models/user'
import {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} from '#validators/user_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  // Listar todos los usuarios (solo admin)
  async index({ response }: HttpContext) {
    try {
      const users = await User.query()
        .select('id', 'username', 'email', 'role', 'fullName', 'createdAt', 'updatedAt')
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
      const data = await request.validateUsing(createUserValidator)

      // Verificar que el email no exista
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.conflict({
          success: false,
          message: 'El email ya está registrado',
          code: 'EMAIL_CONFLICT',
        })
      }

      // Verificar que el username no exista (si se proporcionó)
      if (data.username) {
        const existingUsername = await User.findBy('username', data.username)
        if (existingUsername) {
          return response.conflict({
            success: false,
            message: 'El username ya está registrado',
            code: 'USERNAME_CONFLICT',
          })
        }
      }

      // Crear el usuario
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role || 'user',
        fullName: data.full_name,
      })

      return response.created({
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
      })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al crear usuario',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  // Mostrar usuario específico (solo admin)
  async show({ params, response }: HttpContext) {
    try {
      await userIdValidator.validate({ id: params.id })

      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuario no encontrado',
          code: 'NOT_FOUND',
        })
      }

      return response.ok({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'ID de usuario inválido',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al obtener usuario',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  // Actualizar usuario (solo admin)
  async update({ params, request, response }: HttpContext) {
    try {
      await userIdValidator.validate({ id: params.id })
      const data = await request.validateUsing(updateUserValidator)

      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuario no encontrado',
          code: 'NOT_FOUND',
        })
      }

      // Verificar que el email no esté duplicado (si se está cambiando)
      if (data.email && data.email !== user.email) {
        const existingUser = await User.findBy('email', data.email)
        if (existingUser) {
          return response.conflict({
            success: false,
            message: 'El email ya está registrado',
            code: 'EMAIL_CONFLICT',
          })
        }
      }

      // Verificar que el username no esté duplicado (si se está cambiando)
      if (data.username && data.username !== user.username) {
        const existingUsername = await User.findBy('username', data.username)
        if (existingUsername) {
          return response.conflict({
            success: false,
            message: 'El username ya está registrado',
            code: 'USERNAME_CONFLICT',
          })
        }
      }

      // Actualizar campos
      if (data.username !== undefined) user.username = data.username
      if (data.email !== undefined) user.email = data.email
      if (data.role !== undefined) user.role = data.role
      if (data.password !== undefined) user.password = data.password
      if (data.full_name !== undefined) user.fullName = data.full_name

      await user.save()

      return response.ok({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
      })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al actualizar usuario',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  // Eliminar usuario (solo admin)
  async destroy({ params, response, auth }: HttpContext) {
    try {
      await userIdValidator.validate({ id: params.id })

      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuario no encontrado',
          code: 'NOT_FOUND',
        })
      }

      // No permitir que el admin se elimine a sí mismo
      if (user.id === auth.user!.id) {
        return response.badRequest({
          success: false,
          message: 'No puedes eliminar tu propia cuenta',
          code: 'SELF_DELETE_ERROR',
        })
      }

      await user.delete()

      return response.ok({
        success: true,
        message: 'Usuario eliminado exitosamente',
      })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'ID de usuario inválido',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al eliminar usuario',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  // Cambiar solo el rol de un usuario (solo admin)
  async changeRole({ params, request, response, auth }: HttpContext) {
    try {
      await userIdValidator.validate({ id: params.id })
      const { role } = request.only(['role'])

      // Validar que el rol sea válido
      if (!['admin', 'editor', 'user'].includes(role)) {
        return response.badRequest({
          success: false,
          message: 'Rol inválido',
          code: 'INVALID_ROLE',
        })
      }

      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuario no encontrado',
          code: 'NOT_FOUND',
        })
      }

      // No permitir cambiar el rol del admin actual
      if (user.id === auth.user!.id) {
        return response.badRequest({
          success: false,
          message: 'No puedes cambiar tu propio rol',
          code: 'SELF_ROLE_CHANGE_ERROR',
        })
      }

      user.role = role
      await user.save()

      return response.ok({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'ID de usuario inválido',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al cambiar rol',
        code: 'INTERNAL_ERROR',
      })
    }
  }
}
