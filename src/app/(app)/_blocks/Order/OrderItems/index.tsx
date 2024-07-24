'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'
import { AddReceiverButton, RemoveProductButton } from '../ReceiversGrid/ReceiverActions'
import { useOrder } from '@app/_providers/Order'

export const OrderItems: React.FC = () => {
  const { order } = useOrder()
  const { items: orderItems } = order

  return (
    <div className="py-8 divide-y">
      {orderItems?.map((item: any, index: any) => {
        const { product } = item
        const imageUrl =
          product.media && product.media.length > 0
            ? getImageUrl(product.media[0]?.mediaItem)
            : null
        const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`
        return (
          <div key={index} className="">
            <div className="space-y-4 md:border md:border-solid md:border-neutral-300 pb-6">
              <div className="flex items-start sm:items-center sm:space-x-4 p-3 sm:p-0 space-x-3 bg-neutral-200">
                <Image
                  src={imageUrl || placeholderSVG}
                  // src={getImageUrl(product.media[0]?.mediaItem)}
                  alt={''}
                  priority
                  width={100}
                  height={100}
                  className="rounded-sm object-cover object-center aspect-square shadow-md"
                />
                <div className="flex-1">
                  <span className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}>
                    {product.title}
                  </span>
                  <div
                    className={cn(
                      'mt-2 !text-left !leading-snug !font-normal !tracking-tighter !antialiased line-clamp-2 sm:line-clamp-1 sm:pr-10',
                      contentFormats.global,
                      contentFormats.text,
                    )}
                  >
                    {product.meta.description}
                  </div>
                </div>
                <div className="hidden sm:flex flex-row justify-end items-center py-3 gap-3 pr-3">
                  <AddReceiverButton productId={item.product.id} />
                  <RemoveProductButton orderItemId={item.product.id} />
                </div>
              </div>
              <div className="sm:hidden flex flex-row justify-center items-center gap-3">
                <AddReceiverButton productId={item.product.id} />
                <RemoveProductButton orderItemId={item.product.id} />
              </div>
              <ReceiversGrid item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
