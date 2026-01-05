import { useState } from "react"

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("sales")

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-semibold">
        Admin Dashboard
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6" area-label="Dashboard Tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                "pb-2 text-sm font-medium transition-colors " +
                (activeTab === tab.id
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700")
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}