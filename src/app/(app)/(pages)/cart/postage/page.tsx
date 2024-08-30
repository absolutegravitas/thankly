'use client'
import { CartItem } from '@/app/(app)/_blocks/Cart/cart-types'
import CartItemsTable from '@app/_blocks/Cart/CartItemsTable'
import PostagePicker from '@app/_components/PostagePicker'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/(app)/_components/ui/accordion'
import { Button } from '@/app/(app)/_components/ui/button'
import { IconProps } from '@/app/(app)/_icons/types'
import { transformToReceiverCarts } from '@/utilities/receiverCarts'
import { useCart } from '@app/_providers/Cart'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import SkeletonLoader from '../skeleton'
import CartTotals from '@/app/(app)/_blocks/Cart/CartTotals'

const postagePickerSchema = z.object({
  shippingMethod: z.string().min(1, 'Please select a postage method'),
})

const formSchema = z.object({
  shippingMethods: z.array(postagePickerSchema),
})

export type CartPostageForm = z.infer<typeof formSchema>

const CartPostagePage = () => {
  const { cart, hasInitializedCart, cartIsEmpty, cartPersonalisationMissing } = useCart()
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 639 })
  const methods = useForm({
    resolver: zodResolver(formSchema),
  })

  //loading and form prereq checks
  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty || cartPersonalisationMissing) return <CartRedirect />

  //get a transformed list of receiver with their own carts
  const receiverCarts = transformToReceiverCarts(cart)

  const onSubmit = (data: any) => {
    router.push('/cart/payment')
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          {receiverCarts.receivers?.map((receiverCart, index) => (
            <div key={index} className="flex flex-col-reverse sm:flex-row">
              <div className="px-4 py-2 sm:px-8 sm:py-0 sm:pb-4 basis-1/2">
                <PostagePicker receiverCart={receiverCart} index={index} />
              </div>
              <div className="basis-1/2 bg-thankly-palegreen">
                {isMobile ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="cart">
                      <AccordionTrigger className="w-full">
                        <div className="flex items-center gap-2 flex-1 px-2">
                          <span className="inline-block">
                            <GiftIcon className="h-5 w-5" />
                          </span>
                          <span className="flex-grow text-left">
                            Delivery for {receiverCart.firstName} {receiverCart.lastName}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <CartItemsTable receiverCart={receiverCart} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <GiftIcon className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        Delivery for {receiverCart.firstName} {receiverCart.lastName}
                      </span>
                    </div>
                    <CartItemsTable receiverCart={receiverCart} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-col-reverse sm:flex-row">
            <div className="p-4 basis-1/2 items-end">
              <div className="flex flex-col items-center">
                <div className="mt-4 w-full sm:w-64">
                  <Button size="lg" className="rounded-full w-full" type="submit">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 basis-1/2 bg-thankly-palegreen text-stone-800">
              <CartTotals cart={cart} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CartPostagePage

function GiftIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <path d="M20 12v10H4V12M2 7h20v5H2z" />
      <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C12 2 12 7 12 7z" />
    </svg>
  )
}
