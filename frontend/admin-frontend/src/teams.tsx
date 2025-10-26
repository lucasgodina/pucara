import {
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
  TopToolbar
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

// Formulario de edición de equipos
export const TeamEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nombre del Equipo" required fullWidth />
      <TextInput source="slug" label="Slug (URL amigable)" helperText="Ej: dota-2, street-fighter" fullWidth />
      
      <ImageField source="bannerUrl" label="Banner Actual" />
      
      <ImageInput 
        source="banner" 
        label="Nuevo Banner del Equipo" 
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        maxSize={10000000}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      
      <TextInput source="description" label="Descripción" multiline rows={3} fullWidth />
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
