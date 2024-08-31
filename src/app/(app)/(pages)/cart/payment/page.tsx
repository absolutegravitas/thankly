'use client'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import { useCart } from '@/app/(app)/_providers/Cart'
import React from 'react'
import SkeletonLoader from '../skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/(app)/_components/ui/accordion'
import { IconProps } from '@/app/(app)/_icons/types'
import { useMediaQuery } from 'react-responsive'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import { ReceiverCarts, transformToReceiverCarts } from '@/utilities/receiverCarts'
import CartTotals from '@/app/(app)/_blocks/Cart/CartTotals'
import DiscountCode from '@/app/(app)/_components/DiscountCode'

const CartPaymentPage = () => {
  const { cart, hasInitializedCart, cartIsEmpty, cartPersonalisationMissing, cartPostageMissing } =
    useCart()
  const isMobile = useMediaQuery({ maxWidth: 639 })

  //loading and form prereq checks
  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty || cartPersonalisationMissing || cartPostageMissing) return <CartRedirect />

  //get a transformed list of receiver with their own carts
  const receiverCarts = transformToReceiverCarts(cart)

  interface OrderSummaryProps {
    receiverCarts: ReceiverCarts
  }
  const OrderSummary: React.FC<OrderSummaryProps> = ({ receiverCarts }) => {
    return (
      <>
        {receiverCarts.receivers?.map((receiverCart, index) => (
          <CartItemsTable
            key={receiverCart.id || index}
            receiverCart={receiverCart}
            showDetails={true}
            showDeliveryAddress={true}
          />
        ))}
      </>
    )
  }

  return (
    <form>
      <div className="flex flex-col sm:flex-row">
        <div className="basis-1/2">left</div>
        <div className="basis-1/2 bg-thankly-palegreen">
          {isMobile ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cart">
                <AccordionTrigger className="w-full">
                  <div className="flex items-center gap-2 flex-1 px-2">
                    <span className="flex-grow text-left text-lg font-bold">Summary of order</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <OrderSummary receiverCarts={receiverCarts} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-lg font-bold">Summary of order</span>
              </div>
              <OrderSummary receiverCarts={receiverCarts} />
            </div>
          )}
          <div className="pb-4 px-4">
            <DiscountCode />
          </div>
          <div className="pb-4 px-4">
            <CartTotals cart={cart} />
          </div>
        </div>
      </div>
    </form>
  )
}

export default CartPaymentPage
