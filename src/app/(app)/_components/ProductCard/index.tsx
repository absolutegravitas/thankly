import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { ProductActions } from '@app/_components/ProductActions'
import { messages } from '@/utilities/refData'
import { FullLogo } from '../../_graphics/FullLogo'
import { Product } from '@/payload-types'
import { getImageUrl } from '@/utilities/getImageDetails'
export const ProductCard: React.FC<any> = (product: Product) => {
  console.log('product -- ', product)
  const {
    prices: { salePrice, basePrice },
  } = product

  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  console.log('onSale --', onSale)

  return (
    <React.Fragment>
      <div key={product.slug} className="group ">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md #bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <Link
            href={`/shop/${product.slug}`}
            className="cursor-pointer no-underline hover:no-underline #z-50 "
          >
            <div className="aspect-square relative overflow-hidden rounded-sm shadow-md">
              {(product.stock?.stockOnHand === 0 ||
                product.stock?.stockOnHand === null ||
                product.stock?.stockOnHand === undefined) && (
                <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
                  <span className="text-base uppercase">{messages.outOfStock}</span>
                </div>
              )}
              {product.stock?.stockOnHand &&
                product.stock.lowStockThreshold &&
                product.stock.stockOnHand <= product.stock.lowStockThreshold &&
                product.stock.stockOnHand > 0 && (
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
                  src={`https://placehold.co/600x600?text=No \nImage`}
                  alt={''}
                  className="aspect-square h-full w-full object-cover object-center group-hover:opacity-75"
                />
              )}
            </div>
          </Link>
          <ProductActions product={product} hidePerks={true} hideRemove={true} />
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

        <p className="text-sm text-gray-500">
          {product.meta && product.meta.description && product.meta.description.replace(/\s/g, ' ')}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="mt-2 inline-flex items-center text-sm font-medium  hover:underline"
        >
          Details
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </React.Fragment>
  )
}
