'use client'

import React, { useState, CSSProperties, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { contentFormats, buttonFormats } from '@/app/(app)/_css/tailwindClasses'
import { Media } from '@app/_components/Media'
import cn from '@/utilities/cn'
import classes from './index.module.scss'
import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'

import {
  MinusIcon,
  PlusIcon,
  MessageSquareWarningIcon,
  TrashIcon,
  UserPlusIcon,
  MessageCircleWarningIcon,
  TruckIcon,
  BoxIcon,
  StickyNoteIcon,
} from 'lucide-react'
import {
  addProduct,
  isProductInCart,
  areProductsInCart,
  removeProduct,
  addReceiver,
} from '@/app/(app)/_components/ProductActions/actions'
import { getCart } from '@/app/(app)/_components/ProductActions/actions'
// import { ReceiversGrid } from '@app/_components/ReceiversGrid'
import Link from 'next/link'
export const DesktopPersonalise = (cart: any) => {
  // console.log('cartcheckout -- ', cart)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRouting, startRouting] = useTransition()

  const [cartData, setCartData] = useState(cart)

  useEffect(() => {
    const fetchCart = async () => {
      const updatedCart = await getCart()
      setCartData(updatedCart)
    }

    fetchCart()
    // console.log('cartData -- ', cartData)
  }, [])

  const deliveryMethods = [
    { id: 'free', title: 'Free', turnaround: '4–10 business days', price: 0, checked: false },

    {
      id: 'standard',
      title: 'Standard',
      turnaround: '4–10 business days',
      price: 5,
      checked: true,
    },
    { id: 'express', title: 'Express', turnaround: '2–5 business days', price: 16, checked: false },
  ]

  const transactions = [
    {
      id: 'AAPS0L',
      company: 'Chase & Co.',
      share: 'CAC',
      commission: '+$4.37',
      price: '$3,509.00',
      quantity: '12.00',
      netAmount: '$4,397.00',
    },
    {
      id: 'asdc',
      company: 'Chase & Co.',
      share: 'CAC',
      commission: '+$4.37',
      price: '$3,509.00',
      quantity: '12.00',
      netAmount: '$4,397.00',
    },
    {
      id: 'asd',
      company: 'Chase & Co.',
      share: 'CAC',
      commission: '+$4.37',
      price: '$3,509.00',
      quantity: '12.00',
      netAmount: '$4,397.00',
    },
    {
      id: '123',
      company: 'Chase & Co.',
      share: 'CAC',
      commission: '+$4.37',
      price: '$3,509.00',
      quantity: '12.00',
      netAmount: '$4,397.00',
    },
    // More transactions...
  ]

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('Select Option')

  return (
    <React.Fragment>
      {cartData?.items?.map((item: any, index: any) => {
        const { product, receivers, price, shipping, total } = item
        // console.log('product -- ', product)
        const { image: metaImage } = product.meta
        return (
          <div key={index} className="#hover:bg-gray-100 #hover:shadow-sm">
            {/* PRODUCT INFO AND THANKLY ACTIONS */}
            <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
              <div className="flex min-w-0 gap-x-4">
                <div className="h-20 w-20 flex-none  bg-gray-50">
                  {!metaImage && <div className={classes.placeholder}>No image</div>}
                  {metaImage && typeof metaImage !== 'string' && (
                    <React.Fragment>
                      <Media
                        imgClassName={`aspect-square w-full flex-none rounded-sm object-cover`}
                        resource={metaImage}
                      />
                    </React.Fragment>
                  )}
                </div>

                <div className="flex flex-col gap-x-3 sm:items-start">
                  <div
                    className={cn(
                      'pb-3 !text-left !leading-snug',
                      contentFormats.global,
                      contentFormats.h4,
                    )}
                  >
                    {product.title}
                  </div>
                  <div
                    className={cn(
                      ' hidden !text-left !leading-snug sm:flex',
                      contentFormats.global,
                      contentFormats.text,
                    )}
                  >
                    {product.meta.description}
                  </div>
                </div>
                <div className="#leading-5 mt-1 flex items-center  gap-x-2 text-gray-500"></div>
              </div>

              <div className="flex flex-none items-end gap-x-4 align-top">
                <div
                  className={cn(
                    buttonFormats.global,
                    buttonFormats.small,
                    buttonFormats.product,
                    buttonFormats.transparentDark,
                  )}
                  onClick={async () => {
                    await addReceiver(product.id)
                    const updatedCart = await getCart()
                    setCartData(updatedCart)
                  }}
                >
                  <UserPlusIcon
                    className={cn(`mr-2 h-5 w-5 flex-none text-gray-900`)}
                    aria-hidden="true"
                    strokeWidth={1.25}
                  />
                  <div>{`Add Receiver`}</div>
                </div>
                <div
                  className={cn(
                    buttonFormats.global,
                    buttonFormats.small,
                    buttonFormats.product,
                    buttonFormats.transparentDark,
                  )}
                  onClick={async () => {
                    await removeProduct(product.id)
                    const updatedCart = await getCart()
                    setCartData(updatedCart)
                  }}
                >
                  <TrashIcon
                    className={cn(`mr-2 h-5 w-5 flex-none `)}
                    aria-hidden="true"
                    strokeWidth={1.25}
                  />
                  <div>{`Remove Thankly`}</div>
                </div>

                {/* <dl className={cn('my-0 space-y-2', contentFormats.global, contentFormats.text)}>
                  <div className="flex items-center sm:justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">$99.00</dd>
                  </div>
                  <div className="#flex-col flex items-center pb-2 pt-1 sm:justify-between md:flex-row">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Shipping</span>
                      <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Learn more about how shipping is calculated</span>
                      </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                  </div>
                </dl> */}
              </div>
            </div>

            {/* THANKLY RECEIVERS */}
            <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
              <div className="flex min-w-0 gap-x-4">
                <div className="">
                  <div
                    className={cn(
                      'pb-3 !text-left !leading-snug',
                      contentFormats.global,
                      contentFormats.h4,
                    )}
                  >
                    Receivers
                  </div>
                  <div
                    className={cn(
                      // ' hidden !text-left !leading-snug #sm:flex',
                      contentFormats.global,
                      contentFormats.text,
                    )}
                  >
                    {`Add one or more receivers, provide your message and we'll do the rest. Hint: Click to start typing to add / update your message or address. `}
                    {product.productType === 'card' && (
                      <React.Fragment>
                        <span className="font-semibold">{`Thankly Cards: `}</span>
                        <span className={[contentFormats.text].join(' ')}>
                          {`Allow VIC (5 business days), Interstate (6-8 business days) due to AusPost letter delivery changes. `}
                          <Link
                            className={[contentFormats.global, contentFormats.a].join(' ')}
                            href="https://dub.sh/auspost"
                            target="_blank"
                          >
                            Learn More
                          </Link>
                        </span>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <ReceiversGrid /> */}
            <div className="flow-root px-4 sm:px-6 lg:px-8">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-3 lg:px-4">
                  <table className="#w-full min-w-full table-auto divide-y divide-gray-300 sm:table-fixed">
                    <thead className="hidden sm:table-header-group">
                      <tr
                        className={cn(
                          contentFormats.global,
                          contentFormats.text,
                          'align-top text-sm font-semibold text-gray-900',
                        )}
                      >
                        <th
                          scope="col"
                          className="whitespace-nowrap pl-2 pr-2 text-left sm:pl-0 sm:pr-3"
                        >
                          {`First & Last Name`}
                          <p
                            className={cn(
                              contentFormats.global,
                              contentFormats.smallText,
                              'leading-0 my-1 hidden text-wrap text-sm text-gray-500 sm:block',
                            )}
                          >
                            A full name helps with accurate delivery
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-2 pr-2 text-left text-sm sm:pl-0 sm:pr-3 "
                        >
                          {`Street Address`}
                          <p
                            className={cn(
                              contentFormats.global,
                              contentFormats.smallText,
                              'leading-0 my-1 hidden text-wrap text-sm text-gray-500 sm:block',
                            )}
                          >
                            {`Street address of the receiver`}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-2 pr-2 text-left text-sm sm:pl-0 sm:pr-3 "
                        >
                          {`Address Line 2`}
                          <p
                            className={cn(
                              contentFormats.global,
                              contentFormats.smallText,
                              'leading-0 my-1 hidden text-wrap text-sm text-gray-500 sm:block',
                            )}
                          >
                            {`Floor, apartment, PO Box etc. (optional)`}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-2 pr-2 text-left text-sm sm:pl-0 sm:pr-3 "
                        >
                          {`Message`}
                          <p
                            className={cn(
                              contentFormats.global,
                              contentFormats.smallText,
                              'leading-0 my-1 hidden text-balance text-sm text-gray-500 sm:block',
                            )}
                          >
                            {`About 60-100 words written exactly as shown.`}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-2 pr-2 text-left text-sm sm:pl-0 sm:pr-3 "
                        >
                          {`Delivery`}
                          <p
                            className={cn(
                              contentFormats.global,
                              contentFormats.smallText,
                              'leading-0 my-1 hidden text-sm text-gray-500 sm:block',
                            )}
                          >
                            {`Delivery options`}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className={cn(
                            contentFormats.global,
                            'flex flex-col space-y-3 pb-6 pt-4 align-top text-gray-900 sm:table-row sm:space-y-0 sm:pb-0',
                          )}
                        >
                          <td className="block whitespace-nowrap pl-2 pr-2 text-right sm:table-cell sm:pl-0 sm:pr-3">
                            <div
                              className="mb-1 block text-left text-sm font-bold text-gray-700 sm:hidden"
                              data-label="First & Last Name"
                            >
                              First & Last Name
                            </div>
                            <input
                              type="text"
                              className={cn(contentFormats.smallText, `w-full py-2`)}
                              name={`firstName`}
                              id={`firstName`}
                              placeholder="Jane Smith"
                            />
                          </td>
                          <td className="block whitespace-nowrap pl-2 pr-2 text-right sm:table-cell sm:pl-0 sm:pr-3">
                            <div
                              className="mb-1 block text-left text-sm font-bold text-gray-700 sm:hidden"
                              data-label="First & Last Name"
                            >
                              Street Address
                            </div>
                            <input
                              type="text"
                              className={cn(contentFormats.smallText, `w-full py-2`)}
                              name={`addressLine1`}
                              id={`addressLine1`}
                              placeholder="123 Fake St, Melbourne 3000"
                            />
                          </td>
                          <td className="block whitespace-nowrap pl-2 pr-2 text-right sm:table-cell sm:pl-0 sm:pr-3">
                            <div
                              className="mb-1 block text-left text-sm font-bold text-gray-700 sm:hidden"
                              data-label="First & Last Name"
                            >
                              Address Line 2
                            </div>
                            <input
                              type="text"
                              className={cn(contentFormats.smallText, `w-full py-2`)}
                              name={`addressLine2`}
                              id={`addressLine2`}
                              placeholder="Parcel Locker 12345"
                            />
                          </td>
                          <td className="block whitespace-nowrap pl-2 pr-2 text-right sm:table-cell sm:pl-0 sm:pr-3">
                            <div
                              className="mb-1 block text-left text-sm font-bold text-gray-700 sm:hidden"
                              data-label="Message"
                            >
                              Message
                            </div>
                            <textarea
                              // type="text"
                              className={cn(contentFormats.smallText, `w-full text-balance py-2`)}
                              name={`message`}
                              id={`message`}
                              placeholder="Your message here..."
                            />
                          </td>
                          <td className="block whitespace-nowrap pl-2 pr-2 text-right sm:table-cell sm:pl-0 sm:pr-3">
                            <div
                              className="mb-1 block text-left text-sm font-bold text-gray-700 sm:hidden"
                              data-label="Delivery Option"
                            >
                              Delivery Option
                            </div>
                            <select
                              className={cn(
                                buttonFormats.global,
                                buttonFormats.small,
                                buttonFormats.product,
                                buttonFormats.transparentDark,
                                buttonFormats.full,
                              )}
                              value={selectedDeliveryMethod}
                              onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                            >
                              {deliveryMethods?.map((item, index) => (
                                <option key={index} value={item.id}>
                                  {item.title}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <span className="mr-2">Copy</span>
                            <span className="ml-2">Delete</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}
