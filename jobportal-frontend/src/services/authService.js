import api from "@/lib/axios";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials).then((r) => r.data),

  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),

  changePassword: (payload) =>
    api.post("/auth/change-password", payload).then((r) => r.data),
};
