'use client'
import React, { Suspense, useEffect } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@/app/(app)/_blocks/Cart/CartEmpty'
import { cartText } from '@/utilities/refData'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { CartItems } from '@/app/(app)/_blocks/Cart/CartItems'
import { CartSummary } from '@/app/(app)/_blocks/Cart/CartSummary'
import { CMSLink } from '@app/_components/CMSLink'
import { DollarSignIcon } from 'lucide-react'
import Link from 'next/link'
import cn from '@/utilities/cn'

export default function CartPage() {
  const { cart, cartIsEmpty, hasInitializedCart } = useCart()

  // If we have cart data, render the content regardless of hasInitializedCart
  if (cart && cart.items && cart.items.length > 0) {
    return renderCartContent(cart, cartIsEmpty)
  }

  // If we don't have cart data and hasInitializedCart is false, show loading
  if (!hasInitializedCart) {
    return <CartLoadingSkeleton />
  }

  // If we have initialized but the cart is empty, show empty cart
  return <CartEmpty />
}

function renderCartContent(cart: any, cartIsEmpty: any) {
  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {cartIsEmpty ? (
          <CartEmpty />
        ) : (
          <>
            <div className="flex flex-row justify-between #gap-6">
              <h1
                className={[
                  contentFormats.global,
                  contentFormats.h3,
                  'tracking-tighter text-3xl sm:text-2xl font-medium my-2',
                ].join(' ')}
              >
                {'Your Cart'}
              </h1>

              {/* <div className="hidden sm:flex w-1/6">
                <Link
                  href="#summary-heading"
                  scroll={true}
                  className={[
                    buttonLook.variants.base,
                    buttonLook.sizes.medium,
                    buttonLook.widths.full,
                    `flex flex-row justify-between no-underline`,
                  ].join(' ')}
                >
                  <span className={cn(contentFormats.global, contentFormats.p, '')}>
                    {`Order Summary `}
                  </span>
                  <span> &darr; </span>
                </Link>
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Suspense fallback={<CartItemsSkeleton />}>{cart && <CartItems />}</Suspense>

              <Suspense fallback={<CartSummarySkeleton />}>
                {cart && <CartSummary cart={cart} />}
              </Suspense>
            </div>
          </>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

const CartLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-3/4">
            <CartItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

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