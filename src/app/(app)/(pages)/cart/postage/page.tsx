'use client'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import ProductThumbnail from '@/app/(app)/_blocks/Cart/ProductThumbnail'
import PostagePicker from '@/app/(app)/_components/PostagePicker'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/(app)/_components/ui/accordion'
import { IconProps } from '@/app/(app)/_icons/types'
import { useCart } from '@app/_providers/Cart'
import { ImageProps } from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useMediaQuery } from 'react-responsive'

const CartPostagePage = () => {
  const { cart } = useCart()
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 639 })

  const CartContent = () => (
    <>{cart.items && <CartItemsTable cartItems={cart.items} shipping={15.5} />}</>
  )

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col-reverse sm:flex-row">
          <div className="basis-1/2">
            <PostagePicker />
          </div>
          <div className="basis-1/2 bg-stone-200">
            {isMobile ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cart">
                  <AccordionTrigger className="flex items-center gap-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Cart for John Doe
                  </AccordionTrigger>
                  <AccordionContent>
                    <CartContent />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCartIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Cart</h2>
                </div>
                <CartContent />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPostagePage

function ShoppingCartIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
