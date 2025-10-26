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
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
} from 'react-admin'

// Componente para mostrar el rol con color
const RoleField = ({ record }: { record?: any }) => {
  if (!record?.role) return <span>-</span>

  const getColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'editor':
        return 'primary'
      case 'user':
        return 'success'
      default:
        return 'default'
    }
  }

  return <Chip label={record.role.toUpperCase()} color={getColor(record.role)} size="small" />
}

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
      <TextField source="fullName" label="Nombre Completo" />
      <FunctionField label="Rol" render={(record: any) => <RoleField record={record} />} />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Última Act." showTime />
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
      <TextField source="fullName" label="Nombre Completo" />
      <FunctionField label="Rol" render={(record: any) => <RoleField record={record} />} />
      <DateField source="createdAt" label="Creado" showTime />
      <DateField source="updatedAt" label="Actualizado" showTime />
    </SimpleShowLayout>
  </Show>
)
