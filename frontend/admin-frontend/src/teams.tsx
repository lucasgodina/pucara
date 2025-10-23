import { Chip } from '@mui/material'
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
    List,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar
} from 'react-admin'

// Componente personalizado para mostrar logros
const AchievementsField = ({ record }: { record?: any }) => {
  if (!record?.achievements) return <span>-</span>

  const achievements =
    typeof record.achievements === 'string' ? JSON.parse(record.achievements) : record.achievements

  return (
    <div>
      {Object.entries(achievements).map(([key, value]: [string, any]) => (
        <Chip
          key={key}
          label={`${key}: ${value}`}
          size="small"
          style={{ margin: '2px' }}
          color="primary"
          variant="outlined"
        />
      ))}
    </div>
  )
}

// Lista de equipos
export const TeamList = () => (
  <List
    actions={
      <TopToolbar>
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
  >
    <Datagrid>
      <TextField source="name" label="Nombre del Equipo" />
      <TextField source="description" label="Descripción" />
      <FunctionField
        label="Logros"
        render={(record: any) => <AchievementsField record={record} />}
      />
      <DateField source="createdAt" label="Creado" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

// Formulario de creación de equipos
export const TeamCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Equipo" required fullWidth />
      <TextInput source="slug" label="Slug (URL amigable)" helperText="Ej: dota-2, street-fighter" fullWidth />
      <TextInput source="emoji" label="Emoji" helperText="Ej: 🎮, 🛡️, 👊" fullWidth />
      <TextInput source="bannerUrl" label="URL del Banner" helperText="URL de la imagen del banner" fullWidth />
      <TextInput source="description" label="Descripción" multiline rows={3} fullWidth />
      <TextInput
        source="achievements"
        label="Logros (JSON)"
        helperText='Ejemplo: {"Torneo 2024": "Campeón", "Liga Regional": "2do Lugar"}'
        multiline
        rows={3}
        fullWidth
        parse={(value) => {
          if (!value) return null
          try {
            return JSON.parse(value)
          } catch {
            return value
          }
        }}
        format={(value) => {
          if (!value) return ''
          if (typeof value === 'string') return value
          return JSON.stringify(value, null, 2)
        }}
      />
    </SimpleForm>
  </Create>
)

// Formulario de edición de equipos
export const TeamEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Equipo" required fullWidth />
      <TextInput source="slug" label="Slug (URL amigable)" helperText="Ej: dota-2, street-fighter" fullWidth />
      <TextInput source="emoji" label="Emoji" helperText="Ej: 🎮, 🛡️, 👊" fullWidth />
      <TextInput source="bannerUrl" label="URL del Banner" helperText="URL de la imagen del banner" fullWidth />
      <TextInput source="description" label="Descripción" multiline rows={3} fullWidth />
      <TextInput
        source="achievements"
        label="Logros (JSON)"
        helperText='Ejemplo: {"Torneo 2024": "Campeón", "Liga Regional": "2do Lugar"}'
        multiline
        rows={3}
        fullWidth
        parse={(value) => {
          if (!value) return null
          try {
            return JSON.parse(value)
          } catch {
            return value
          }
        }}
        format={(value) => {
          if (!value) return ''
          if (typeof value === 'string') return value
          return JSON.stringify(value, null, 2)
        }}
      />
    </SimpleForm>
  </Edit>
)

// Vista detallada de equipos
export const TeamShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" label="Nombre del Equipo" />
      <TextField source="description" label="Descripción" />
      <FunctionField
        label="Logros"
        render={(record: any) => <AchievementsField record={record} />}
      />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
