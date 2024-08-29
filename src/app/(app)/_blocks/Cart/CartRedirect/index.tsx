'use client'
import { useCart } from '@/app/(app)/_providers/Cart'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  delayTime?: number // defaults to 3 seconds
}

const CartRedirect = ({ delayTime = 3000 }: Props) => {
  const router = useRouter()
  const { cartIsEmpty, cartPersonalisationMissing, cartPostageMissing } = useCart()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (cartIsEmpty) {
        router.push('/shop')
      } else if (cartPersonalisationMissing) {
        router.push('/cart')
      } else if (cartPostageMissing) {
        router.push('/cart/postage')
      }
    }, delayTime)

    return () => clearTimeout(timer)
  }, [cartIsEmpty, cartPersonalisationMissing, cartPostageMissing, router, delayTime])

  if (cartIsEmpty) {
    return (
      <p className="p-4 justify-items-center text-center">
        Oops! The cart appears to be empty. Let's jump over to the shop page. Hold tight...
      </p>
    )
  }

  if (cartPersonalisationMissing) {
    return (
      <p className="p-4 justify-items-center text-center">
        Oops! Looks like we need some additional details to personalise your gifts. Hold tight...
      </p>
    )
  }

  if (cartPostageMissing) {
    return (
      <p className="p-4 justify-items-center text-center">
        Oops! Looks like we need some additional postage details. Hold tight...
      </p>
    )
  }

  return null
}

export default CartRedirect
