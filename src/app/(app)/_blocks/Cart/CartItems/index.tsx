// This file contains a React component called CartItems, which renders a list of ordered items with their details
// and provides functionality to add or remove receivers for each item. The component is designed to work with Next.js 14's
// App Router and server components.

// Performance considerations:
// - Large product images can impact performance, so it's recommended to optimize image sizes and use lazy loading.
// - Rendering a large number of items can potentially cause performance issues, so consider techniques like virtualization or pagination.

import React, { useState } from 'react'
import Image from 'next/image'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { Receivers } from '../Receivers'
import { getImageUrl } from '@/utilities/getImageDetails'
import { AddReceiver, RemoveProduct } from '../Receivers/ReceiverActions'
import { useCart } from '@/app/(app)/_providers/Cart'
import { ChevronRightIcon, ChevronDownIcon } from 'lucide-react'

// Type definition for the CartItems component
export const CartItems: React.FC = () => {
  // Retrieve the cart data from the useCart hook
  const { cart } = useCart()
  // Destructure the items property from the cart object
  const { items: cartItems } = cart
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <React.Fragment>
      <div className="py-4 sm:py-8 space-y-6 sm:space-y-8 pl-0 sm:pl-8">
        <ul role="list" className="sm:divide-y sm:divide-gray-100 pl-0 ">
          {cartItems?.map((item: any, index: any) => {
            // Destructure the product property from the item object
            const { product } = item
            const isExpanded = expandedItems[index] || false
            return (
              <>
                <li
                  key={index}
                  onClick={() => toggleExpand(index)}
                  className="relative flex sm:flex-row sm:flex-nowrap flex-col flex-wrap  justify-between gap-x-6 mb-3  p-3  bg-neutral-200 hover:bg-neutral-100 hover:cursor-pointer "
                >
                  <div className="flex hrink-0 items-center gap-x-4">
                    <div className="w-7 h-7 flex items-center justify-center transition-transform duration-200 ease-in-out">
                      {isExpanded ? (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-7 w-7 flex-none transform rotate-0"
                          strokeWidth={1.25}
                        />
                      ) : (
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="h-7 w-7 flex-none transform w"
                          strokeWidth={1.25}
                        />
                      )}
                    </div>
                    <p className={[contentFormats.p, 'font-semibold'].join(' ')}>
                      {`#${(index + 1).toString().padStart(2, '0')}`}
                    </p>
                    {product.meta?.image ? (
                      <img
                        src={`${getImageUrl(product.meta.image)}`}
                        alt={''}
                        // width={96}
                        // height={96}
                        // sizes="(max-width: 640px) 60px, (max-width: 768px) 72px, 96px"
                        className="h-14 w-14 flex-none rounded-full bg-gray-50 "
                      />
                    ) : (
                      <img
                        src={`https://placehold.co/100x100?text=No\nImage`}
                        alt={''}
                        className="h-14 w-14 flex-none rounded-full bg-gray-50"
                      />
                    )}
                    {/* <img
                          alt=""
                          src={person.imageUrl}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        /> */}
                    <div className="flex #shrink-0 items-center gap-x-4  ">
                      <div className="sm:flex sm:flex-col pr-3">
                        <p className="my-0 text-sm font-semibold leading-6 text-gray-900">
                          {product.title}
                        </p>
                        <p className="hidden sm:visible my-0 text-xs leading-5  text-gray-500 break-words w-full sm:w-auto">
                          {product.meta.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-nowrap shrink-0 items-center gap-x-4">
                    <div className="sm:flex sm:flex-col sm:items-end">
                      <p className="my-0  font-body font-semibold leading-6 text-gray-900">{`Total for this Thankly: ${
                        item.totals.subTotal.toLocaleString('en-AU', {
                          style: 'currency',
                          currency: 'AUD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }) || 0
                      }`}</p>
                      <p className="my-0 text-xs leading-5 text-gray-500">{`Sending to ${item.receivers.length} ${item.receivers.length === 1 ? 'person' : 'people'}`}</p>
                    </div>

                    <RemoveProduct productId={item.product.id} />
                  </div>
                </li>

                {isExpanded && <Receivers item={item} />}
              </>
            )
          })}
        </ul>
      </div>
    </React.Fragment>
  )
}
