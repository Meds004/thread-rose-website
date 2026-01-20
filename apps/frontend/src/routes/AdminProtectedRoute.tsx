import { Navigate, Outlet } from "react-router-dom"
import { useAdminAuth } from "../hooks/useAdminAuth"

export function AdminProtectedRoute() {
  const { loading, isAuthenticated } = useAdminAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}