import React from 'react'
import { Admin, Resource } from 'react-admin'
import {
  Groups as TeamsIcon,
  Person as PlayersIcon,
  Dashboard as DashboardIcon,
  Article as NewsIcon,
  People as UsersIcon,
} from '@mui/icons-material'

import { pucaraLightTheme, pucaraDarkTheme } from './ThemeContext'
import { CustomLayout } from './CustomLayout'
import { dataProvider } from './dataProvider'
import { Dashboard } from './Dashboard'
import { TeamList, TeamCreate, TeamEdit, TeamShow } from './teams'
import { PlayerList, PlayerCreate, PlayerEdit, PlayerShow } from './players'
import { authProvider } from './authProvider'
import { NewsList, NewsCreate, NewsEdit, NewsShow } from './news'
import { UserList, UserCreate, UserEdit, UserShow } from './users'

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      title="Pucará Esports Admin"
      dashboard={Dashboard}
      layout={CustomLayout}
      lightTheme={pucaraLightTheme}
      darkTheme={pucaraDarkTheme}
      defaultTheme="dark"
      disableTelemetry
      requireAuth={true}
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
      <Resource
        name="news"
        list={NewsList}
        create={NewsCreate}
        edit={NewsEdit}
        show={NewsShow}
        icon={NewsIcon}
        options={{ label: 'Noticias' }}
      />
      <Resource
        name="users"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
        show={UserShow}
        icon={UsersIcon}
        options={{ label: 'Usuarios' }}
      />
    </Admin>
  )
}

export default App
