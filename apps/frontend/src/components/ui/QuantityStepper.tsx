import { useRef, useEffect } from "react"
import { Plus, Minus } from "lucide-react"

interface StepperProps {
  value: number
  onChange: (newValue: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, min = 0, max = 999 }: StepperProps) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const update = (delta: number) => {
    onChange(Math.max(min, Math.min(max, (Number(value) || 0) + delta)))
  }

  // Logic for holding the button down
  const startCounter = (delta: number) => {
    update(delta) // run once immediately
    timerRef.current = setInterval(() => update(delta), 150) // then every 150ms
  }

  const stopCounter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Clean up timer if component unmounts
  useEffect(() => stopCounter, [])

  return (
    <div className="flex p-2 items-center overflow-hidden bg-white">
      <button
        aria-label="Decrease quantity"
        type="button"
        onMouseDown={() => startCounter(-1)}
        onMouseUp={stopCounter}
        onMouseLeave={stopCounter}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-black cursor-pointer hover:scale-105 active:bg-gray-700 transition-all select-none disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
      >
        <Minus size={20} strokeWidth={3} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const val = e.target.value
          if (val === "" || /^\d+$/.test(val)) {
            onChange(val === "" ? 0 : parseInt(val, 10))
          }
        }}
        onBlur={() => {
          if (!value) {
            onChange(min)
          } else {
            onChange(Math.min(value, max))
          }
          
        }}
        className="w-20 h-10 m-2 text-center border rounded-full focus:outline-none font-medium text-gray-800"
      />

      <button
        aria-label="Increase Quantity"
        type="button"
        onMouseDown={() => startCounter(1)}
        onMouseUp={stopCounter}
        onMouseLeave={stopCounter}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-black cursor-pointer hover:scale-105 active:bg-gray-700 transition-all select-none disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </div>
  )
}