// This file contains a React component called `ProductCard` that displays information and actions for a single product.
// It is designed to be used in a Next.js 14 application with App Router and Server Components.
// The component utilizes various hooks and utilities to provide a responsive and interactive product card experience.
// It showcases product details such as title, description, price, stock status, and image.
// Based on the product's availability and cart status, it dynamically renders different action buttons (Add to Cart, View in Cart, Remove from Cart).
// The component also handles various states and side effects related to the product's presence in the cart.

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, FrownIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { messages } from '@/utilities/referenceText'
import { Product } from '@/payload-types'
import { getImageUrl } from '@/utilities/getImageDetails'
import { useCart } from '@/app/(app)/_providers/Cart'
import { AddToCartButton } from '../ProductActions/AddToCart'
import { ViewInCartButton } from '../ProductActions/ViewInCart'
// import { RemoveFromCartButton } from '../ProductActions/RemoveFromCart'

// Type for ProductCard component props
export interface ProductCardProps extends Product {}

// ProductCard component
export const ProductCard: React.FC<ProductCardProps> = (product: Product) => {
  // Hook to access cart-related state and functions
  const { isProductInCart, cart } = useCart()

  // State to track if the product is in the cart
  const [inCart, setInCart] = useState<boolean>(isProductInCart(product.id))

  // Side effect to update the `inCart` state when the cart or product changes
  useEffect(() => {
    setInCart(isProductInCart(product.id))
  }, [cart, product.id, isProductInCart])

  // Destructure product prices
  const {
    prices: { salePrice, basePrice },
  } = product

  // Calculate if the product is on sale
  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  // Check if the product is out of stock
  const outOfStock =
    product.stock?.stockOnHand === 0 ||
    product.stock?.stockOnHand === null ||
    product.stock?.stockOnHand === undefined

  // Check if the product has low stock
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
                {/* <RemoveFromCartButton cartItemId={product.id} /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
