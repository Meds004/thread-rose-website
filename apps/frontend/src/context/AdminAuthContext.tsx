import { createContext } from "react"

export interface Admin {
  id: string
  username: string
}

export interface AdminAuthContextType {
  admin: Admin | null
  loading: boolean
  isAuthenticated: boolean
  refreshAdmin: (admin?: Admin) => Promise<void>
  logout: () => Promise<void>
  adminFetch: (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>
}

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null)