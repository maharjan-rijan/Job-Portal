import { useCallback, useSyncExternalStore } from "react";
const STORAGE_KEY = "theme-choice";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

function readChoice() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

let choice = readChoice();

const resolve = () => choice ?? (media.matches ? "dark" : "light");

function update() {
  document.documentElement.setAttribute("data-theme", resolve());
  listeners.forEach((listener) => listener());
}

function setChoice(next) {
  choice = next;
  try {
    if (next) localStorage.setItem(STORAGE_KEY, next);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage blocked — still works for this session */
  }
  update();
}

// Apply right away, then keep in sync with the device and other tabs.
document.documentElement.setAttribute("data-theme", resolve());
media.addEventListener("change", update);
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    choice = readChoice();
    update();
  }
});

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, resolve);
  const preference = useSyncExternalStore(subscribe, () => choice ?? "system");

  const toggleTheme = useCallback(() => {
    setChoice(resolve() === "dark" ? "light" : "dark");
  }, []);

  const setPreference = useCallback((value) => {
    setChoice(value === "light" || value === "dark" ? value : null);
  }, []);

  return { theme, preference, toggleTheme, setPreference };
}
