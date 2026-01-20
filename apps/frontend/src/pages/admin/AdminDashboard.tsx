import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../hooks/useAdminAuth"

function SalesStats() {
  return <div className="p-4">Sales statistics content</div>
}

function Orders() {
  return <div className="p-4">View / modify orders</div>
}

function Products() {
  return <div className="p-4">Add / remove /modify products</div>
}

const TABS = [
  { id: "sales", label: "Sales Stats", component: SalesStats },
  { id: "orders", label: "Orders", component: Orders },
  { id: "products", label: "Products", component: Products }
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sales")
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component

  async function handleLogout() {
    await logout()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="w-full p-6">
      <h2 className="mb-4 text-2xl font-semibold">
        Admin Dashboard
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <nav className="flex gap-6" area-label="Dashboard Tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  "pb-1 text-sm font-medium transition-colors " +
                  (activeTab === tab.id
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700")
                }
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="text-sm pb-1 text-gray-500 hover:text-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}