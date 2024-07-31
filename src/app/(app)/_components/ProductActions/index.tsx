'use client'

import React from 'react' // The ProductActions component uses the useCart hook to access the order context and determine if the product is already in the user's cart.
import { CheckIcon, FrownIcon, MessageCircleWarningIcon, SendHorizonalIcon } from 'lucide-react'
import Link from 'next/link'
import { messages } from '@/utilities/referenceText'
import { AddToCartButton } from './AddToCart'
import { ViewInCartButton } from './ViewInCart' // If the product is out of stock, a message is displayed with a link back to the shop.
import { RemoveFromCartButton } from './RemoveFromCart'
import { useCart } from '@/app/(app)/_providers/Cart'

export function ProductActions({ product, hidePerks, hideRemove }: any) {
  const {
    stock: { stockOnHand },
  } = product
  const { isProductInCart } = useCart()
  const inCart = isProductInCart(product.id)

  if (stockOnHand === 0) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-1 sm:py-2 flex items-center">
          <FrownIcon
            className="h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            aria-hidden="true" // If the product is not in the cart, the AddToCartButton is rendered. If it is in the cart, the ViewInCartButton and RemoveFromCartButton are rendered.
          />
          <div className="ml-2 text-sm text-gray-500">
            {`We're Sorry! This thankly is currently out of stock. `}
            <br className="sm:block hidden" />
            <Link href="/shop">{`Back to Shop`} &#8594;</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-4 sm:py-4 flex gap-1">
        {!inCart ? (
          <div className="flex-auto w-full">
            {/* If the product is in the cart and hideRemove is not set, a message is displayed confirming the product's presence in the cart. */}
            <AddToCartButton product={product} />
          </div>
        ) : (
          <>
            <div className="flex-auto w-3/4">
              <ViewInCartButton />
            </div>
            <div className="flex-initial w-1/4">
              <RemoveFromCartButton cartItemId={product.id} />
            </div>
          </>
        )}
      </div>

      {inCart && !hideRemove && (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-4 sm:py-4 flex items-center">
            {/* If the product is in the cart and hideRemove is not set, a warning message is displayed regarding removing the product from the cart. */}
            <CheckIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">
              {messages.removeProductBase}
              {messages.removeProductExtra}
            </div>
          </div>
        </div>
      )}

      {inCart && !hideRemove && (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <MessageCircleWarningIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">{messages.removeProductWarning}</div>
          </div>
        </div>
      )}
    </>
  )
}
