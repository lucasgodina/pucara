import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
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
    ImageField,
    ImageInput,
    List,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin'

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
      <ImageField source="bannerUrl" label="Banner" sx={{ '& img': { maxHeight: 50, maxWidth: 100, objectFit: 'cover' } }} />
      <TextField source="name" label="Nombre del Equipo" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Descripción" />
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
      
      <ImageInput 
        source="banner" 
        label="Banner del Equipo" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      
      <TextInput source="description" label="Descripción" multiline rows={3} fullWidth />
    </SimpleForm>
  </Create>
)

// Componente interno para el formulario de edición con acceso al contexto
const TeamEditForm = () => {
  const [showBanner, setShowBanner] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const record = useRecordContext()
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const refresh = useRefresh()

  const handleDeleteImage = async () => {
    if (!record?.id) return

    // Cerrar el diálogo inmediatamente
    setConfirmOpen(false)
    
    // Optimistic update - ocultar el banner inmediatamente
    setShowBanner(false)
    notify('Eliminando banner...', { type: 'info' })

    try {
      // Llamar al backend de forma asíncrona (sin bloquear la UI)
      dataProvider.update('teams', {
        id: record.id,
        data: { bannerUrl: null },
        previousData: record,
      }).then(() => {
        notify('Banner eliminado correctamente', { type: 'success' })
        refresh()
      }).catch((error) => {
        console.error('Error al eliminar el banner:', error)
        notify('Error al eliminar el banner', { type: 'error' })
        // Revertir el cambio visual en caso de error
        setShowBanner(true)
      })
    } catch (error) {
      console.error('Error al eliminar el banner:', error)
      notify('Error al eliminar el banner', { type: 'error' })
      setShowBanner(true)
    }
  }

  return (
    <>
      <TextInput source="name" label="Nombre del Equipo" required fullWidth />
      <TextInput source="slug" label="Slug (URL amigable)" helperText="Ej: dota-2, street-fighter" fullWidth />

      {/* Banner actual con botón de eliminar */}
      {record?.bannerUrl && showBanner && (
        <Box position="relative" display="block" width="fit-content" mb={2}>
          <ImageField source="bannerUrl" label="Banner Actual" sx={{ width: 180, height: 100, borderRadius: 2, boxShadow: 1 }} />
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
            title="Eliminar banner"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <ImageInput 
        source="banner" 
        label="Nuevo Banner del Equipo" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      <TextInput source="description" label="Descripción" multiline rows={3} fullWidth />

      {/* Diálogo de confirmación */}
      <Confirm
        isOpen={confirmOpen}
        title="Eliminar banner"
        content="¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer."
        onConfirm={handleDeleteImage}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

// Formulario de edición de equipos
export const TeamEdit = () => (
  <Edit>
    <SimpleForm>
      <TeamEditForm />
    </SimpleForm>
  </Edit>
)

// Vista detallada de equipos
export const TeamShow = () => (
  <Show>
    <SimpleShowLayout>
      <ImageField source="bannerUrl" label="Banner" />
      <TextField source="name" label="Nombre del Equipo" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Descripción" />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
