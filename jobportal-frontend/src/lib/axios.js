import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored access token, if any, to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }

    const errors = error.response?.data?.errors ?? null;
    const firstFieldError = errors ? Object.values(errors)[0]?.[0] : null;

    const message =
      firstFieldError ??
      error.response?.data?.message ??
      error.message ??
      "Something went wrong";

    const normalized = new Error(message);
    normalized.status = error.response?.status ?? null;
    normalized.errors = errors;
    return Promise.reject(normalized);
  },
);

export default api;
