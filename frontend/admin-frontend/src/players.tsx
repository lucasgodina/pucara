import { Avatar, Chip } from '@mui/material'
import {
  Create,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FunctionField,
  ImageField,
  ImageInput,
  List,
  NumberField,
  ReferenceField,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  useGetList,
} from 'react-admin'

// Componente personalizado para el selector de equipos
const TeamSelectInput = (props: any) => {
  const { data: teams, isLoading } = useGetList('teams', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'name', order: 'ASC' },
  })

  if (isLoading) {
    return <SelectInput {...props} choices={[]} />
  }

  const choices = [
    { id: null, name: '🆓 Agente Libre', description: 'Sin equipo asignado' },
    ...(teams || []).map((team: any) => ({
      id: team.teamId,
      name: `🏆 ${team.name}`,
      description: team.description || 'Sin descripción',
    })),
  ]

  return (
    <SelectInput
      {...props}
      choices={choices}
      optionText={(choice: any) => choice.name}
      optionValue="id"
      emptyText="Seleccionar equipo..."
    />
  )
}

// Componente para mostrar foto del jugador
const PlayerAvatar = ({ record }: { record?: any }) => {
  if (!record?.photoUrl) {
    return (
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        {record?.name?.charAt(0)?.toUpperCase() || '?'}
      </Avatar>
    )
  }

  return (
    <Avatar src={record.photoUrl} alt={record.name}>
      {record?.name?.charAt(0)?.toUpperCase() || '?'}
    </Avatar>
  )
}

// Componente para mostrar equipo o "Agente Libre"
const TeamDisplay = ({ record }: { record?: any }) => {
  if (!record?.teamId) {
    return <Chip label="Agente Libre" color="default" variant="outlined" size="small" />
  }

  return (
    <ReferenceField source="teamId" reference="teams" link="show">
      <TextField source="name" />
    </ReferenceField>
  )
}

// Lista de jugadores
export const PlayerList = () => (
  <List
    actions={
      <TopToolbar>
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
  >
    <Datagrid>
      <FunctionField label="Foto" render={(record: any) => <PlayerAvatar record={record} />} />
      <TextField source="name" label="Nombre" />
      <NumberField source="age" label="Edad" />
      <TextField source="role" label="Rol" />
      <TextField source="country" label="País" />
      <TextField source="instagram" label="Instagram" />
      <FunctionField label="Equipo" render={(record: any) => <TeamDisplay record={record} />} />
      <DateField source="createdAt" label="Creado" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

// Formulario de creación de jugadores
export const PlayerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Jugador" required fullWidth />
      <TeamSelectInput source="teamId" label="Asignar Equipo" fullWidth />
      <TextInput source="age" label="Edad" type="number" fullWidth helperText="Edad del jugador" />
      <TextInput
        source="role"
        label="Rol"
        fullWidth
        helperText="Ej: Top, Jungle, Mid, ADC, Support"
      />
      <TextInput
        source="country"
        label="País"
        fullWidth
        helperText="Ej: 🇦🇷 Argentina, 🇧🇷 Brasil"
      />
      <TextInput
        source="instagram"
        label="Instagram"
        fullWidth
        helperText="Usuario de Instagram (sin @)"
      />
      <TextInput source="bio" label="Biografía" multiline rows={3} fullWidth />
      
      <ImageInput 
        source="photo" 
        label="Foto del Jugador" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
)

// Formulario de edición de jugadores
export const PlayerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Jugador" required fullWidth />
      <TeamSelectInput source="teamId" label="Reasignar Equipo" fullWidth />
      <TextInput source="age" label="Edad" type="number" fullWidth helperText="Edad del jugador" />
      <TextInput
        source="role"
        label="Rol"
        fullWidth
        helperText="Ej: Top, Jungle, Mid, ADC, Support"
      />
      <TextInput
        source="country"
        label="País"
        fullWidth
        helperText="Ej: 🇦🇷 Argentina, 🇧🇷 Brasil"
      />
      <TextInput
        source="instagram"
        label="Instagram"
        fullWidth
        helperText="Usuario de Instagram (sin @)"
      />
      <TextInput source="bio" label="Biografía" multiline rows={3} fullWidth />
      
      <ImageField source="photoUrl" label="Foto Actual" />
      
      <ImageInput 
        source="photo" 
        label="Nueva Foto del Jugador" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
)

// Vista detallada de jugadores
export const PlayerShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField label="Foto" render={(record: any) => <PlayerAvatar record={record} />} />
      <TextField source="name" label="Nombre" />
      <NumberField source="age" label="Edad" />
      <TextField source="role" label="Rol" />
      <TextField source="country" label="País" />
      <TextField source="instagram" label="Instagram" />
      <FunctionField label="Equipo" render={(record: any) => <TeamDisplay record={record} />} />
      <TextField source="bio" label="Biografía" />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
