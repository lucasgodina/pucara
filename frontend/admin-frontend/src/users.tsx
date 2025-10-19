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
  SelectInput,
} from 'react-admin'

// Lista de usuarios (solo admin)
export const UserList = () => (
  <List
    actions={
      <TopToolbar>
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
  >
    <Datagrid>
      <TextField source="username" label="Usuario" />
      <TextField source="email" label="Email" />
      <TextField source="role" label="Rol" />
      <DateField source="createdAt" label="Creado" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

// Crear usuario (solo admin)
export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" label="Usuario" fullWidth required />
      <TextInput source="email" label="Email" type="email" fullWidth required />
      <TextInput source="password" label="Contraseña" type="password" fullWidth required />
      <SelectInput
        source="role"
        label="Rol"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'editor', name: 'Editor' },
          { id: 'user', name: 'Usuario' },
        ]}
        fullWidth
        required
      />
    </SimpleForm>
  </Create>
)

// Editar usuario (solo admin)
export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" label="Usuario" fullWidth />
      <TextInput source="email" label="Email" type="email" fullWidth />
      <SelectInput
        source="role"
        label="Rol"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'editor', name: 'Editor' },
          { id: 'user', name: 'Usuario' },
        ]}
        fullWidth
      />
      {/* Campo de contraseña opcional para resetear */}
      <TextInput source="password" label="Nueva Contraseña (opcional)" type="password" fullWidth />
    </SimpleForm>
  </Edit>
)

// Ver usuario
export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="username" label="Usuario" />
      <TextField source="email" label="Email" />
      <TextField source="role" label="Rol" />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
