// This file contains a React component called OrderItems, which renders a list of ordered items with their details
// and provides functionality to add or remove receivers for each item. The component is designed to work with Next.js 14's
// App Router and server components.

// Performance considerations:
// - Large product images can impact performance, so it's recommended to optimize image sizes and use lazy loading.
// - Rendering a large number of items can potentially cause performance issues, so consider techniques like virtualization or pagination.

import React from 'react'
import Image from 'next/image'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageUrl } from '@/utilities/getImageDetails'
import { AddReceiverButton, RemoveProductButton } from '../ReceiversGrid/ReceiverActions'
import { useOrder } from '@app/_providers/Order'

// Type definition for the OrderItems component
export const OrderItems: React.FC = () => {
  // Retrieve the order data from the useOrder hook
  const { order } = useOrder()
  // Destructure the items property from the order object
  const { items: orderItems } = order

  return (
    <div className="py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Map over the orderItems array and render a div for each item */}
      {orderItems?.map((item: any, index: any) => {
        // Destructure the product property from the item object
        const { product } = item
        // Get the image URL for the product, or use a placeholder SVG if no image is available
        const imageUrl =
          product.media && product.media.length > 0
            ? getImageUrl(product.media[0]?.mediaItem)
            : null
        const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`

        return (
          <div key={index} className="border border-neutral-300 rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 space-y-4 sm:space-y-0 sm:space-x-6 bg-neutral-100">
              <Image
                src={imageUrl || placeholderSVG}
                alt={''}
                priority
                width={100}
                height={100}
                className="rounded-md object-cover object-center aspect-square shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(contentFormats.global, contentFormats.h4, 'no-underline truncate')}
                >
                  {product.title}
                </h3>
                <p
                  className={cn(
                    'mt-1 text-sm text-gray-500 line-clamp-2',
                    contentFormats.global,
                    contentFormats.text,
                  )}
                >
                  {product.meta.description}
                </p>
              </div>
              <div className="flex flex-row sm:flex-row justify-end items-center gap-3 sm:gap-4">
                {/* Render an AddReceiverButton for the current product */}
                <AddReceiverButton productId={item.product.id} />
                {/* Render a RemoveProductButton for the current product */}
                <RemoveProductButton orderItemId={item.product.id} />
              </div>
            </div>
            {/* Render a ReceiversGrid component for the current item */}
            <ReceiversGrid item={item} />
          </div>
        )
      })}
    </div>
  )
}
