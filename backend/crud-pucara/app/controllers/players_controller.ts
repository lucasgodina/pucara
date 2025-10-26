import Player from '#models/player'
import Team from '#models/team'
import imageStorageService from '#services/image_storage_service'
import { createPlayerValidator, playerFiltersValidator } from '#validators/player_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'

export default class PlayersController {
  /**
   * GET /api/v1/players
   * Display a list of all players with optional filters
   */
  async index({ request, response }: HttpContext) {
    try {
      // Validate query parameters
      const filters = await playerFiltersValidator.validate({
        teamId: request.input('teamId'),
        isFreeAgent: request.input('isFreeAgent'),
      })

      let query = Player.query().preload('team')

      // Filter by free agents (no team)
      if (filters.isFreeAgent === true) {
        query = query.whereNull('team_id')
      }
      // Filter by team ID (only if not filtering free agents)
      else if (filters.teamId) {
        query = query.where('team_id', filters.teamId)
      }

      const players = await query
      return response.ok(players)
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          message: 'Parámetros de consulta inválidos',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error al obtener los jugadores',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * POST /api/v1/players
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      // Validate request data
      const data = await request.validateUsing(createPlayerValidator)

      // Handle optional photo file upload
      const photo = request.file('photo')
      let photoUrl: string | null = data.photo_url || null

      if (photo) {
        const result = await imageStorageService.uploadImage(photo, 'players')
        photoUrl = result.url
      }

      // Validate team exists if teamId is provided
      if (data.teamId) {
        const team = await Team.findBy('team_id', data.teamId)
        if (!team) {
          return response.notFound({
            message: `El equipo con ID '${data.teamId}' no existe. El jugador se creará como libre`,
            code: 'TEAM_NOT_FOUND',
          })
        }
      }

      // Create player with UUID
      const player = new Player()
      player.playerId = uuidv4()
      player.name = data.name
      player.age = data.age || null
      player.role = data.role || null
      player.country = data.country || '🇦🇷 Argentina'
      player.instagram = data.instagram || null
      player.teamId = data.teamId || null
      player.bio = data.bio || null
      player.photoUrl = photoUrl

      await player.save()

      // Load team relation if exists
      await player.load('team')

      return response.created(player)
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error al crear el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * GET /api/v1/players/:player_id
   * Show individual player
   */
  async show({ params, response }: HttpContext) {
    try {
      const player = await Player.query()
        .where('player_id', params.player_id)
        .preload('team')
        .first()

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      return response.ok(player)
    } catch (error: any) {
      return response.internalServerError({
        message: 'Error al obtener el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * PATCH /api/v1/players/:player_id
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      console.log('=== Player Update Request ===')
      console.log('Player ID:', params.player_id)
      console.log('Request body:', request.body())
      console.log('Request headers:', request.headers())

      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        console.log('Player not found:', params.player_id)
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      console.log('Current player data:', player.toJSON())

      const data = request.only([
        'name',
        'age',
        'role',
        'country',
        'instagram',
        'teamId',
        'bio',
        'photo_url',
      ])
      console.log('Extracted data:', data)

      // Optional: handle new photo upload
      const photo = request.file('photo')
      let photoUploaded = false
      if (photo) {
        if (player.photoUrl) {
          await imageStorageService.deleteImage(player.photoUrl)
        }
        const result = await imageStorageService.uploadImage(photo, 'players')
        player.photoUrl = result.url
        photoUploaded = true
      }

      // Validate team exists if teamId is provided (and not null)
      if (data.teamId !== undefined && data.teamId !== null) {
        console.log('Validating teamId:', data.teamId)
        const team = await Team.findBy('team_id', data.teamId)
        if (!team) {
          console.log('Team not found:', data.teamId)
          return response.notFound({
            message: `El equipo con ID '${data.teamId}' no existe`,
            code: 'TEAM_NOT_FOUND',
          })
        }
        console.log('Team found:', team.toJSON())
      }

      // Update only provided fields
      if (data.name !== undefined) player.name = data.name
      if (data.age !== undefined) player.age = data.age
      if (data.role !== undefined) player.role = data.role
      if (data.country !== undefined) player.country = data.country
      if (data.instagram !== undefined) player.instagram = data.instagram
      if (data.teamId !== undefined) {
        console.log('Updating teamId from', player.teamId, 'to', data.teamId)
        player.teamId = data.teamId
      }
      if (data.bio !== undefined) player.bio = data.bio
      if (data.photo_url !== undefined && !photoUploaded) player.photoUrl = data.photo_url

      console.log('Player before save:', player.toJSON())
      await player.save()
      console.log('Player after save:', player.toJSON())

      // Load team relation
      await player.load('team')
      console.log('Player with team loaded:', player.toJSON())

      const responseData = player.toJSON()
      console.log('Response data:', responseData)

      return response.ok(responseData)
    } catch (error: any) {
      console.error('Error updating player:', error)
      return response.internalServerError({
        message: 'Error al actualizar el jugador',
        code: 'INTERNAL_ERROR',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/v1/players/:player_id
   * Delete player
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      // Delete photo if exists
      if (player.photoUrl) {
        await imageStorageService.deleteImage(player.photoUrl)
      }

      await player.delete()

      return response.ok({
        message: `El jugador '${player.name}' ha sido eliminado exitosamente`,
      })
    } catch (error: any) {
      return response.internalServerError({
        message: 'Error al eliminar el jugador',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * PATCH /api/v1/players/:player_id/assign-team
   * Assign or reassign player to a team
   */
  async assignTeam({ params, request, response }: HttpContext) {
    try {
      const player = await Player.findBy('player_id', params.player_id)

      if (!player) {
        return response.notFound({
          message: `El jugador con ID '${params.player_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      const { teamId } = request.only(['teamId'])

      // Validate team exists if teamId is not null
      if (teamId !== null) {
        const team = await Team.findBy('team_id', teamId)
        if (!team) {
          return response.notFound({
            message: `El equipo con ID '${teamId}' no existe`,
            code: 'TEAM_NOT_FOUND',
          })
        }
      }

      // Update player's team
      player.teamId = teamId
      await player.save()

      // Load team relation
      await player.load('team')

      const action = teamId ? 'asignado al equipo' : 'liberado del equipo'

      return response.ok({
        ...player.toJSON(),
        message: `El jugador '${player.name}' ha sido ${action} exitosamente`,
      })
    } catch (error: any) {
      return response.internalServerError({
        message: 'Error al asignar el jugador al equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }
}
