'use client'
import CartItemDisplay from '@/app/(app)/_blocks/Cart/CartItemDisplay'
import { Button } from '@/app/(app)/_components/ui/button'
import { useCart } from '@/app/(app)/_providers/Cart'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'
import { AddressSchema } from '../../_providers/Cart/address'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const cartItemSchema = z.object({
  receiverId: z.string().min(1, 'Delivery address is required'),
  giftMessage: z.string().min(1, 'Gift Message is required'),
})

const formSchema = z.object({
  cartItems: z.array(cartItemSchema),
})

export type CartPersonalisationForm = z.infer<typeof formSchema>

const CartPersonalisePage = () => {
  const { cart } = useCart()
  const router = useRouter()
  const [errors, setErrors] = useState({})

  const methods = useForm({
    resolver: zodResolver(formSchema),
  })

  const Divider = () => (
    <div className="flex items-center gap-4 md:hidden">
      <div className="flex-1 h-px bg-slate-300" />
      <p className="text-muted-foreground text-sm text-slate-400">Next Item</p>
      <div className="flex-1 h-px bg-slate-300" />
    </div>
  )

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {cart.items?.map((item, index) => (
          <React.Fragment key={item.itemId}>
            <CartItemDisplay cartItem={item} index={index} />
            {index < cart.items!.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex flex-col items-end">
            <div className="text-right">
              <div className="text-base font-medium text-foreground">Total</div>
              <div className="text-4xl font-bold text-foreground">
                ${cart.totals.cost.toFixed(2)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            <div className="mt-4 w-full sm:w-64">
              <Button size="lg" className="rounded-full w-full" type="submit">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CartPersonalisePage
