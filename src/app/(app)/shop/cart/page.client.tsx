import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Cart, Product } from '@payload-types'

import { CartSummary } from '../../_blocks/CartCheckout/CartSummary'
import { CartItems } from '../../_blocks/CartCheckout/CartItems'
import Loading from './loading'

type CartClientProps = {
  cart: Cart | null
}

const CartClient: React.FC<CartClientProps> = ({ cart }) => {
  // console.log('cartClient cart received ', cart)

  return (
    <React.Fragment>
      <CartItems />
      <CartSummary cart={cart} />
    </React.Fragment>
  )
}

export default CartClient
