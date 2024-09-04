'use client'
import CartItemDisplay from '@/app/(app)/_blocks/Cart/CartItemDisplay'
import { Button } from '@/app/(app)/_components/ui/button'
import { useCart } from '@/app/(app)/_providers/Cart'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'
import { FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CartRedirect from '../../_blocks/Cart/CartRedirect'
import SkeletonLoader from './skeleton'
import { Loader2 } from 'lucide-react'

const cartItemSchema = z.object({
  receiverId: z.string().min(1, 'Delivery address is required'),
  giftMessage: z
    .string()
    .min(1, 'Please enter a message for the hand written gift card')
    .max(400, 'Gift message cannot be longer than 400 characters'),
})

const formSchema = z.object({
  cartItems: z.array(cartItemSchema),
})

export type CartPersonalisationForm = z.infer<typeof formSchema>

const CartPersonalisePage = () => {
  const { cart, cartIsEmpty, hasInitializedCart } = useCart()
  const router = useRouter()
  const methods = useForm({
    resolver: zodResolver(formSchema),
  })
  const {
    handleSubmit,
    formState: { isValidating, isSubmitting },
  } = methods

  const onSubmit = (data: any) => {
    router.push('/cart/postage')
  }

  //loading and form prereq checks
  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty) return <CartRedirect />

  const Divider = () => (
    <div className="flex items-center gap-4 md:hidden">
      <div className="flex-1 h-px bg-slate-300" />
      <p className="text-muted-foreground text-sm text-slate-400">Next Item</p>
      <div className="flex-1 h-px bg-slate-300" />
    </div>
  )

  return (
    <div className="px-4 sm:px-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <Button
                  size="lg"
                  className="rounded-full w-full"
                  type="submit"
                  disabled={isSubmitting || isValidating}
                >
                  {isSubmitting || isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default CartPersonalisePage
