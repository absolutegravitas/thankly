'use client'
import CartItemDisplay from '@/app/(app)/_blocks/Cart/CartItem'
import { Button } from '@/app/(app)/_components/ui/button'
import { useCart } from '@/app/(app)/_providers/Cart'
import React from 'react'

const CartPersonalisePage = () => {
  const { cart } = useCart()

  const Divider = () => (
    <div className="flex items-center gap-4 md:hidden">
      <div className="flex-1 h-px bg-slate-300" />
      <p className="text-muted-foreground text-sm text-slate-400">Next Item</p>
      <div className="flex-1 h-px bg-slate-300" />
    </div>
  )

  return (
    <div>
      {cart.items?.map((item, index) => (
        <React.Fragment key={item.itemId}>
          <CartItemDisplay cartItem={item} />
          {index < cart.items!.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex flex-col items-end">
          <div className="text-right">
            <div className="text-base font-medium text-foreground">Total</div>
            <div className="text-4xl font-bold text-foreground">${cart.totals.cost.toFixed(2)}</div>
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
