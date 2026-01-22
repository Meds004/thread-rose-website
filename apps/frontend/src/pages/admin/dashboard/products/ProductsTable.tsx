import type { Product } from "./ProductsTab"

type Props = {
  products: Product[]
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function ProductsTable({ products }: Props) {
  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-2">Title</th>
          <th className="text-left p-2">Price</th>
          <th className="text-left p-2">Quantity</th>
          <th className="text-left p-2">Status</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t border-gray-300">
            <td className="p-2">{product.title}</td>
            <td className="p-2">{formatPrice(product.price)}</td>
            <td className="p-2">{product.quantity}</td>
            <td className="p-2">{product.isActive ? "Active" : "Inactive"}</td>
            <td className="p-2 text-right">
              <button className="text-blue-600 hover:underline">
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}