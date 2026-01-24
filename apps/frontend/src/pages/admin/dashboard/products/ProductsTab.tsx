import { useEffect, useState } from "react"
import ProductsTable from "./ProductsTable"
import ProductModal from "./ProductModal"
import type { ProductFormValues } from "./ProductForm"
import ProductForm from "./ProductForm"
import { Plus } from "lucide-react"

export type Product = {
  id: string
  title: string
  price: number     // cents
  quantity: number
  isActive: boolean
}

export default function ProductsTab() {
  // Fetch products
  // Hold state (products, loading, errors)
  // Control modal open/close
  // Decide whether in add or edit mode
  // Pass props down

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // dummy data for now
    setProducts([
      {
        id: "1",
        title: "Christmas Tree",
        price: 3050,
        quantity: 3,
        isActive: true
      },
      {
        id: "2",
        title: "Teddy Bear",
        price: 5000,
        quantity: 2,
        isActive: true
      },
    ])
    
    setLoading(false)
  }, [])

  function parseCurrency(currencyString: String) {
    const cleanedString = currencyString.replace(/[$,]/g, "")

    return Math.round(parseFloat(cleanedString) * 100)
  }

  // This function needs to be re-written to sync with backend rather
  // than add the new product manually to the frontend like this.
  function handleAddProduct(values: ProductFormValues) {
    const priceCents = parseCurrency(values.price)
    // const discountCents = values.discount ? parseCurrency(values.discount) : undefined

    const newProduct: Product = {
      id: Date.now().toString(),
      title: values.title,
      price: priceCents,
      quantity: values.quantity,
      isActive: values.isActive
    }

    setProducts((prev) => [...prev, newProduct])
    setIsModalOpen(false)
  }

  if (loading) return <p>Loading products...</p>
  // if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-2 px-5 py-2.5 
            bg-black text-white text-sm font-medium
            rounded-full hover:bg-gray-800 active:scale-95 
            transition-all shadow-sm
          "
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      <ProductsTable products={products} />

      <ProductModal
        open={isModalOpen}
        title="Add Product"
        onClose={() => setIsModalOpen(false)}
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsModalOpen(false)}
        />
      </ProductModal>
    </div>
  )
}