import React from 'react'
import { Admin, Resource } from 'react-admin'
import {
  Groups as TeamsIcon,
  Person as PlayersIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'

import { pucaraLightTheme, pucaraDarkTheme } from './ThemeContext'
import { CustomLayout } from './CustomLayout'
import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'
import { TeamList, TeamCreate, TeamEdit, TeamShow } from './teams'
import { PlayerList, PlayerCreate, PlayerEdit, PlayerShow } from './players'

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      title="Pucará Esports Admin"
      dashboard={Dashboard}
      layout={CustomLayout}
      lightTheme={pucaraLightTheme}
      darkTheme={pucaraDarkTheme}
      defaultTheme="dark"
      disableTelemetry
      requireAuth={false}
    >
      <Resource
        name="teams"
        list={TeamList}
        create={TeamCreate}
        edit={TeamEdit}
        show={TeamShow}
        icon={TeamsIcon}
        options={{ label: 'Equipos' }}
      />
      <Resource
        name="players"
        list={PlayerList}
        create={PlayerCreate}
        edit={PlayerEdit}
        show={PlayerShow}
        icon={PlayersIcon}
        options={{ label: 'Jugadores' }}
      />
    </Admin>
  )
}

export default App
