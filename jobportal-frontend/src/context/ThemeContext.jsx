import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export const ThemeContext = createContext(null);

// "system" follows the device's light/dark setting live; "light"/"dark"
// are explicit overrides. A new key (not the old "theme" one) so people
// who toggled once under the previous version go back to following their
// device instead of being stuck on whatever they last clicked.
const STORAGE_KEY = "theme-preference";
const QUERY = "(prefers-color-scheme: dark)";

function readPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored;
  } catch {
    /* storage blocked — fall through to default */
  }
  return "system";
}

function systemTheme() {
  return window.matchMedia(QUERY).matches ? "dark" : "light";
}

/**
 * One source of truth for the theme, mounted once at the app root so every
 * page (public, auth, dashboard, admin) shares it. It writes the resolved
 * "light" | "dark" to <html data-theme="…">, which index.css already
 * uses to swap the colour tokens.
 */
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference);
  const [systemIsDark, setSystemIsDark] = useState(
    () => systemTheme() === "dark",
  );

  // Track the device setting live (e.g. OS switches to dark at sunset).
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (event) => setSystemIsDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme =
    preference === "system" ? (systemIsDark ? "dark" : "light") : preference;

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      /* ignore */
    }
  }, [preference]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setPreference(readPreference());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ preference, theme, setPreference, toggleTheme }),
    [preference, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
