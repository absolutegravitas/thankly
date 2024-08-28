'use client'
import { CartItem } from '@/app/(app)/_blocks/Cart/cart-types'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import PostagePicker from '@/app/(app)/_components/PostagePicker'
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
import React from 'react'
import { useMediaQuery } from 'react-responsive'

const CartPostagePage = () => {
  const { cart } = useCart()
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 639 })

  //get a transformed list of receiver with their own carts
  const receiverCarts = transformToReceiverCarts(cart)

  return (
    <>
      <div className="flex flex-col">
        {receiverCarts.receivers?.map((receiver, index) => (
          <div key={index} className="flex flex-col-reverse sm:flex-row">
            <div className="p-4 sm:p-8 basis-1/2">
              <PostagePicker receiverId={receiver.receiverId} />
            </div>
            <div className="basis-1/2 bg-stone-200">
              {isMobile ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cart">
                    <AccordionTrigger className="w-full">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="inline-block">
                          <GiftIcon className="h-5 w-5" />
                        </span>
                        <span className="flex-grow text-left">
                          Gifts for {receiver.firstName} {receiver.lastName}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CartItemsTable cartItems={receiver.items} shipping={0} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <GiftIcon className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">
                      Gifts for {receiver.firstName} {receiver.lastName}
                    </h2>
                  </div>
                  <CartItemsTable
                    cartItems={receiver.items}
                    shipping={receiver.delivery?.shippingPrice ?? 0}
                  />
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
          <div className="p-4 basis-1/2 bg-stone-200 text-stone-800">
            <div className="border border-t-stone-400 border-b-stone-400 px-4 text-lg font-medium">
              <div className="flex flex-row py-2">
                <div className="flex flex-col basis-1/2">Subtotal:</div>
                <div className="flex flex-col basis-1/2 items-end">
                  ${cart.totals.cost.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-row pb-3">
                <div className="flex flex-col basis-1/2">Postage:</div>
                <div className="flex flex-col basis-1/2 items-end">
                  ${cart.totals.shipping.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex flex-row pb-3 p-4 text-3xl font-bold">
              <div className="flex flex-col basis-1/2">Total:</div>
              <div className="flex flex-col basis-1/2 items-end">
                ${cart.totals.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
