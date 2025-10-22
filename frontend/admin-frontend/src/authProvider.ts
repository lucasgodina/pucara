import type { AuthProvider } from "react-admin";

const AUTH_URL = "http://localhost:3333/api/v1";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Credenciales inválidas");
    }

    const data = await res.json();
    const token: string | undefined = data?.value;

    if (!token) throw new Error("No se recibió token");

    localStorage.setItem("auth", token);
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return Promise.resolve();
  },

  logout: async () => {
    const token = localStorage.getItem("auth");
    try {
      if (token) {
        await fetch(`${AUTH_URL}/auth/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // tolerante a fallos en logout del backend
    } finally {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
    }
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),

  checkError: (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        return Promise.resolve(userData.role || "user");
      } catch {
        return Promise.resolve("user");
      }
    }
    return Promise.resolve("user");
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        return Promise.resolve({
          id: userData.id,
          fullName: userData.fullName,
          avatar: undefined,
        });
      } catch {
        return Promise.resolve({ id: "me", fullName: "Usuario" });
      }
    }
    return Promise.resolve({ id: "me", fullName: "Usuario" });
  },
};
