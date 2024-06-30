import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { ProductActions } from '@app/_components/ProductActions'
import { messages } from '@/utilities/refData'
import { Media } from '@/payload-types'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

const GenericProductSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    className="w-full h-full text-gray-300"
  >
    <rect width="100" height="100" rx="10" stroke-width="2" />
    <path d="M20 80 L50 20 L80 80 Z" stroke-width="2" />
    <circle cx="50" cy="50" r="20" stroke-width="2" />
  </svg>
)

export const ProductCard: React.FC<any> = (product) => {
  const {
    slug,
    id,
    title,
    media,
    meta: { image: metaImage, description },
    price,
    promoPrice,
    productType,
    stockOnHand,
    lowStockThreshold,
    className,
  } = product

  const imageUrl = media && media.length > 0 ? getImageUrl(media[0]?.mediaItem) : null
  const imageAlt = media && media.length > 0 ? getImageAlt(media[0]?.mediaItem) : 'Product image'
  const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`

  return (
    <div className={cn('relative', 'w-full', 'max-w-sm', 'mx-auto', className)}>
      <Link href={`/shop/${slug}`} className="relative no-underline hover:no-underline block">
        <div className="aspect-square relative overflow-hidden rounded-sm shadow-md">
          {(stockOnHand === 0 || stockOnHand === null || stockOnHand === undefined) && (
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base uppercase">{messages.outOfStock}</span>
            </div>
          )}

          {stockOnHand <= lowStockThreshold && stockOnHand > 0 && (
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base">{messages.lowStock}</span>
            </div>
          )}

          <Image
            src={imageUrl || placeholderSVG}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center"
            placeholder="blur"
            blurDataURL={placeholderSVG}
          />
        </div>

        {title && (
          <div className="mt-4 flex items-center justify-between">
            <h3
              className={cn(
                contentFormats.global,
                contentFormats.h4,
                'text-lg font-semibold truncate flex-grow',
              )}
            >
              {title}
            </h3>

            <div
              className={cn(
                'flex flex-col items-end ml-2',
                contentFormats.global,
                contentFormats.h4,
              )}
            >
              <span
                className={cn('text-sm', {
                  'line-through text-gray-500': +promoPrice !== 0 && +promoPrice < +price,
                })}
              >
                {price.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {+promoPrice !== 0 && +promoPrice < +price && (
                <span className="text-black font-semibold">
                  {promoPrice.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
      {description && (
        <React.Fragment>
          <div
            className={cn(
              contentFormats.global,
              contentFormats.text,
              'mt-2 text-sm text-gray-600 line-clamp-3',
            )}
          >
            {description.replace(/\s/g, ' ')}
          </div>
          <Link
            href={`/shop/${slug}`}
            className="mt-2 inline-flex items-center text-sm font-medium  hover:underline"
          >
            Details
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </React.Fragment>
      )}

      <div className="mt-4">
        <ProductActions product={product} hidePerks={true} hideRemove={true} />
      </div>
    </div>
  )
}
