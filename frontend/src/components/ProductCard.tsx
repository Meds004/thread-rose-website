import React from "react"
import { motion } from "framer-motion"

export interface ProductCardProps {
  id: string
  title: string
  price: number
  imageUrl: string
  quantityAvailable: number
  onClick?: (id: String) => void;
}

const formatPrice = (value: number) => {
  const formatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value)

  return `CAD ${formatted}`
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  imageUrl,
  quantityAvailable,
  onClick,
}) => {
  const isSoldOut = quantityAvailable <= 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250 }}
      onClick={() => onClick?.(id)}
      className="cursor-pointer"
    >
      
    </motion.div>
  )
}

