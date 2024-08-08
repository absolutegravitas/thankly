// This file contains a React component that renders a product block for an e-commerce website.
// The component displays product details such as title, price, description, and images.
// It also includes an "Add to Cart" button and allows users to switch between different product images.
//
// The component is built using Next.js 14 with App Router and server components, which provides a more efficient
// and streamlined approach to server-side rendering and data fetching.
//
// Performance considerations:
// - Lazy loading and optimizing image sizes can improve load times.
// - Memoizing formatPrice function and avoiding unnecessary re-renders can enhance performance.
//
// Accessibility (a11y) considerations:
// - Ensure proper alt text is provided for images.
// - Use appropriate ARIA roles and labels for better screen reader accessibility.
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Product, Media } from '@payload-types' // Types for product and media data
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { useCart } from '@/app/(app)/_providers/Cart'
import { messages } from '@/utilities/referenceText'
import { CheckIcon, FrownIcon, MessageCircleWarningIcon } from 'lucide-react'
import { AddToCartButton } from '../../_components/ProductActions/AddToCart'
import { ViewInCartButton } from '../../_components/ProductActions/ViewInCart'
import { RemoveFromCartButton } from '../../_components/ProductActions/RemoveFromCart'

interface ProductBlockContentProps {
  product: Product // The product data to be displayed
  selectedImageIndex?: number // Index of the currently selected image (default: 0)
}

// Renders the main content of the product block
const ProductBlockContent: React.FC<ProductBlockContentProps> = ({
  product,
  selectedImageIndex = 0,
}) => {
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
    media: images,
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
    <Gutter>
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:py-16 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-start align-top">
          <div className="mt-3 sm:flex items-start justify-between align-top">
            <h1
              className={cn(
                contentFormats.global,
                `text-3xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              {product.title}
            </h1>

            <div
              className={cn(
                'flex flex-col items-end ml-2',
                contentFormats.global,
                contentFormats.h4,
              )}
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

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">
                {product.meta &&
                  product.meta.description &&
                  product.meta.description.replace(/\s/g, ' ')}
              </p>
            </div>
          </section>
        </div>

        {/* Product images */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {images && images.length > 0 && (
            <>
              {/* Main image */}
              <div className="aspect-square relative overflow-hidden rounded-md mb-4">
                {lowStock && !outOfStock && (
                  <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
                    <span className="text-base">{messages.lowStock}</span>
                  </div>
                )}
                <Image
                  src={getImageUrl(images[selectedImageIndex]?.mediaItem)}
                  alt={getImageAlt(images[selectedImageIndex]?.mediaItem)}
                  priority
                  width={1200}
                  height={1200}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center w-full h-full"
                />
                {outOfStock ?? (
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
                )}
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <Link
                    key={image.id || index}
                    href={`/shop/${product.slug}?image=${index}`}
                    className={`aspect-square overflow-hidden rounded-md ${index === selectedImageIndex ? 'ring-2 ring-green' : ''}`}
                  >
                    <Image
                      src={getImageUrl(image.mediaItem)}
                      alt={getImageAlt(image.mediaItem)}
                      width={200}
                      height={200}
                      className="object-cover object-center w-full h-full"
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="py-6 flex flex-row items-center justify-between px-6">
          {!outOfStock && !inCart && (
            <div className="w-full flex pb-2">
              <AddToCartButton product={product} />
            </div>
          )}

          {inCart && (
            <div className="flex flex-col">
              <div className="w-full flex pb-2 gap-2">
                <div className="flex-auto w-3/4">
                  <ViewInCartButton />
                </div>
                <div className="flex-initial w-1/4">
                  <RemoveFromCartButton cartItemId={product.id} />
                  <div className="sm:flex pt-2 items-center justify-center space-x-2"></div>
                </div>
              </div>
              <div className="sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-4 sm:py-4 flex items-center">
                  {/* If the product is in the cart and hideRemove is not set, a warning message is displayed regarding removing the product from the cart. */}
                  <CheckIcon
                    className="h-8 w-8 flex-shrink-0 text-green"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">
                    {messages.removeProductBase}
                    {messages.removeProductExtra}
                  </div>
                </div>
              </div>

              <div className="sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-1 sm:py-2 flex items-center">
                  <MessageCircleWarningIcon
                    className="h-8 w-8 flex-shrink-0 text-green"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">{messages.removeProductWarning}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <ProductActions product={product} hidePerks={false} hideRemove={false} />
          </section>
        </div> */}
      </div>
    </Gutter>
  )
}

interface ProductBlockProps {
  product: Product // The product data to be displayed
  selectedImageIndex?: number // Index of the currently selected image (default: 0)
}

// Renders the overall product block component
export const ProductBlock: React.FC<ProductBlockProps> = ({ product, selectedImageIndex = 0 }) => {
  return (
    <BlockWrapper className={getPaddingClasses('content')}>
      <ProductBlockContent product={product} selectedImageIndex={selectedImageIndex} />
    </BlockWrapper>
  )
}

export default ProductBlock
