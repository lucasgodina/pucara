// app/controllers/news_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import User from '#models/user'

export default class NewsController {
  // Listar todas las noticias (todos pueden ver)
  async index({ response }: HttpContext) {
    try {
      const news = await News.query()
        .preload('user', (query) => {
          query.select('id', 'username', 'email')
        })
        .orderBy('fecha', 'desc')

      // Transformar los datos para React Admin
      const transformedNews = news.map((item) => ({
        ...item.toJSON(),
        user: item.user ? `${item.user.username} (${item.user.email})` : 'Usuario desconocido',
      }))

      // Agregar header Content-Range para React Admin
      response.header('Content-Range', `news 0-${news.length - 1}/${news.length}`)

      return response.ok(transformedNews)
    } catch (error) {
      return response.internalServerError('Error al obtener noticias')
    }
  }

  // Crear nueva noticia (solo admin y editor)
  async store({ request, response, auth }: HttpContext) {
    try {
      const { titulo, fecha, comentario } = request.only(['titulo', 'fecha', 'comentario'])

      // Verificar que el usuario tenga permisos
      if (!['admin', 'editor'].includes(auth.user!.role)) {
        return response.forbidden('No tienes permisos para crear noticias')
      }

      const news = await News.create({
        titulo,
        fecha,
        comentario,
        userId: auth.user!.id,
      })

      // Cargar la relación con el usuario
      await news.load('user', (query) => {
        query.select('id', 'username', 'email')
      })

      return response.created({
        message: 'Noticia creada exitosamente',
        news,
      })
    } catch (error) {
      return response.internalServerError('Error al crear noticia')
    }
  }

  // Mostrar noticia específica (todos pueden ver)
  async show({ params, response }: HttpContext) {
    try {
      const news = await News.query()
        .where('id', params.id)
        .preload('user', (query) => {
          query.select('id', 'username', 'email')
        })
        .first()

      if (!news) {
        return response.notFound('Noticia no encontrada')
      }

      // Transformar los datos para React Admin
      const transformedNews = {
        ...news.toJSON(),
        user: news.user ? `${news.user.username} (${news.user.email})` : 'Usuario desconocido',
      }

      return response.ok(transformedNews)
    } catch (error) {
      return response.internalServerError('Error al obtener noticia')
    }
  }

  // Actualizar noticia (solo admin puede editar cualquier noticia, editor solo las suyas)
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const news = await News.find(params.id)
      if (!news) {
        return response.notFound('Noticia no encontrada')
      }

      // Verificar permisos
      if (auth.user!.role === 'user') {
        return response.forbidden('No tienes permisos para editar noticias')
      }

      // Si es editor, solo puede editar sus propias noticias
      if (auth.user!.role === 'editor' && news.userId !== auth.user!.id) {
        return response.forbidden('Solo puedes editar tus propias noticias')
      }

      const { titulo, fecha, comentario } = request.only(['titulo', 'fecha', 'comentario'])

      // Actualizar campos
      if (titulo) news.titulo = titulo
      if (fecha) news.fecha = fecha
      if (comentario !== undefined) news.comentario = comentario

      await news.save()

      // Cargar la relación con el usuario
      await news.load('user', (query) => {
        query.select('id', 'username', 'email')
      })

      return response.ok({
        message: 'Noticia actualizada exitosamente',
        news,
      })
    } catch (error) {
      return response.internalServerError('Error al actualizar noticia')
    }
  }

  // Eliminar noticia (solo admin puede eliminar cualquier noticia, editor solo las suyas)
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const news = await News.find(params.id)
      if (!news) {
        return response.notFound('Noticia no encontrada')
      }

      // Verificar permisos
      if (auth.user!.role === 'user') {
        return response.forbidden('No tienes permisos para eliminar noticias')
      }

      // Si es editor, solo puede eliminar sus propias noticias
      if (auth.user!.role === 'editor' && news.userId !== auth.user!.id) {
        return response.forbidden('Solo puedes eliminar tus propias noticias')
      }

      await news.delete()

      return response.ok({
        message: 'Noticia eliminada exitosamente',
      })
    } catch (error) {
      return response.internalServerError('Error al eliminar noticia')
    }
  }

  // Listar noticias del usuario autenticado (para editores)
  async myNews({ response, auth }: HttpContext) {
    try {
      if (auth.user!.role === 'user') {
        return response.forbidden('No tienes permisos para ver tus noticias')
      }

      const news = await News.query().where('userId', auth.user!.id).orderBy('fecha', 'desc')

      return response.ok(news)
    } catch (error) {
      return response.internalServerError('Error al obtener tus noticias')
    }
  }

  // Listar noticias por usuario específico (solo admin)
  async newsByUser({ params, response, auth }: HttpContext) {
    try {
      if (auth.user!.role !== 'admin') {
        return response.forbidden('Solo los administradores pueden ver noticias por usuario')
      }

      const user = await User.find(params.userId)
      if (!user) {
        return response.notFound('Usuario no encontrado')
      }

      const news = await News.query().where('userId', params.userId).orderBy('fecha', 'desc')

      return response.ok({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        news,
      })
    } catch (error) {
      return response.internalServerError('Error al obtener noticias del usuario')
    }
  }
}
