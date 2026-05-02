import { StrictMode } from "react"

import App from "@/App.tsx"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/providers/auth-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import "@fontsource-variable/geist/wght.css"
import "./index.css"

export function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Toaster richColors position="top-center" closeButton />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
