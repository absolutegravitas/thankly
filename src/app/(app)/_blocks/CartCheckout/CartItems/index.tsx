'use client'

import React from 'react'
import Image from 'next/image'

import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { Cart } from '@/payload-types'
import { MailWarningIcon } from 'lucide-react'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'
import { AddReceiverButton, RemoveProductButton } from '../ReceiversGrid/ReceiverActions'

export const CartItems: React.FC<{ cart: Cart }> = ({ cart }) => {
  const { items: cartItems } = cart

  return (
    <div className="sm:py-8 py-10 divide-y">
      {cartItems?.map((item: any, index: any) => {
        const { product, receivers, price, shipping, total } = item
        const { image: metaImage } = product.meta

        return (
          <div key={index} className="">
            <div className="space-y-4 md:border md:border-solid  md:border-neutral-300 pb-6">
              <div className=" flex sm:flex items-start sm:items-center sm:space-x-4 space-x-3 bg-neutral-200        ">
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
                <div className="flex justify-end items-center py-3 pr-3 ">
                  {/* <AddReceiverButton productId={item.product.id} addReceiver={addReceiver} /> */}
                  <RemoveProductButton cartItemId={item.product.id} />
                </div>
              </div>
              {/* Receivers Grid */}
              <ReceiversGrid item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
