import React, { Suspense } from 'react'
import { Cart } from '@/payload-types'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@app/_blocks/CartCheckout/CartEmpty'
import { getCart } from '@app/_providers/Cart/actions'
import { cartStaticText } from '@/utilities/staticText'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { CartButtons } from '../../_blocks/CartCheckout/CartButtons'

import Loading from './loading'
import { CartItems } from '@app/_blocks/CartCheckout/CartItems'
import { CartSummary } from '@app/_blocks/CartCheckout/CartSummary'

export default async function CartPage() {
  let cart: Cart | null = null
  cart = await getCart()

  if (!cart) {
    console.log('Cart not found or is empty...')
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <CartEmpty />
      </BlockWrapper>
    )
  }

  // console.log('server cart ', JSON.stringify(cart))
  const { leader, heading } = cartStaticText

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="flex flex-col md:flex-row">
          <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-3">
            {heading && (
              <React.Fragment>
                <span
                  className={[
                    contentFormats.global,
                    contentFormats.p,
                    'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
                  ].join(' ')}
                >
                  {heading}
                </span>
              </React.Fragment>
            )}
          </div>
          <div className="sm:basis-1/2 md:basis-1/2 lg:basis-2/6 flex items-center justify-end pb-3 gap-4">
            <CartButtons />
          </div>
        </div>
        <div
          className={[
            contentFormats.global,
            contentFormats.p,
            'tracking-tighter sm:tracking-tight #text-3xl font-semibold',
          ].join(' ')}
        >
          {cartStaticText.receiverMessage}
        </div>

        <Suspense fallback={<CartItemsSkeleton />}>
          <CartItems />
        </Suspense>
        <Suspense fallback={<CartSummarySkeleton />}>
          <CartSummary />
        </Suspense>
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
