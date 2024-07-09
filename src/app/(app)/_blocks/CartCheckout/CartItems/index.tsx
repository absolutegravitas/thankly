'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'
import { AddReceiverButton, RemoveProductButton } from '../ReceiversGrid/ReceiverActions'
import { useCart } from '@app/_providers/Cart'

export const CartItems: React.FC = () => {
  const { cart } = useCart()
  const { items: cartItems } = cart

  return (
    <div className="sm:py-8 py-10 divide-y">
      {cartItems?.map((item: any, index: any) => {
        const { product } = item

        return (
          <div key={index} className="">
            <div className="space-y-4 md:border md:border-solid md:border-neutral-300 pb-6">
              <div className="flex sm:flex items-start sm:items-center sm:space-x-4 space-x-3 bg-neutral-200">
                <Image
                  src={getImageUrl(product.media[0]?.mediaItem)}
                  alt={getImageAlt(product.media[0]?.mediaItem)}
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
                <div className="flex flex-col sm:flex-row justify-end items-center py-3 gap-3 pr-3">
                  <AddReceiverButton productId={item.product.id} />

                  <RemoveProductButton cartItemId={item.product.id} />
                </div>
              </div>
              <div className=""></div>
              <ReceiversGrid item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
