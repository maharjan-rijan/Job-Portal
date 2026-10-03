import { createContext, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "jobportal:currency";

function readStored() {
  if (typeof window === "undefined") return "USD";
  return localStorage.getItem(STORAGE_KEY) ?? "USD";
}

export const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(readStored);

  const setCurrency = useCallback((value) => {
    setCurrencyState(value);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={[currency, setCurrency]}>
      {children}
    </CurrencyContext.Provider>
  );
}
