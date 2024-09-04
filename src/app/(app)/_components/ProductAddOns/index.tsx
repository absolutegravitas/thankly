import { Product } from '@/payload-types'
import React from 'react'

interface Props {
  addOns?: (number | Product)[] | null
}

const ProductAddOns = ({ addOns }: Props) => {
  if (!addOns || addOns.length <= 0) {
    return null
  }

  return (
    <div className="text-sm py-2">
      Extras
      <ul className="list-disc pl-6">
        {addOns
          .filter((addon) => typeof addon === 'object')
          .map((addon, index) => (
            <li key={index}>{`${addon.title} (+$${addon.prices.basePrice})`}</li>
          ))}
      </ul>
    </div>
  )
}

export default ProductAddOns
