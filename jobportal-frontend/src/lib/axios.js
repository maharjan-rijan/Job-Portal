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

let redirectingToLogin = false;

// The admin blocked this account while the user was logged in. Drop the token
// and do a full-page redirect to /login — a hard navigation also clears every
// in-memory piece of state (auth user, React Query cache) in one go, and works
// from anywhere (this file has no access to the router or React context).
function endBlockedSession() {
  localStorage.removeItem("accessToken");
  if (redirectingToLogin || window.location.pathname === "/login") return;
  redirectingToLogin = true;
  window.location.replace("/login?blocked=1");
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }

    // Set by CheckUserBlockUnblock (backend) on any request from a blocked user.
    // On /login itself the same code just means "login refused" — the form
    // shows the server message, so no redirect there.
    if (error.response?.data?.code === "ACCOUNT_BLOCKED") {
      endBlockedSession();
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
