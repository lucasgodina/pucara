import type { AuthProvider } from 'react-admin'

const AUTH_URL = 'http://localhost:3333'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    })

    if (!res.ok) throw new Error('Credenciales inválidas')

    const data = await res.json()
    const token: string | undefined = data?.token?.token
    if (!token) throw new Error('No se recibió token')

    localStorage.setItem('auth', token)
    if (data?.user?.role) localStorage.setItem('userRole', data.user.role)

    return Promise.resolve()
  },

  logout: async () => {
    const token = localStorage.getItem('auth')
    try {
      if (token) {
        await fetch(`${AUTH_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch {
      // tolerante a fallos en logout del backend
    } finally {
      localStorage.removeItem('auth')
      localStorage.removeItem('userRole')
    }
    return Promise.resolve()
  },

  checkAuth: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),

  checkError: (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem('auth')
      localStorage.removeItem('userRole')
      return Promise.reject()
    }
    return Promise.resolve()
  },

  getPermissions: () => {
    const role = localStorage.getItem('userRole')
    return role ? Promise.resolve(role) : Promise.reject()
  },

  getIdentity: async () => {
    // opcional: podrías llamar a /profile en 3333 para datos del usuario
    return Promise.resolve({ id: 'me', fullName: 'Authenticated User' })
  },
}
