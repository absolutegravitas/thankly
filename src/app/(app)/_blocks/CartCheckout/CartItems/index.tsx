import React from 'react'
import Image from 'next/image'

import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { cartStaticText } from '@/utilities/staticText'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { Cart } from '@/payload-types'
import { getCart } from '@app/_providers/Cart/actions'
import { MailWarningIcon } from 'lucide-react'
import { ReceiversGrid } from '../ReceiversGrid'

export const CartItems: React.FC<any> = async () => {
  let cart: Cart | null = null
  cart = await getCart()
  const cartItems = cart?.items || null

  // console.log('cart items cart --', cart)

  return (
    <div className="sm:py-8 py-10 divide-y">
      {cartItems?.map((item: any, index: any) => {
        const { product, receivers, price, shipping, total } = item
        const { image: metaImage } = product.meta

        return (
          <div key={index} className="">
            {/* Product Info */}
            <div className="space-y-4">
              <div className="#grid flex sm:flex items-start sm:items-center sm:space-x-4 space-x-3">
                <div className="h-20 w-20 bg-gray-50 mb-2 sm:mb-0 sm:mr-4">
                  {metaImage && typeof metaImage !== 'string' && (
                    <div className="relative w-full h-full group">
                      <Image
                        src={metaImage.url}
                        alt={metaImage.alt || ''}
                        priority={false}
                        fill
                        className="aspect-square object-cover rounded-sm shadow-md hover:scale-105 hover:delay-75 duration-150 transition-transform"
                      />
                    </div>
                  )}
                </div>
                {/* title & description */}
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
              </div>

              {/* Notices */}
              <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
                {product.productType != 'card' && (
                  <React.Fragment>
                    <MailWarningIcon className="mr-2" />

                    <span className="font-semibold">{`Thankly Cards: `}</span>
                    <span className={[contentFormats.text, `text-sm`].join(' ')}>
                      {cartStaticText.shippingMessage}
                      <Link
                        className={[contentFormats.global, contentFormats.a, `!text-sm`].join(' ')}
                        href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                        target="_blank"
                      >
                        Learn More
                      </Link>
                    </span>
                  </React.Fragment>
                )}
              </div>

              {/* Receivers Grid */}
              <ReceiversGrid {...item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
