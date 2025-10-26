import { DataProvider } from "react-admin";

// Unificamos ambos backends al servicio AdonisJS en 3333
// Backend A (auth/news/users) sin prefijo y Backend B (teams/players) bajo /api/v1
const API_BACKEND_A = "http://localhost:3333";
const API_BACKEND_B = "http://localhost:3333/api/v1";

const getBaseUrl = (resource: string) => {
  // news, users -> Backend A (auth/news/users)
  // teams, players -> Backend B (CRUD API)
  if (resource === "news" || resource === "users") return API_BACKEND_A;
  return API_BACKEND_B;
};

// Helper function to convert data with files to FormData
const convertFileToFormData = (data: any): FormData => {
  const formData = new FormData();

  // Check if there's a photo/banner file being uploaded
  const hasPhotoFile = data.photo && data.photo.rawFile instanceof File;
  const hasBannerFile = data.banner && data.banner.rawFile instanceof File;

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Check if value has a rawFile (file upload from ImageInput)
    if (value && typeof value === "object" && value.rawFile instanceof File) {
      formData.append(key, value.rawFile);
    } else if (value === null) {
      // Explicitly handle null values (for image deletion)
      formData.append(key, "null");
    } else if (value !== undefined) {
      // Skip photo_url/banner_url if we're uploading a new file
      if (
        (key === "photo_url" && hasPhotoFile) ||
        (key === "banner_url" && hasBannerFile)
      ) {
        return; // Don't send the URL when uploading a new file
      }

      // For non-file values, append as-is (don't stringify non-objects)
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};

// Check if data contains file uploads
const hasFileUpload = (data: any): boolean => {
  return Object.keys(data).some((key) => {
    const value = data[key];
    return value && typeof value === "object" && value.rawFile instanceof File;
  });
};

// Custom fetch function that handles JSON and errors
const httpClient = async (url: string, options: RequestInit = {}) => {
  console.log("=== httpClient Request ===");
  console.log("URL:", url);
  console.log("Options:", options);

  try {
    const token = localStorage.getItem("auth");
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      console.error("HTTP error! status:", response.status);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    console.log("Response JSON:", json);
    return { json };
  } catch (error) {
    console.error("=== httpClient Error ===");
    console.error("Error:", error);
    console.error("URL:", url);
    console.error("Options:", options);
    throw error;
  }
};

// Función para convertir los nombres de campos de AdonisJS a React Admin
const convertToReactAdmin = (resource: string, data: any) => {
  // Unwrap envelopes from Backend A create/update responses
  if (resource === "users" && data?.user) data = data.user;
  if (resource === "news" && data?.news) data = data.news;

  if (resource === "teams") {
    return {
      id: data.teamId,
      teamId: data.teamId,
      name: data.name,
      slug: data.slug,
      emoji: data.emoji,
      bannerUrl: data.bannerUrl,
      description: data.description,
      achievements: data.achievements,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  if (resource === "players") {
    return {
      id: data.playerId,
      playerId: data.playerId,
      name: data.name,
      age: data.age,
      role: data.role,
      country: data.country,
      instagram: data.instagram,
      teamId: data.teamId,
      team: data.team,
      bio: data.bio,
      stats: data.stats,
      photoUrl: data.photoUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  if (resource === "users") {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  if (resource === "news") {
    return {
      id: data.id,
      titulo: data.titulo,
      fecha: data.fecha,
      comentario: data.comentario,
      user: data.user, // Backend A ya transforma a string "username (email)" en index/show
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  return data;
};

// Función para convertir de React Admin a formato AdonisJS
const convertFromReactAdmin = (resource: string, data: any) => {
  const converted = { ...data };

  // Remover campos que no deberían enviarse
  delete converted.id;
  delete converted.createdAt;
  delete converted.updatedAt;
  delete converted.team;

  // Para players, el backend espera teamId en camelCase (no snake_case)
  // Solo necesitamos mantener el campo como está

  // Para players, mapear photoUrl a photo_url si existe
  if (resource === "players" && "photoUrl" in converted) {
    converted.photo_url = converted.photoUrl;
    delete converted.photoUrl;
  }

  // Para teams, mapear bannerUrl a banner_url si existe
  if (resource === "teams" && "bannerUrl" in converted) {
    converted.banner_url = converted.bannerUrl;
    delete converted.bannerUrl;
  }

  console.log("convertFromReactAdmin result:", converted);
  return converted;
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    // Para este ejemplo simplificado, no implementamos paginación completa
    const base = getBaseUrl(resource);
    const url = `${base}/${resource}`;

    try {
      const { json } = await httpClient(url);

      // Extraer los datos del formato de respuesta de AdonisJS
      const data = json.data || json;
      const convertedData = Array.isArray(data)
        ? data.map((item: any) => convertToReactAdmin(resource, item))
        : [];

      return {
        data: convertedData,
        total: convertedData.length,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      return { data: [], total: 0 };
    }
  },

  getOne: async (resource, params) => {
    const base = getBaseUrl(resource);
    const url = `${base}/${resource}/${params.id}`;

    try {
      const { json } = await httpClient(url);
      const data = json.data || json;

      return {
        data: convertToReactAdmin(resource, data),
      };
    } catch (error) {
      console.error(`Error fetching ${resource} ${params.id}:`, error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    // Para simplificar, hacemos múltiples llamadas getOne
    const base = getBaseUrl(resource);
    const promises = params.ids.map((id) =>
      httpClient(`${base}/${resource}/${id}`)
        .then(({ json }) => convertToReactAdmin(resource, json.data || json))
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    return {
      data: results.filter(Boolean),
    };
  },

  getManyReference: async (resource, params) => {
    // Para relaciones, por ahora retornamos lista completa
    return dataProvider.getList(resource, {
      ...params,
      filter: { ...params.filter, [params.target]: params.id },
    });
  },

  create: async (resource, params) => {
    const base = getBaseUrl(resource);
    const url = `${base}/${resource}`;
    const data = convertFromReactAdmin(resource, params.data);

    try {
      // Check if data contains file uploads (banner or photo)
      if (hasFileUpload(params.data)) {
        // Use FormData for file uploads
        const formData = convertFileToFormData(data);
        const token = localStorage.getItem("auth");

        const response = await fetch(url, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // DO NOT set Content-Type for FormData - browser sets it automatically with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const json = await response.json();
        const responseData = json.data || json;
        return {
          data: convertToReactAdmin(resource, responseData),
        };
      } else {
        // Use regular JSON for non-file uploads
        const { json } = await httpClient(url, {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = json.data || json;
        return {
          data: convertToReactAdmin(resource, responseData),
        };
      }
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },

  update: async (resource, params) => {
    const base = getBaseUrl(resource);
    const url = `${base}/${resource}/${params.id}`;
    const data = convertFromReactAdmin(resource, params.data);

    console.log("=== DataProvider Update ===");
    console.log("Resource:", resource);
    console.log("URL:", url);
    console.log("Params:", params);
    console.log("Original data:", params.data);
    console.log("Converted data:", data);

    try {
      const method =
        resource === "users" || resource === "news" ? "PUT" : "PATCH";

      // Check if data contains file uploads (banner or photo)
      if (hasFileUpload(params.data)) {
        // Use FormData for file uploads
        const formData = convertFileToFormData(data);
        const token = localStorage.getItem("auth");

        const response = await fetch(url, {
          method,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // DO NOT set Content-Type for FormData - browser sets it automatically with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const json = await response.json();
        console.log("Backend response:", json);
        const responseData = json.data || json;
        console.log("Response data:", responseData);

        const convertedResponse = convertToReactAdmin(resource, responseData);
        console.log("Converted response:", convertedResponse);

        return {
          data: convertedResponse,
        };
      } else {
        // Use regular JSON for non-file uploads
        const { json } = await httpClient(url, {
          method,
          body: JSON.stringify(data),
        });

        console.log("Backend response:", json);
        const responseData = json.data || json;
        console.log("Response data:", responseData);

        const convertedResponse = convertToReactAdmin(resource, responseData);
        console.log("Converted response:", convertedResponse);

        return {
          data: convertedResponse,
        };
      }
    } catch (error) {
      console.error(`Error updating ${resource}:`, error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    const base = getBaseUrl(resource);
    const promises = params.ids.map((id) =>
      httpClient(`${base}/${resource}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(convertFromReactAdmin(resource, params.data)),
      })
    );

    const results = await Promise.all(promises);
    return {
      data: results.map(({ json }) => json.data?.id || json.id),
    };
  },

  delete: async (resource, params) => {
    const base = getBaseUrl(resource);
    const url = `${base}/${resource}/${params.id}`;

    try {
      await httpClient(url, {
        method: "DELETE",
      });

      // Return the record that was deleted (React Admin expects the full record)
      return {
        data: (params.previousData || { id: params.id }) as any,
      };
    } catch (error) {
      console.error(`Error deleting ${resource}:`, error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    const base = getBaseUrl(resource);
    const promises = params.ids.map((id) =>
      httpClient(`${base}/${resource}/${id}`, {
        method: "DELETE",
      })
    );

    await Promise.all(promises);
    return {
      data: params.ids,
    };
  },
};
