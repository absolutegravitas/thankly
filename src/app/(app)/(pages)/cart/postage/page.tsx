'use client'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import ProductThumbnail from '@/app/(app)/_blocks/Cart/ProductThumbnail'
import { useCart } from '@app/_providers/Cart'
import { useRouter } from 'next/navigation'
import React from 'react'

const CartPostagePage = () => {
  const { cart } = useCart()
  const router = useRouter()

  return (
    <>
      <div>
        {/* {cart.items?.map((item, index) =>  */}
        {cart.items && <CartItemsTable cartItems={cart.items} shipping={15.5} />}
      </div>
    </>
  )
}

export default CartPostagePage
