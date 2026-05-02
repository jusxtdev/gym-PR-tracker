import { type ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "@/providers/auth-provider"

export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/prs" replace />
  }

  return children
}
