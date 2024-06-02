import React from 'react'

import { Product } from '@/payload-types'

// import classes from './index.module.scss'

export const RemoveFromCartButton: React.FC<{
  className?: string
  product: Product
}> = (props) => {
  const { className, product } = props

  return (
    <button
      type="button"
      // onClick={() => {
      //   deleteItemFromCart(product)
      // }}
      className={[
        className,
        // classes.removeFromCartButton
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Remove
    </button>
  )
}
