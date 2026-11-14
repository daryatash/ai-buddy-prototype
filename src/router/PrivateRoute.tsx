import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"

type PrivateRouteProps = {
  children: ReactNode,
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const currentUser = useAuthStore(state => state.currentUser)

  if (!currentUser) return <Navigate to="/" replace />

  return <>{children}</>
}