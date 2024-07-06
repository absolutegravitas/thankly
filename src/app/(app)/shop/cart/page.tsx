'use client'

import React, { Suspense } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@app/_blocks/CartCheckout/CartEmpty'
import { cartText } from '@/utilities/refData'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'

import { CartItems } from '@app/_blocks/CartCheckout/CartItems'
import { CartSummary } from '@app/_blocks/CartCheckout/CartSummary'

export default function CartPage() {
  const { cart, cartIsEmpty, hasInitializedCart } = useCart()

  if (cartIsEmpty) {
    console.log('Cart not found or is empty...')
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <CartEmpty />
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="flex flex-col md:flex-row">
          <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-3 pt-6 sm:pt-0">
            <React.Fragment>
              <span
                className={[
                  contentFormats.global,
                  contentFormats.p,
                  'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
                ].join(' ')}
              >
                {'Your Cart'}
              </span>
            </React.Fragment>
          </div>
        </div>
        <div
          className={[
            contentFormats.global,
            contentFormats.p,
            'tracking-tighter sm:tracking-tight #text-3xl font-semibold',
          ].join(' ')}
        >
          {cartText.receiverMessage}
        </div>

        <div className="flex flex-col gap-6">
          <div className="md:basis-auto lg:basis-3/4">
            <Suspense fallback={<CartItemsSkeleton />}>
              {cart && <CartItems cart={cart} />}
            </Suspense>
          </div>

          <div className="md:basis-auto lg:basis-1/4">
            <Suspense fallback={<CartSummarySkeleton />}>
              {cart && <CartSummary cart={cart} />}
            </Suspense>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

const CartItemsSkeleton: React.FC = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

const CartSummarySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="relative flex justify-between gap-4">
        <h2 className="bg-gray-200 rounded h-6 w-32"></h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-48"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>
      </div>
    </div>
  )
}
