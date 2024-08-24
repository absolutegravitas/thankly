'use client'
import CartItemDisplay from '@/app/(app)/_blocks/Cart/CartItem'
import { Button } from '@/app/(app)/_components/ui/button'
import { useCart } from '@/app/(app)/_providers/Cart'
import React from 'react'

const CartPersonalisePage = () => {
  const { cart } = useCart()

  return (
    <div className="container p-4">
      {cart.items?.map((item) => <CartItemDisplay key={item.itemId} cartItem={item} />)}
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex flex-col items-end">
          <div className="text-right">
            <div className="text-base font-medium text-foreground">Total</div>
            <div className="text-4xl font-bold text-foreground">${cart.totals.cost}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
          </div>
          <div className="mt-4 w-full sm:w-64">
            <Button size="lg" className="rounded-full w-full">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPersonalisePage
