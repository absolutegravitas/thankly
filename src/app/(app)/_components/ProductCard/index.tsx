/** @file
 * @module ProductCard
 * @description Product card component for displaying product details
 * @overview This file contains the ProductCard component, which renders a product card with details such as image, title, price, description, and add/remove from cart functionality. It uses hooks like useState and useEffect to manage the state of the product being in the cart or not. It also handles cases like low stock, out of stock, and sale prices.
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, FrownIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { ProductActions } from '@app/_components/ProductActions'
import { messages } from '@/utilities/refData'
import { Product } from '@/payload-types'
import { getImageUrl } from '@/utilities/getImageDetails'
import { useCart } from '@/app/(app)/_providers/Cart'
import { AddToCartButton } from '../ProductActions/AddToCart'
import { ViewInCartButton } from '../ProductActions/ViewInCart'
import { RemoveFromCartButton } from '../ProductActions/RemoveFromCart'

/** @component
 * @description Renders a product card
 * @param {Product} product - The product data
 * @returns {JSX.Element}
 */
export const ProductCard: React.FC<any> = (product: Product) => {
  const { isProductInCart, cart } = useCart()
  const [inCart, setInCart] = useState(isProductInCart(product.id))

  // @note Update the inCart state when the order or product changes
  useEffect(() => {
    setInCart(isProductInCart(product.id))
  }, [cart, product.id, isProductInCart])

  const {
    prices: { salePrice, basePrice },
  } = product

  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  const outOfStock =
    product.stock?.stockOnHand === 0 ||
    product.stock?.stockOnHand === null ||
    product.stock?.stockOnHand === undefined

  const lowStock =
    product.stock?.stockOnHand &&
    product.stock?.lowStockThreshold &&
    product.stock?.stockOnHand <= product.stock?.lowStockThreshold

  return (
    <React.Fragment>
      <div key={product.slug} className="group ">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md #bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 hover:delay-75 duration-150 hover:-translate-y-1">
          <Link
            href={`/shop/${product.slug}`}
            className="cursor-pointer no-underline hover:no-underline "
          >
            <div className="aspect-square relative overflow-hidden rounded-sm shadow-md">
              {lowStock && !outOfStock && (
                <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
                  <span className="text-base">{messages.lowStock}</span>
                </div>
              )}
              {product.meta?.image ? (
                <Image
                  src={`${getImageUrl(product.meta.image)}`}
                  alt={''}
                  width={600}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="aspect-square h-full w-full object-cover object-center group-hover:opacity-75"
                />
              ) : (
                <img
                  src={`https://placehold.co/600x600?text=No\nImage`}
                  alt={''}
                  className="aspect-square h-full w-full object-cover object-center group-hover:opacity-75"
                />
              )}
              {outOfStock ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex w-full font-body text-white bg-black bg-opacity-50 px-4 py-2 items-center justify-between">
                    <FrownIcon
                      className="h-7 w-7 flex-shrink-0 text-white"
                      strokeWidth={1.25}
                      aria-hidden="true"
                    />
                    {`Out of Stock`}
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                  <span className="font-body  text-white bg-black bg-opacity-50 px-4 py-2 ">
                    {`View Details`}
                    <ChevronRightIcon className="inline-block w-4 h-4 ml-2" />
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
        <div className="#mt-4 flex items-center justify-between">
          <h3
            className={cn(contentFormats.global, 'mt-2 text-lg font-semibold truncate flex-grow')}
          >
            {product.title}
          </h3>
          <div
            className={cn('flex flex-col items-end ml-2', contentFormats.global, contentFormats.h4)}
          >
            <span
              className={`text-black font-semibold ${onSale === true && 'text-sm !line-through text-gray-700'}`}
            >
              {basePrice?.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            {onSale && (
              <span className={''}>
                {`${salePrice.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}`}
              </span>
            )}
          </div>
        </div>

        <p className={cn('my-3', contentFormats.global, contentFormats.p)}>
          {product.meta && product.meta.description && product.meta.description.replace(/\s/g, ' ')}
        </p>

        <div className="flex flex-row items-center justify-between">
          {!outOfStock && !inCart && (
            <div className="w-full flex pb-2">
              <AddToCartButton product={product} />
            </div>
          )}

          {inCart && (
            <div className="w-full flex pb-2 gap-2">
              <div className="flex-auto w-3/4">
                <ViewInCartButton />
              </div>
              <div className="flex-initial w-1/4">
                <RemoveFromCartButton cartItemId={product.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
