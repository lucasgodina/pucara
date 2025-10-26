import CloseIcon from '@mui/icons-material/Close'
import { Avatar, Box, Chip, IconButton } from '@mui/material'
import { useState } from 'react'
import {
    Confirm,
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
    useDataProvider,
    useGetList,
    useNotify,
    useRecordContext,
    useRefresh,
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

// Componente interno para el formulario de edición con acceso al contexto
const PlayerEditForm = () => {
  const [showPhoto, setShowPhoto] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const record = useRecordContext()
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const refresh = useRefresh()

  const handleDeleteImage = async () => {
    if (!record?.id) return

    // Cerrar el diálogo inmediatamente
    setConfirmOpen(false)
    
    // Optimistic update - ocultar la imagen inmediatamente
    setShowPhoto(false)
    notify('Eliminando imagen...', { type: 'info' })

    try {
      // Llamar al backend de forma asíncrona (sin bloquear la UI)
      dataProvider.update('players', {
        id: record.id,
        data: { photoUrl: null },
        previousData: record,
      }).then(() => {
        notify('Imagen eliminada correctamente', { type: 'success' })
        refresh()
      }).catch((error) => {
        console.error('Error al eliminar la imagen:', error)
        notify('Error al eliminar la imagen', { type: 'error' })
        // Revertir el cambio visual en caso de error
        setShowPhoto(true)
      })
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
      notify('Error al eliminar la imagen', { type: 'error' })
      setShowPhoto(true)
    }
  }

  return (
    <>
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

      {/* Imagen actual con botón de eliminar */}
      {record?.photoUrl && showPhoto && (
        <Box position="relative" display="block" width="fit-content" mb={2}>
          <ImageField source="photoUrl" label="Foto Actual" sx={{ width: 180, height: 180, borderRadius: 2, boxShadow: 1 }} />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(255,255,255,0.8)',
              zIndex: 2,
              boxShadow: 1,
              ':hover': { background: 'rgba(255,0,0,0.8)', color: '#fff' },
            }}
            onClick={() => setConfirmOpen(true)}
            title="Eliminar imagen"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <ImageInput 
        source="photo" 
        label="Nueva Foto del Jugador" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      {/* Diálogo de confirmación */}
      <Confirm
        isOpen={confirmOpen}
        title="Eliminar imagen"
        content="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
        onConfirm={handleDeleteImage}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

// Formulario de edición de jugadores
export const PlayerEdit = () => (
  <Edit>
    <SimpleForm>
      <PlayerEditForm />
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
