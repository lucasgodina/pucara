/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Health check route
router.get('/', async ({ response }) => {
  return response.json({
    message: 'Pucará Esports - Backend API',
    status: 'active',
    frontend: 'React Admin available at http://localhost:3000',
    api: 'API v1 available at /api/v1',
    endpoints: {
      teams: '/api/v1/teams',
      players: '/api/v1/players',
    },
  })
})

// API v1 routes
router
  .group(() => {
    // Teams routes
    router
      .group(() => {
        router.get('/', '#controllers/teams_controller.index') // GET /teams
        router.post('/', '#controllers/teams_controller.store') // POST /teams
        router.get('/:team_id', '#controllers/teams_controller.show') // GET /teams/:team_id
        router.patch('/:team_id', '#controllers/teams_controller.update') // PATCH /teams/:team_id
        router.delete('/:team_id', '#controllers/teams_controller.destroy') // DELETE /teams/:team_id
      })
      .prefix('/teams')

    // Players routes
    router
      .group(() => {
        router.get('/', '#controllers/players_controller.index') // GET /players
        router.post('/', '#controllers/players_controller.store') // POST /players
        router.get('/:player_id', '#controllers/players_controller.show') // GET /players/:player_id
        router.patch('/:player_id', '#controllers/players_controller.update') // PATCH /players/:player_id
        router.delete('/:player_id', '#controllers/players_controller.destroy') // DELETE /players/:player_id

        // Specific endpoint for assigning players to teams
        router.patch('/:player_id/assign-team', '#controllers/players_controller.assignTeam') // PATCH /players/:player_id/assign-team
      })
      .prefix('/players')
  })
  .prefix('/api/v1')
