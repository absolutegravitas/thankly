'use client'
import { Cart, Discountcode } from '@/payload-types'
import { fetchDiscountCode } from '@/utilities/PayloadQueries/discountCodes'
import React, { useEffect, useState } from 'react'

interface Props {
  cart: Cart
}
const CartTotals = ({ cart }: Props) => {
  //look up discountcode descirption
  const [discountCodeDetails, setDiscountCodeDetails] = useState<Discountcode | null>(null)

  useEffect(() => {
    if (cart.discountCodeApplied) {
      fetchDiscountCode(cart.discountCodeApplied)
        .then((details) => setDiscountCodeDetails(details))
        .catch((error) => console.error('Error fetching discount code:', error))
    }
  }, [cart.discountCodeApplied])

  return (
    <>
      <div className="border border-x-0 border-t-stone-400 border-b-stone-400 px-4 text-lg font-medium">
        <div className="flex flex-row py-2">
          <div className="flex flex-col basis-1/2">Subtotal:</div>
          <div className="flex flex-col basis-1/2 items-end">${cart.totals.cost.toFixed(2)}</div>
        </div>
        {cart.totals.discount && cart.totals.discount !== 0 && (
          <div className="flex flex-row pb-2">
            <div className="flex flex-col basis-1/2">
              Discount: {discountCodeDetails?.cartDescription ?? ''}
            </div>
            <div className="flex flex-col basis-1/2 items-end">
              -${(cart.totals.discount * -1).toFixed(2)}
            </div>
          </div>
        )}
        <div className="flex flex-row pb-3">
          <div className="flex flex-col basis-1/2">Postage:</div>
          <div className="flex flex-col basis-1/2 items-end">
            ${cart.totals.shipping.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="flex flex-row pb-3 p-4 text-3xl font-bold">
        <div className="flex flex-col basis-1/2">Total:</div>
        <div className="flex flex-col basis-1/2 items-end">${cart.totals.total.toFixed(2)}</div>
      </div>
      {/* <p className="text-right font-light px-4">Tax calculated at checkout</p> */}
    </>
  )
}

export default CartTotals
