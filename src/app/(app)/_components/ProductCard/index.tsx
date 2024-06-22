import React, { Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import classes from './index.module.scss'
import { ChevronRightIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { blockFormats, buttonLook, contentFormats } from '@app/_css/tailwindClasses'

import { ProductActions } from '@app/_components/ProductActions'
import { messages } from '@/utilities/staticText'

export const ProductCard: React.FC<any> = (product) => {
  const {
    slug,
    id,
    title,
    meta: { image: metaImage, description },
    price,
    promoPrice,
    productType,
    stockOnHand,
    lowStockThreshold,
    className,
  } = product
  // console.log('product', product)
  return (
    <div className={[`relative`, className].filter(Boolean).join(' ')}>
      <Link href={`/shop/${slug}`} className="relative no-underline hover:no-underline">
        <div className={classes.mediaWrapper + ` aspect-square `}>
          {(stockOnHand === 0 || stockOnHand === null || stockOnHand === undefined) && (
            <div className="relative left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base uppercase">{messages.outOfStock}</span>
            </div>
          )}

          {stockOnHand <= lowStockThreshold && stockOnHand > 0 && (
            <div className="relative left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base">{messages.lowStock}</span>
            </div>
          )}

          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <div className="relative w-full h-full group">
              <Image
                src={metaImage.url}
                alt={metaImage.alt || ''}
                priority={false}
                fill
                // objectFit="cover"
                className="aspect-square object-cover rounded-md shadow-md hover:scale-105 hover:delay-75 duration-150 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {title && (
          <div className="mt-3 py-3 flex items-center justify-between">
            <span className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}>
              {title}
            </span>

            <div className={cn(`flex`, contentFormats.global, contentFormats.h4)}>
              <span
                className={` ${+promoPrice != 0 && +promoPrice < +price && 'line-through text-gray-500'}`}
              >
                {price.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {+promoPrice != 0 && (
                <span className="text-black ml-2 ">
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
              `flex`,
              contentFormats.global,
              contentFormats.text,
              `pb-5 pt-2 line-clamp-4`,
            )}
          >
            {description.replace(/\s/g, ' ')}
          </div>
          <Link href={`/shop/${slug}`} className="relative #no-underline #hover:no-underline">
            <div className="pt-3 pb-5 flex justify-end items-center cursor-pointer #hover:underline #no-underline">
              <span className="justify-end font-title text-base mr-2">{`Details`}</span>
              <ChevronRightIcon
                className="hover:underline h-5 w-auto duration-300 hover:animate-pulse"
                strokeWidth={1.25}
              />
            </div>
          </Link>
        </React.Fragment>
      )}

      <ProductActions product={product} hidePerks={true} hideRemove={true} />
    </div>
  )
}
