// This file contains the main Cart page component and related UI skeletons for the Next.js 14 app with the App Router and server components.
// The Cart page displays the user's current order, including order items and a summary with totals.
// If the order is empty or not initialized, appropriate placeholders or skeletons are shown.

'use client'
import React, { Suspense } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { OrderEmpty } from '@app/_blocks/Order/OrderEmpty'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { OrderItems } from '@app/_blocks/Order/OrderItems'
import { OrderSummary } from '@app/_blocks/Order/OrderSummary'
import cn from '@/utilities/cn'
import { Order } from '@/payload-types'

// The main Cart page component
export default function CartPage() {
  // Destructure order state and helper values from the useOrder custom hook
  const {
    order,
    orderIsEmpty,
    hasInitializedOrder,
  }: {
    order: Order // Assuming 'Order' is a type or interface defined elsewhere
    orderIsEmpty: boolean
    hasInitializedOrder: boolean
  } = useOrder()

  // Show a loading skeleton if the order hasn't been initialized yet
  if (!hasInitializedOrder) {
    return <CartLoadingSkeleton />
  }

  // Show an empty order placeholder if the order is empty
  if (orderIsEmpty) {
    return <OrderEmpty />
  }

  // Render the Cart page with order items and summary
  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="max-w-7xl mx-auto">
          <h1
            className={cn(
              contentFormats.global,
              contentFormats.h3,
              'mb-6 text-3xl sm:text-4xl font-medium',
            )}
          >
            Your Cart
          </h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {/* Suspense fallback for OrderItems */}
              <Suspense fallback={<OrderItemsSkeleton />}>
                <OrderItems />
              </Suspense>
            </div>
            <div className="w-full lg:w-1/3">
              {/* Suspense fallback for OrderSummary */}
              <Suspense fallback={<OrderSummarySkeleton />}>
                <OrderSummary order={order} />
              </Suspense>
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

// Skeleton component for the loading state of the Cart page
const CartLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse max-w-7xl mx-auto">
        <div className="h-10 bg-gray-200 w-1/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <OrderItemsSkeleton />
          </div>
          <div className="w-full lg:w-1/3">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

// Skeleton component for the loading state of the order items section
const OrderItemsSkeleton = () => (
  <div className="space-y-6">
    {[...Array(2)].map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

// Skeleton component for the loading state of the order summary section
const OrderSummarySkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
    <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
    {[...Array(4)].map((_, index) => (
      <div key={index} className="flex justify-between">
        <div className="h-4 bg-gray-200 w-1/3"></div>
        <div className="h-4 bg-gray-200 w-1/4"></div>
      </div>
    ))}
    <div className="h-10 bg-gray-200 w-full mt-6"></div>
  </div>
)
