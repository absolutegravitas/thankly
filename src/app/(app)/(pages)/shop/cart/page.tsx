'use client'
import React, { Suspense, useEffect } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { OrderEmpty } from '@app/_blocks/Order/OrderEmpty'
import { orderText } from '@/utilities/refData'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { OrderItems } from '@app/_blocks/Order/OrderItems'
import { OrderSummary } from '@app/_blocks/Order/OrderSummary'
import { CMSLink } from '../../../_components/CMSLink'
import { DollarSignIcon } from 'lucide-react'
import Link from 'next/link'
import cn from '@/utilities/cn'

export default function CartPage() {
  const { order, orderIsEmpty, hasInitializedOrder } = useOrder()
  console.log('cart --', order)

  // If we have order data, render the content regardless of hasInitializedOrder
  if (order && order.items && order.items.length > 0) {
    return renderCartContent(order, orderIsEmpty)
  }

  // If we don't have order data and hasInitializedOrder is false, show loading
  if (!hasInitializedOrder) {
    return <CartLoadingSkeleton />
  }

  // If we have initialized but the order is empty, show empty order
  return <OrderEmpty />
}

function renderCartContent(order: any, orderIsEmpty: any) {
  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {orderIsEmpty ? (
          <OrderEmpty />
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
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Suspense fallback={<OrderItemsSkeleton />}>{order && <OrderItems />}</Suspense>

              <Suspense fallback={<OrderSummarySkeleton />}>
                {order && <OrderSummary order={order} />}
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
            <OrderItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

const OrderItemsSkeleton: React.FC = () => {
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

const OrderSummarySkeleton: React.FC = () => {
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
