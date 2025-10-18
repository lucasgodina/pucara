import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material'
import {
  Groups as TeamsIcon,
  Person as PlayerIcon,
  PersonOff as FreeAgentIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material'
import { useDataProvider } from 'react-admin'

interface DashboardStats {
  totalTeams: number
  totalPlayers: number
  freeAgents: number
  playersWithTeams: number
}

interface Team {
  teamId: string
  name: string
  description?: string
  achievements?: any
  playersCount?: number
}

interface Player {
  playerId: string
  name: string
  teamId?: string
  photoUrl?: string
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalPlayers: 0,
    freeAgents: 0,
    playersWithTeams: 0,
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  const dataProvider = useDataProvider()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener equipos y jugadores
        const [teamsData, playersData] = await Promise.all([
          dataProvider.getList('teams', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
          }),
          dataProvider.getList('players', {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
          }),
        ])

        const teamsArray = teamsData.data
        const playersArray = playersData.data

        // Calcular estadísticas
        const freeAgents = playersArray.filter((player) => !player.teamId).length
        const playersWithTeams = playersArray.length - freeAgents

        setStats({
          totalTeams: teamsArray.length,
          totalPlayers: playersArray.length,
          freeAgents,
          playersWithTeams,
        })

        // Contar jugadores por equipo
        const teamsWithCounts = teamsArray.map((team) => ({
          ...team,
          playersCount: playersArray.filter((player) => player.teamId === team.teamId).length,
        }))

        setTeams(teamsWithCounts)
        setRecentPlayers(playersArray.slice(0, 5)) // Últimos 5 jugadores
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [dataProvider])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>Cargando dashboard...</Typography>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🎮 Dashboard - Pucará Esports
      </Typography>

      {/* Estadísticas principales */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TeamsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Equipos
                </Typography>
                <Typography variant="h4">{stats.totalTeams}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PlayerIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Jugadores
                </Typography>
                <Typography variant="h4">{stats.totalPlayers}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <FreeAgentIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Agentes Libres
                </Typography>
                <Typography variant="h4">{stats.freeAgents}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TrophyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  En Equipos
                </Typography>
                <Typography variant="h4">{stats.playersWithTeams}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Lista de equipos */}
        <Paper>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              📋 Equipos Registrados
            </Typography>
            {teams.length === 0 ? (
              <Typography color="textSecondary">No hay equipos registrados</Typography>
            ) : (
              <List>
                {teams.map((team) => (
                  <ListItem key={team.teamId}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <TeamsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={team.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {team.description || 'Sin descripción'}
                          </Typography>
                          <Chip
                            label={`${team.playersCount || 0} jugadores`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Jugadores recientes */}
        <Paper>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              👥 Jugadores Recientes
            </Typography>
            {recentPlayers.length === 0 ? (
              <Typography color="textSecondary">No hay jugadores registrados</Typography>
            ) : (
              <List>
                {recentPlayers.map((player) => (
                  <ListItem key={player.playerId}>
                    <ListItemAvatar>
                      <Avatar src={player.photoUrl} sx={{ bgcolor: 'secondary.main' }}>
                        {player.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={player.name}
                      secondary={
                        <Chip
                          label={player.teamId ? 'En equipo' : 'Agente libre'}
                          size="small"
                          color={player.teamId ? 'success' : 'default'}
                          variant="outlined"
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
