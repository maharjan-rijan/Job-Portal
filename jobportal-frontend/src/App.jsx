import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { router } from "@/routes";

export function App() {
  // Applies the shared theme (device default / user's saved choice) to
  // every page, not just the ones that show a theme toggle.
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
