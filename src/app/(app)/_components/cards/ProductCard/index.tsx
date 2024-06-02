import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import classes from './index.module.scss'
import { Product } from '@/payload-types'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  CircleIcon,
  EyeIcon,
  XIcon,
} from 'lucide-react'
import cn from '@/utilities/cn'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { blockFormats, buttonFormats, contentFormats } from '@app/_css/tailwindClasses'

import { Media } from '@app/_components/Media'
import { CMSLink } from '../../CMSLink'
import { AddProduct } from '@app/_components/Cart/AddProduct'

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

  return (
    <div className={[`relative`, className].filter(Boolean).join(' ')}>
      <Link href={`/shop/${slug}`} className="relative no-underline hover:no-underline">
        <div className={classes.mediaWrapper + ` !aspect-[4/5] `}>
          {(stockOnHand === 0 || stockOnHand === null || stockOnHand === undefined) && (
            <div className="relative left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base">{`SORRY WE'RE SOLD OUT!`}</span>
            </div>
          )}

          {stockOnHand <= lowStockThreshold && stockOnHand > 0 && (
            <div className="relative left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base">{`Hurry! Low Stock`}</span>
            </div>
          )}

          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <>
              <Media imgClassName={classes.image} resource={metaImage} fill />
              {/* <div
              className="absolute bottom-0 left-0 z-10 mb-6 ml-6 cursor-pointer text-white"
              // onClick={() => setOpen(true)}
            >
              <div
                className={cn(
                  `grid-cols2 grid`,
                  // (stockOnHand === 0 || stockOnHand === null || stockOnHand === undefined) &&
                  //   `hidden`,
                )}
              >
                <EyeIcon className="h-8 w-auto duration-300 hover:animate-pulse" strokeWidth={1} />
                <span className="font-title text-base">{`Quick View`}</span>
              </div>
            </div> */}

              <div className="flex justify-center items-end absolute bottom-0 left-0 right-0 z-10 mb-6">
                <div className="flex items-center text-white no-underline">
                  <span className="font-title text-base mr-2">{`Details`}</span>
                  <ChevronRightIcon
                    className="h-4 w-auto duration-300 hover:animate-pulse"
                    strokeWidth={1.25}
                  />
                </div>
              </div>
            </>
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

        {description && (
          <div className={cn(`flex`, contentFormats.global, contentFormats.text, `pb-3 pt-2`)}>
            {description.replace(/\s/g, ' ')}
          </div>
        )}
      </Link>

      <AddProduct product={product} hidePerks={true} />

      {/* 
      {+product.stockOnHand > 0 ? (
        <>
          <AddProduct product={product} />
        </>
      ) : (
        <div
          className={cn(
            buttonFormats.product,
            buttonFormats.transparentDark,
            buttonFormats.full,
            buttonFormats.large,
          )}
        >
          Out of Stock
        </div>
      )} */}
    </div>
  )
}
