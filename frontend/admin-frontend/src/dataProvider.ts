import { DataProvider } from 'react-admin'

const apiUrl = 'http://localhost:3333/api/v1'

// Custom fetch function that handles JSON and errors
const httpClient = async (url: string, options: RequestInit = {}) => {
  console.log('=== httpClient Request ===')
  console.log('URL:', url)
  console.log('Options:', options)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      console.error('HTTP error! status:', response.status)
      const errorText = await response.text()
      console.error('Error response body:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const json = await response.json()
    console.log('Response JSON:', json)
    return { json }
  } catch (error) {
    console.error('=== httpClient Error ===')
    console.error('Error:', error)
    console.error('URL:', url)
    console.error('Options:', options)
    throw error
  }
}

// Función para convertir los nombres de campos de AdonisJS a React Admin
const convertToReactAdmin = (resource: string, data: any) => {
  if (resource === 'teams') {
    return {
      id: data.teamId,
      teamId: data.teamId,
      name: data.name,
      description: data.description,
      achievements: data.achievements,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  if (resource === 'players') {
    return {
      id: data.playerId,
      playerId: data.playerId,
      name: data.name,
      teamId: data.teamId,
      team: data.team,
      bio: data.bio,
      stats: data.stats,
      photoUrl: data.photoUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  return data
}

// Función para convertir de React Admin a formato AdonisJS
const convertFromReactAdmin = (resource: string, data: any) => {
  const converted = { ...data }

  // Remover campos que no deberían enviarse
  delete converted.id
  delete converted.createdAt
  delete converted.updatedAt
  delete converted.team

  // Para players, mapear teamId a team_id si existe
  if (resource === 'players' && 'teamId' in converted) {
    converted.team_id = converted.teamId
    delete converted.teamId
  }

  // Para players, mapear photoUrl a photo_url si existe
  if (resource === 'players' && 'photoUrl' in converted) {
    converted.photo_url = converted.photoUrl
    delete converted.photoUrl
  }

  console.log('convertFromReactAdmin result:', converted)
  return converted
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    // Para este ejemplo simplificado, no implementamos paginación completa
    const url = `${apiUrl}/${resource}`

    try {
      const { json } = await httpClient(url)

      // Extraer los datos del formato de respuesta de AdonisJS
      const data = json.data || json
      const convertedData = Array.isArray(data)
        ? data.map((item: any) => convertToReactAdmin(resource, item))
        : []

      return {
        data: convertedData,
        total: convertedData.length,
      }
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error)
      return { data: [], total: 0 }
    }
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`

    try {
      const { json } = await httpClient(url)
      const data = json.data || json

      return {
        data: convertToReactAdmin(resource, data),
      }
    } catch (error) {
      console.error(`Error fetching ${resource} ${params.id}:`, error)
      throw error
    }
  },

  getMany: async (resource, params) => {
    // Para simplificar, hacemos múltiples llamadas getOne
    const promises = params.ids.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`)
        .then(({ json }) => convertToReactAdmin(resource, json.data || json))
        .catch(() => null)
    )

    const results = await Promise.all(promises)
    return {
      data: results.filter(Boolean),
    }
  },

  getManyReference: async (resource, params) => {
    // Para relaciones, por ahora retornamos lista completa
    return dataProvider.getList(resource, {
      ...params,
      filter: { ...params.filter, [params.target]: params.id },
    })
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`
    const data = convertFromReactAdmin(resource, params.data)

    try {
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const responseData = json.data || json
      return {
        data: convertToReactAdmin(resource, responseData),
      }
    } catch (error) {
      console.error(`Error creating ${resource}:`, error)
      throw error
    }
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`
    const data = convertFromReactAdmin(resource, params.data)

    console.log('=== DataProvider Update ===')
    console.log('Resource:', resource)
    console.log('URL:', url)
    console.log('Params:', params)
    console.log('Original data:', params.data)
    console.log('Converted data:', data)

    try {
      const { json } = await httpClient(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      console.log('Backend response:', json)
      const responseData = json.data || json
      console.log('Response data:', responseData)

      const convertedResponse = convertToReactAdmin(resource, responseData)
      console.log('Converted response:', convertedResponse)

      return {
        data: convertedResponse,
      }
    } catch (error) {
      console.error(`Error updating ${resource}:`, error)
      throw error
    }
  },

  updateMany: async (resource, params) => {
    const promises = params.ids.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(convertFromReactAdmin(resource, params.data)),
      })
    )

    const results = await Promise.all(promises)
    return {
      data: results.map(({ json }) => json.data?.id || json.id),
    }
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`

    try {
      await httpClient(url, {
        method: 'DELETE',
      })

      // Return the record that was deleted (React Admin expects the full record)
      return {
        data: (params.previousData || { id: params.id }) as any,
      }
    } catch (error) {
      console.error(`Error deleting ${resource}:`, error)
      throw error
    }
  },

  deleteMany: async (resource, params) => {
    const promises = params.ids.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
      })
    )

    await Promise.all(promises)
    return {
      data: params.ids,
    }
  },
}
