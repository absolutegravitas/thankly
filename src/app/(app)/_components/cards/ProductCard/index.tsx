'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import classes from './index.module.scss'
import { Product } from '@/payload-types'
import { ArrowRightIcon, ArrowUpRightIcon, EyeIcon, XIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { blockFormats, contentFormats } from '@app/_css/tailwindClasses'
import { Media } from '@app/_components/Media'

export const ProductCard: React.FC<any> = ({
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
}) => {
  // State for controlling the visibility of the dialog
  // const [open, setOpen] = useState(false)

  return (
    <div className={[`relative`, className].filter(Boolean).join(' ')}>
      <Link href={`/shop/${slug}`} className="relative no-underline">
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

              {/* <Link
                href={`/shop/${slug}`}
                className="absolute bottom-0 right-0 z-10 mb-6 mr-6 text-white no-underline"
              >
                <div className="grid-cols2 grid">
                  <ArrowUpRightIcon
                    className="h-8 w-auto duration-300 hover:animate-pulse"
                    strokeWidth={1}
                  />
                  <span className="font-title text-base">{`View Details`}</span>
                </div>
              </Link> */}
            </>
          )}
        </div>

        {title && (
          <div className="mt-3 flex items-center justify-between">
            <Link
              href={`/shop/${slug}`}
              className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}
            >
              {title}
            </Link>

            <div className={cn(`flex`, contentFormats.global, contentFormats.h4)}>
              {+promoPrice != 0 && (
                <span className="text-gray-500 line-through">
                  {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
                    promoPrice,
                  )}
                </span>
              )}
              <span className="text-black">
                {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
                  price,
                )}
              </span>
            </div>
          </div>
        )}

        {description && (
          <div className={cn(`flex`, contentFormats.global, contentFormats.text, `pb-3 pt-2`)}>
            {description.replace(/\s/g, ' ')}
          </div>
        )}
      </Link>
      {/* {doc && <AddToCartButton product={doc} appearance="productDark" />} */}

      {/* dialog open */}
      {/* {open && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="bg-opacity-75 fixed inset-0 hidden bg-gray-500/50 backdrop-blur-md transition-opacity md:block" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-stretch justify-center text-center backdrop-blur-sm md:items-center md:px-2 lg:px-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                  enterTo="opacity-100 translate-y-0 md:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 md:scale-100"
                  leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                >
                  <Dialog.Panel className="my-auto flex w-full transform items-center justify-center text-left text-base backdrop-blur-sm  transition sm:border-0 md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                    <div className="relative flex w-5/6 items-center overflow-hidden border border-solid bg-white px-4 pb-8 pt-14 shadow-2xl backdrop-blur-sm sm:w-full sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                      <XIcon
                        className="absolute right-4 top-4 h-8 w-8 cursor-pointer text-gray-900 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                        aria-hidden="true"
                        onClick={() => setOpen(false)}
                      />

                      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 sm:bg-white sm:pb-5 sm:pr-10 sm:pt-10  lg:gap-x-8">
                        <div className="relative sm:col-span-4 lg:col-span-5 ">
                          {(stockOnHand === 0 ||
                            stockOnHand === null ||
                            stockOnHand === undefined) && (
                            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
                              <span className="text-base">{`SORRY WE'RE SOLD OUT!`}</span>
                            </div>
                          )}
                          {stockOnHand <= lowStockThreshold && stockOnHand > 0 && (
                            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
                              <span className="text-base">{`Hurry! Low Stock`}</span>
                            </div>
                          )}

                          {!metaImage && <div className={classes.placeholder}>No image</div>}

                          {metaImage && typeof metaImage !== 'string' && (
                            <Media
                              imgClassName={cn(classes.image, ` aspect-square sm:aspect-[4/5] `)}
                              resource={metaImage}
                            />
                          )}
                        </div>
                        <div className="sm:col-span-8 lg:col-span-7">
                          {titleToUse && (
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  contentFormats.global,
                                  contentFormats.h4,
                                  `no-underline`,
                                )}
                              >
                                {titleToUse}
                              </span>
                              <div className={cn(`flex`, contentFormats.global, contentFormats.h4)}>
                                {doc && <Price product={doc} style="priceOnly" />}
                              </div>
                            </div>
                          )}

                          <section aria-labelledby="information-heading" className="mt-3">
                            <h3 id="information-heading" className="sr-only">
                              Product information
                            </h3>

                            {description && (
                              <div
                                className={cn(
                                  `flex`,
                                  contentFormats.global,
                                  contentFormats.text,
                                  `pb-6 pt-2`,
                                )}
                              >
                                {sanitizedDescription}
                              </div>
                            )}

                            {doc && <AddToCartButton product={doc} appearance="productDark" />}
                          </section>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )} */}
    </div>
  )
}
