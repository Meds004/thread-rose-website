import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../hooks/useAdminAuth"
import type { Admin } from "../../context/AdminAuthContext"

export function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { admin, refreshAdmin } = useAdminAuth()

  useEffect(() => {
    if (admin) {
      navigate("/admin", { replace: true })
    }
  }, [admin, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ username, password })
        }
      )

      if (!res.ok) {
        throw new Error("Invalid credentials")
      }

      const adminData: Admin = await res.json()
      await refreshAdmin(adminData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex py-8 justify-center">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h1>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600">{error}</p>}

          <button 
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  )
}