import React, { Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import classes from './index.module.scss'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  CircleIcon,
  EyeIcon,
  XIcon,
} from 'lucide-react'
import cn from '@/utilities/cn'
import { blockFormats, buttonFormats, contentFormats } from '@app/_css/tailwindClasses'

import { Media } from '@app/_components/Media'
import { ProductActions } from '../../ProductActions'
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
            <div className="relative w-full h-full">
              <Image
                src={metaImage.url}
                alt={metaImage.alt || ''}
                priority={false}
                fill
                // objectFit="cover"
                className="aspect-square object-cover rounded-md shadow-md hover:scale-105 hover:delay-75 duration-150"
              />
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
          <div className={cn(`flex`, contentFormats.global, contentFormats.text, `pb-3 pt-2`)}>
            {description.replace(/\s/g, ' ')}
          </div>
          <Link href={`/shop/${slug}`} className="relative no-underline hover:no-underline">
            <div className="pb-5 flex justify-end items-center cursor-pointer hover:underline no-underline">
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
