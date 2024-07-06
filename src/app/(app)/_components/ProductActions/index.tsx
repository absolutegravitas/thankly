'use client'

import React from 'react'
import { CheckIcon, FrownIcon, MessageCircleWarningIcon, SendHorizonalIcon } from 'lucide-react'
import Link from 'next/link'
import { messages } from '@/utilities/refData'
import { AddToCartButton } from './AddToCart'
import { ViewInCartButton } from './ViewInCart'
import { RemoveFromCartButton } from './RemoveFromCart'
// import { isProductInCart } from '@app/_providers/Cart/cartItemsActions'
import { useCart } from '@app/_providers/Cart'

export function ProductActions({ product, hidePerks, hideRemove }: any) {
  const { stockOnHand } = product
  // const inCart = await isProductInCart(product.id)

  const { isProductInCart } = useCart()
  const inCart = isProductInCart(product.id)

  if (stockOnHand === 0) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-1 sm:py-2 flex items-center">
          <FrownIcon
            className="h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            aria-hidden="true"
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

      {!hidePerks && (
        <div className="#hidden sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <SendHorizonalIcon className="h-5 w-5 flex-shrink-0 text-green" aria-hidden="true" />
            <div className="ml-2 text-sm text-gray-500">{messages.shippingFreeMessage}</div>
          </div>
          <div className="py-1 sm:py-2 flex items-center">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
            <div className="ml-2 text-sm text-gray-500">{messages.inStock}</div>
          </div>
        </div>
      )}
    </>
  )
}
