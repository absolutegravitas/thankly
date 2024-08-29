'use client'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import { useCart } from '@/app/(app)/_providers/Cart'
import React from 'react'

const CartPaymentPage = () => {
  const { cart, cartIsEmpty, cartPersonalisationMissing, cartPostageMissing } = useCart()

  if (cartIsEmpty || cartPersonalisationMissing || cartPostageMissing) {
    return <CartRedirect />
  }

  return <div>CartPaymentPage</div>
}

export default CartPaymentPage
