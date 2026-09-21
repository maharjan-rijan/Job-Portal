import { useCallback, useState } from "react";

const STORAGE_KEY = "jobportal:currency";

function readStored() {
  if (typeof window === "undefined") return "USD";
  return localStorage.getItem(STORAGE_KEY) ?? "USD";
}

/**
 * Currency preference for displaying job salaries (USD/NPR), shared across
 * every job-listing page via localStorage — toggle it once on any page and
 * it stays set when you navigate to another.
 */
export function useCurrency() {
  const [currency, setCurrencyState] = useState(readStored);

  const setCurrency = useCallback((value) => {
    setCurrencyState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  return [currency, setCurrency];
}