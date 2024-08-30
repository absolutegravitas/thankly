'use client'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import { useCart } from '@/app/(app)/_providers/Cart'
import React from 'react'
import SkeletonLoader from '../skeleton'

const CartPaymentPage = () => {
  const { cart, hasInitializedCart, cartIsEmpty, cartPersonalisationMissing, cartPostageMissing } =
    useCart()

  //loading and form prereq checks
  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty || cartPersonalisationMissing || cartPostageMissing) return <CartRedirect />

  return <div>CartPaymentPage</div>
}

export default CartPaymentPage
