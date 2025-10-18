import type { HttpContext } from '@adonisjs/core/http'
import Team from '#models/team'
import { v4 as uuidv4 } from 'uuid'
import {
  createTeamValidator,
  updateTeamValidator,
  teamIdValidator,
} from '#validators/team_validator'

export default class TeamsController {
  /**
   * GET /api/v1/teams
   * Display a list of all teams
   */
  async index({ response }: HttpContext) {
    try {
      const teams = await Team.all()
      return response.ok({
        success: true,
        message: 'Equipos obtenidos exitosamente',
        data: teams,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los equipos',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * POST /api/v1/teams
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      // Validate request data
      const data = await request.validateUsing(createTeamValidator)

      // Create team with UUID
      const team = new Team()
      team.teamId = uuidv4()
      team.name = data.name
      team.description = data.description || null
      team.achievements = data.achievements || null

      await team.save()

      return response.created({
        success: true,
        message: 'Equipo creado exitosamente',
        data: team,
      })
    } catch (error) {
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
        message: 'Error al crear el equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * GET /api/v1/teams/:team_id
   * Show individual team with its players
   */
  async show({ params, response }: HttpContext) {
    try {
      // Validate team_id parameter
      await teamIdValidator.validate({ team_id: params.team_id })

      const team = await Team.query().where('team_id', params.team_id).preload('players').first()

      if (!team) {
        return response.notFound({
          success: false,
          message: `El equipo con ID '${params.team_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      return response.ok({
        success: true,
        message: 'Equipo obtenido exitosamente',
        data: team,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'ID de equipo inválido',
          code: 'VALIDATION_ERROR',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Error al obtener el equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * PATCH /api/v1/teams/:team_id
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      // Validate team_id parameter
      await teamIdValidator.validate({ team_id: params.team_id })

      // Validate request data
      const data = await request.validateUsing(updateTeamValidator)

      const team = await Team.findBy('team_id', params.team_id)

      if (!team) {
        return response.notFound({
          success: false,
          message: `El equipo con ID '${params.team_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      // Update only provided fields
      if (data.name !== undefined) team.name = data.name
      if (data.description !== undefined) team.description = data.description
      if (data.achievements !== undefined) team.achievements = data.achievements

      await team.save()

      return response.ok({
        success: true,
        message: 'Equipo actualizado exitosamente',
        data: team,
      })
    } catch (error) {
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
        message: 'Error al actualizar el equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * DELETE /api/v1/teams/:team_id
   * Delete team and handle players
   */
  async destroy({ params, request, response }: HttpContext) {
    try {
      const team = await Team.query().where('team_id', params.team_id).preload('players').first()

      if (!team) {
        return response.notFound({
          success: false,
          message: `El equipo con ID '${params.team_id}' no fue encontrado`,
          code: 'NOT_FOUND',
        })
      }

      // Check deletePlayers query parameter
      const deletePlayers = request.input('deletePlayers', false)

      if (deletePlayers === true || deletePlayers === 'true') {
        // Delete all players in the team
        for (const player of team.players) {
          await player.delete()
        }
        await team.delete()

        return response.ok({
          success: true,
          message: `El equipo '${team.name}' y sus ${team.players.length} jugadores han sido eliminados exitosamente`,
        })
      } else {
        // Set players as free agents (team_id = null)
        for (const player of team.players) {
          player.teamId = null
          await player.save()
        }
        await team.delete()

        return response.ok({
          success: true,
          message: `El equipo '${team.name}' ha sido eliminado y sus ${team.players.length} jugadores han sido liberados`,
        })
      }
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al eliminar el equipo',
        code: 'INTERNAL_ERROR',
      })
    }
  }
}
