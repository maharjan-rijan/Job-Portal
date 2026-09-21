import axios from "axios";

/**
 * Single axios instance for the whole app.
 * Every service module (src/services/*) should import this instead of
 * calling axios directly, so base URL, auth headers and error handling
 * stay in one place.
 */
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

// Normalize error shape so callers can rely on `error.message` and
// `error.status` (the raw axios error's `.response.status` is lost once
// we reject with a plain Error, so we re-attach it here for anyone
// downstream who needs to branch on the status code, e.g. treating a
// 404 on a "my resource" endpoint as "doesn't exist yet" rather than
// a real error).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";

    const normalized = new Error(message);
    normalized.status = error.response?.status ?? null;
    return Promise.reject(normalized);
  }
);

export default api;
