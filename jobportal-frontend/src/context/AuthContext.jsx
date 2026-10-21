import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";

export const AuthContext = createContext(null);

// How often a logged-in user's account status is re-checked (ms).
const SESSION_CHECK_MS = 15_000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await authService.me();
      setUser(me);
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedInUser } = await authService.login(credentials);
    localStorage.setItem("accessToken", token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: newUser } = await authService.register(payload);
    localStorage.setItem("accessToken", token);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // token may already be invalid/expired — clear local state regardless
    }
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  /** Merges a partial user update (e.g. after saving profile/company edits). */
  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // While logged in, re-check the account every so often (and whenever the tab
  // becomes visible again). A user who is just reading a page makes no API
  // calls, so without this an admin's block wouldn't reach them until their
  // next click. If the account is blocked, the 403 ACCOUNT_BLOCKED response is
  // handled by the interceptor in lib/axios.js, which redirects to /login.
  const isAuthenticated = Boolean(user);
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const check = () => {
      if (document.visibilityState === "visible") {
        authService.me().catch(() => {});
      }
    };

    const id = setInterval(check, SESSION_CHECK_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      bootstrap,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, bootstrap, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
