import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { ProductActions } from '@app/_components/ProductActions'
import { Product, Media } from '@payload-types'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'

interface ProductBlockContentProps {
  product: Product
  inCart: boolean
  selectedImageIndex?: number
}

const ProductBlockContent: React.FC<ProductBlockContentProps> = ({
  product,
  inCart,
  selectedImageIndex = 0,
}) => {
  const { title, price, promoPrice, meta, media } = product

  const formatPrice = (amount: number | null | undefined) => {
    if (amount == null) return 'Price not available'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const displayPrice = price ?? 0
  const displayPromoPrice = promoPrice ?? 0

  const getImageUrl = (mediaItem: number | Media | null | undefined): string => {
    if (
      typeof mediaItem === 'object' &&
      mediaItem !== null &&
      'url' in mediaItem &&
      typeof mediaItem.url === 'string'
    ) {
      return mediaItem.url
    }
    return `https://placehold.co/800x800?text=No+Image`
  }

  const getImageAlt = (mediaItem: number | Media | null | undefined): string => {
    if (
      typeof mediaItem === 'object' &&
      mediaItem !== null &&
      'alt' in mediaItem &&
      typeof mediaItem.alt === 'string'
    ) {
      return mediaItem.alt
    }
    return 'Product image placeholder'
  }

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
              {title}
            </h1>

            <div
              className={cn(
                `flex`,
                contentFormats.global,
                `text-xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              <span
                className={`${displayPromoPrice !== 0 && displayPromoPrice < displayPrice ? 'line-through text-gray-500' : ''}`}
              >
                {formatPrice(displayPrice)}
              </span>
              {displayPromoPrice !== 0 && displayPromoPrice < displayPrice && (
                <span className="text-black ml-2 ">{formatPrice(displayPromoPrice)}</span>
              )}
            </div>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{meta?.description || ''}</p>
            </div>
          </section>
        </div>

        {/* Product images */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {media && media.length > 0 && (
            <>
              {/* Main image */}
              <div className="aspect-square overflow-hidden rounded-md mb-4">
                <Image
                  src={getImageUrl(media[selectedImageIndex]?.mediaItem)}
                  alt={getImageAlt(media[selectedImageIndex]?.mediaItem)}
                  priority
                  width={800}
                  height={800}
                  className="object-cover object-center w-full h-full"
                />
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-4">
                {media.map((image, index) => (
                  <Link
                    key={image.id || index}
                    href={`/shop/${product.slug}?image=${index}`}
                    className={`aspect-square overflow-hidden rounded-md ${index === selectedImageIndex ? 'ring-2 ring-indigo-500' : ''}`}
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

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <ProductActions product={product} hidePerks={false} hideRemove={false} />
          </section>
        </div>
      </div>
    </Gutter>
  )
}

interface ProductBlockProps {
  product: Product
  inCart: boolean
  selectedImageIndex?: number
}

export const ProductBlock: React.FC<ProductBlockProps> = ({
  product,
  inCart,
  selectedImageIndex = 0,
}) => {
  return (
    <BlockWrapper settings={{ theme: 'light' }} padding={{ top: 'small', bottom: 'small' }}>
      <ProductBlockContent
        product={product}
        inCart={inCart}
        selectedImageIndex={selectedImageIndex}
      />
    </BlockWrapper>
  )
}

export default ProductBlock
