import { useState } from "react";
import { QuantityStepper } from "../../../../components/ui/QuantityStepper";

export type ProductFormValues = {
  title: string
  subtitle?: string
  description: string
  price: string         // dollars
  discount: string     // dollars
  quantity: number
  isActive: boolean
  images: string[]
}

type Props = {
  initialValues?: ProductFormValues
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
}

export default function ProductForm({
  initialValues,
  onSubmit,
  onCancel
}: Props) {
  const [values, setValues] = useState<ProductFormValues>({
    title: initialValues?.title ?? "",
    subtitle: initialValues?.subtitle ?? "",
    description: initialValues?.description ?? "",
    price: initialValues?.price ?? "",
    discount: initialValues?.discount ?? "",
    quantity: initialValues?.quantity ?? 1,
    isActive: initialValues?.isActive ?? true,
    images: initialValues?.images ?? []
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target

    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }))
  }

  function handleCurrencyChange(
    value: string,
    field: "price" | "discount"
  ) {
    const currencyRegex = /^\d*\.?\d{0,2}$/

    const raw = value.replace("$", "")

    if (!currencyRegex.test(raw)) {
      return
    }

    setValues((prev) => ({
      ...prev,
      [field]: `$${raw}`
    }))
  }

  function formatCurrency(value: string): string {
    if (!value) return ""

    value = value.replace("$", "")

    const number = Number(value)
    if (isNaN(number)) return ""

    return `$${number.toFixed(2)}`
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({
      ...prev,
      isActive: e.target.checked
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          required
          className="w-full border rounded-full px-3 py-2"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium">Subtitle</label>
        <input
          name="subtitle"
          value={values.subtitle}
          onChange={handleChange}
          className="w-full border rounded-full px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          required
          className="w-full resize-none border rounded-3xl px-3 py-2"
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Price (CAD)</label>
          <input
            type="text"
            inputMode="decimal"
            name="price"
            placeholder="$0.00"
            value={values.price}
            onChange={(e) => handleCurrencyChange(e.target.value, "price")}
            onBlur={() =>
              setValues((prev) => ({
                ...prev,
                price: formatCurrency(prev.price)
              }))
            }
            className="w-full border rounded-full px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Discount (CAD)
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="discount"
            placeholder="$0.00"
            value={values.discount ?? ""}
            onChange={(e) => handleCurrencyChange(e.target.value, "discount")}
            onBlur={() =>
              setValues((prev) => ({
                ...prev,
                discount: formatCurrency(prev.discount)
              }))
            }
            className="w-full border rounded-full px-3 py-2"
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <QuantityStepper
          value={values.quantity}
          onChange={(newVal) => setValues((prev) => ({...prev, quantity: newVal}))}
        />
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <label>Active:</label>
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={handleCheckboxChange}
          className="
            appearance-none w-5 h-5 border-2 border-gray-300 rounded 
            checked:bg-black checked:border-black
            cursor-pointer transition-all relative
            after:content-[''] after:absolute after:opacity-0 checked:after:opacity-100
            after:left-[5px] after:top-[1px] after:w-[6px] after:h-[10px] 
            after:border-white after:border-r-2 after:border-b-2 after:rotate-45
          "
        />
      </div>

      {/* Images (stub) */}
      <div>
        <label className="block text-sm font-medium">
          Product Images (coming soon)
        </label>
        <div className="border border-dashed rounded p-4 text-sm text-gray-500">
          Image upload will be implemented later.
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 w-24 border rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 w-24 bg-black text-white rounded-full"
        >
          Save
        </button>
      </div>
    </form>
  )
}