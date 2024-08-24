import React from 'react'
import CartItemPersonaliser from '@app/_blocks/Cart/CartItemPersonaliser'
import ProductCard from '@app/_blocks/Cart/ProductCard'
import { CartItem } from '@app/_blocks/Cart/cart-types'
import { useCart } from '@app/_providers/Cart'

interface Props {
  cartItem: CartItem
}

const CartItemDisplay = ({ cartItem }: Props) => {
  const { updateQuantity } = useCart()

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    updateQuantity(cartItemId, quantity)
  }

  return (
    <div
      key={cartItem.itemId}
      className="flex flex-col items-center md:flex-row md:justify-center md:space-x-4 space-y-4 md:space-y-0 max-w-6xl mx-auto pb-4"
    >
      <div className="w-[240px] md:w-auto md:flex-shrink-0">
        <ProductCard cartItem={cartItem} onQuantityChange={handleQuantityChange} />
      </div>
      {/* <div className="w-full md:flex-grow"> */}
      <div className="w-full md:w-[730px]">
        <CartItemPersonaliser cartItem={cartItem} />
      </div>
    </div>
  )
}

export default CartItemDisplay
