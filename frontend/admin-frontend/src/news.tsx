import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  SimpleForm,
  TextInput,
  Edit,
  Show,
  SimpleShowLayout,
  DeleteButton,
  EditButton,
  ShowButton,
  CreateButton,
  TopToolbar,
  ExportButton,
  DateInput,
} from 'react-admin'

// Lista de noticias
export const NewsList = () => (
  <List
    actions={
      <TopToolbar>
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
  >
    <Datagrid>
      <TextField source="titulo" label="Título" />
      <DateField source="fecha" label="Fecha" />
      <TextField source="user" label="Autor" />
      <TextField source="comentario" label="Comentario" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

// Crear noticia
export const NewsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="titulo" label="Título" fullWidth />
      <DateInput source="fecha" label="Fecha" fullWidth />
      <TextInput source="comentario" label="Comentario" fullWidth multiline rows={3} />
    </SimpleForm>
  </Create>
)

// Editar noticia
export const NewsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="titulo" label="Título" fullWidth />
      <DateInput source="fecha" label="Fecha" fullWidth />
      <TextInput source="comentario" label="Comentario" fullWidth multiline rows={3} />
    </SimpleForm>
  </Edit>
)

// Ver noticia
export const NewsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="titulo" label="Título" />
      <DateField source="fecha" label="Fecha" />
      <TextField source="user" label="Autor" />
      <TextField source="comentario" label="Comentario" />
    </SimpleShowLayout>
  </Show>
)
