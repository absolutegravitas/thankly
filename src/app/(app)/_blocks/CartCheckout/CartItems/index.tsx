import React from 'react'
import Image from 'next/image'

import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { cartText } from '@/utilities/refData'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { Cart } from '@/payload-types'
import { getCart } from '@/app/(app)/_providers/Cart/cartActions'
import { MailWarningIcon } from 'lucide-react'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

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
              </div>

              {/* Notices */}
              <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
                {product.productType != 'card' && (
                  <React.Fragment>
                    <MailWarningIcon className="mr-2" />

                    <span className="font-semibold">{`Thankly Cards: `}</span>
                    <span className={[contentFormats.text, `text-sm`].join(' ')}>
                      {cartText.shippingMessage}
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
