import { useEffect, useState } from "react"
import { AdminAuthContext } from "./AdminAuthContext"
import type { Admin } from "./AdminAuthContext"

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  async function adminFetch(
    input: RequestInfo,
    init: RequestInit = {}
  ) {
    const res = await fetch(input, {
      ...init,
      credentials: "include"
    })

    if (res.status === 401) {
      setAdmin(null)
      throw new Error("Unauthorized")
    }

    return res
  }

  async function refreshAdmin(admin?: Admin) {
    if (admin) {
      setAdmin(admin)
      return
    }

    try {
      const res = await adminFetch(
        "http://localhost:4000/api/admin/me",
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   }
        // }
      )
      const data = await res.json()
      setAdmin(data)
    } catch (error) {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await fetch(
      "http://localhost:4000/api/admin/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      }
    )
    setAdmin(null)
  }

  useEffect(() => {
    refreshAdmin()
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        refreshAdmin,
        logout,
        adminFetch
      }}
      >
        {children}
      </AdminAuthContext.Provider>
  )
}
