'use client'

import React, { useState, useTransition, useEffect, startTransition } from 'react'

import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { cartStaticText } from '@/utilities/staticText'
import Link from 'next/link'
import { Media } from '@app/_components/Media'
import cn from '@/utilities/cn'
import { Cart } from '@/payload-types'
import {
  addReceiver,
  getCart,
  removeProduct,
  copyReceiver,
  removeReceiver,
} from '@app/_providers/Cart'
import {
  CopyIcon,
  LoaderCircleIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  TrashIcon,
  UserPlusIcon,
} from 'lucide-react'

export function CartItems() {
  const [cartData, setCartData] = useState<any>()
  const [isPending, startTransition] = useTransition()
  const [optimisticCartData, setOptimisticCartData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [isAddingReceiver, setIsAddingReceiver] = useState(false)
  useEffect(() => {
    const fetchCart = async () => {
      const updatedCart = await getCart()
      setCartData(updatedCart)
    }

    fetchCart()
  }, [])

  useEffect(() => {
    setOptimisticCartData(cartData)
  }, [cartData])

  const handleAddReceiver = async (productId: any) => {
    setIsAddingReceiver(true)
    const newReceiver = {
      id: 'temp-id',
      firstName: 'Loading...',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postcode: '',
      message: '',
      total: 0,
      shipping: 0,
    }

    setOptimisticCartData((prevCartData: any) => {
      const updatedCartData = { ...prevCartData }
      const product = updatedCartData.items.find((item: any) => item.product.id === productId)
      if (product) {
        product.receivers.push(newReceiver)
      }
      return updatedCartData
    })

    try {
      const updatedCart = await addReceiver(productId, newReceiver)
      setCartData(updatedCart)
    } catch (error) {
      console.error('Failed to add receiver:', error)
    } finally {
      setIsAddingReceiver(false)
    }
  }

  const handleRemoveProduct = async (productId: any) => {
    setOptimisticCartData((prevCartData: any) => {
      // Optimistic update logic
      const updatedCartData = { ...prevCartData }
      updatedCartData.items = updatedCartData.items.filter(
        (item: any) => item.product.id !== productId,
      )
      return updatedCartData
    })

    try {
      await removeProduct(productId)
      const updatedCart = await getCart()
      setCartData(updatedCart)
    } catch (error) {
      console.error('Failed to remove product:', error)
      // Optionally handle error or revert optimistic update
    }
  }
  const handleCopyReceiver = async (productId: any, receiverId: any) => {
    let newReceiverId = `temp-${Date.now()}`

    // Apply Optimistic Update
    setOptimisticCartData((prevCartData: any) => {
      const updatedCartData = { ...prevCartData }
      const productIndex = updatedCartData.items.findIndex(
        (item: any) => item.product.id === productId,
      )
      if (productIndex !== -1) {
        const receiverIndex = updatedCartData.items[productIndex].receivers.findIndex(
          (receiver: any) => receiver.id === receiverId,
        )
        if (receiverIndex !== -1) {
          const receiverToCopy = updatedCartData.items[productIndex].receivers[receiverIndex]
          const newReceiver = { ...receiverToCopy, id: newReceiverId }
          updatedCartData.items[productIndex].receivers.push(newReceiver)
        }
      }
      return updatedCartData
    })

    try {
      // Server Update
      const updatedCart = await copyReceiver(productId, receiverId)
      setCartData(updatedCart) // Update with server response
    } catch (error) {
      console.error('Failed to copy receiver:', error)
      // Revert Optimistic Update on Error
      setOptimisticCartData((prevCartData: any) => {
        const updatedCartData = { ...prevCartData }
        const productIndex = updatedCartData.items.findIndex(
          (item: any) => item.product.id === productId,
        )
        if (productIndex !== -1) {
          updatedCartData.items[productIndex].receivers = updatedCartData.items[
            productIndex
          ].receivers.filter((receiver: any) => receiver.id !== newReceiverId)
        }
        return updatedCartData
      })
    }
  }

  const handleDeleteReceiver = async (productId: any, receiverId: any) => {
    setOptimisticCartData((prevCartData: any) => {
      const updatedCartData = { ...prevCartData }
      const productIndex = updatedCartData.items.findIndex(
        (item: any) => item.product.id === productId,
      )
      if (productIndex !== -1) {
        const updatedReceivers = updatedCartData.items[productIndex].receivers.filter(
          (receiver: any) => receiver.id !== receiverId,
        )
        updatedCartData.items[productIndex].receivers = updatedReceivers

        // If the product has no receivers left, remove the product from the cart
        if (updatedReceivers.length === 0) {
          updatedCartData.items = updatedCartData.items.filter(
            (item: any) => item.product.id !== productId,
          )
        }
      }
      return updatedCartData
    })

    try {
      const updatedCart = await removeReceiver(productId, receiverId)
      setCartData(updatedCart)

      // If the cart is empty after removing the receiver and the product, reset cartData
      if (updatedCart.items.length === 0) {
        setCartData(null)
      }
    } catch (error) {
      console.error('Failed to delete receiver:', error)
      // Optionally handle error or revert optimistic update
    }
  }

  return (
    <React.Fragment>
      <div className="#border #border-solid col-start-1 col-span-4 h-full rounded-sm bg-gray-150 px-6 pb-8">
        <div className="relative flex items-center justify-between gap-4">
          <div className="">
            <p className={[contentFormats.global, contentFormats.text].join(' ')}>
              {cartStaticText.receiverMessage}
            </p>
          </div>
        </div>

        {!cartData
          ? Array(3)
              .fill(null)
              .map((_, index) => <SkeletonCartItem key={index} />)
          : optimisticCartData?.items?.map((item: any, index: any) => {
              const { product, receivers, price, shipping, total } = item
              const { image: metaImage } = product.meta

              return (
                <div key={index} className="border border-solid border-gray-200/90">
                  <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="h-20 w-20 flex-none bg-gray-50">
                        {!metaImage && <div className={''}>No image</div>}
                        {metaImage && typeof metaImage !== 'string' && (
                          <React.Fragment>
                            <Media
                              imgClassName={`aspect-square w-full flex-none rounded-md object-cover`}
                              resource={metaImage}
                            />
                          </React.Fragment>
                        )}
                      </div>

                      <div className="flex flex-col gap-x-3 sm:items-start">
                        <h5 className="flex basis-1/4">
                          {(index + 1).toString().padStart(2, '0')}
                        </h5>{' '}
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
                    </div>
                    <div className="flex flex-none items-end gap-x-4 align-top">
                      <div
                        className={cn(
                          buttonLook.global,
                          buttonLook.small,
                          buttonLook.product,
                          buttonLook.transparentDark,
                        )}
                        onClick={() => handleAddReceiver(product.id)}
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
                          buttonLook.global,
                          buttonLook.small,
                          buttonLook.product,
                          buttonLook.transparentDark,
                        )}
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <TrashIcon
                          className={cn(`mr-2 h-5 w-5 flex-none `)}
                          aria-hidden="true"
                          strokeWidth={1.25}
                        />
                        <div>{`Remove Thankly`}</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className={cn(contentFormats.global, contentFormats.text)}>
                      {product.productType === 'card' && (
                        <React.Fragment>
                          <span className="font-semibold">{`Thankly Cards: `}</span>
                          <span className={[contentFormats.text].join(' ')}>
                            {cartStaticText.shippingMessage}
                            <Link
                              className={[contentFormats.global, contentFormats.a].join(' ')}
                              href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                              target="_blank"
                            >
                              Learn More
                            </Link>
                          </span>
                        </React.Fragment>
                      )}
                    </div>

                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-4">
                      {receivers?.map((receiver: any, index: any) => {
                        return (
                          <div
                            key={index}
                            className="hover:scale-105 border border-solid hover:bg-gray-200/50 hover:delay-75 duration-150 hover:shadow-md rounded-md px-5 py-6 aspect-square"
                          >
                            <div
                              className={[
                                `flex flex-row justify-between items-center`, // Added items-center to vertically center the content
                                contentFormats.global,
                                contentFormats.h5,
                              ].join(' ')}
                            >
                              <h5 className="flex basis-1/4">
                                {(index + 1).toString().padStart(2, '0')}
                              </h5>
                              <div className="flex basis-3/4 justify-end items-center gap-x-3">
                                <CopyIcon
                                  className="h-5 w-5 hover:text-green cursor-pointer hover:animate-pulse"
                                  aria-hidden="true"
                                  strokeWidth={1.1}
                                  onClick={() => handleCopyReceiver(product.id, receiver.id)}
                                />
                                <TrashIcon
                                  className="h-5 w-5 cursor-pointer hover:text-green hover:animate-pulse"
                                  aria-hidden="true"
                                  strokeWidth={1.1}
                                  onClick={() => handleDeleteReceiver(product.id, receiver.id)}
                                />
                              </div>
                            </div>
                            <h5
                              className={[
                                contentFormats.global,
                                contentFormats.text,
                                `font-semibold`,
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {`${receiver.firstName} ${receiver.lastName}`}
                            </h5>
                            {receiver.addressLine1 && (
                              <div
                                className={[
                                  contentFormats.global,
                                  contentFormats.p,
                                  `text-sm pb-5 flex flex-row`,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                              >
                                <MapPinIcon className="mr-2" strokeWidth={1.25} />
                                <span>
                                  {receiver.addressLine1}
                                  {receiver.addressLine2 && (
                                    <>
                                      <br />
                                      {receiver.addressLine2}
                                    </>
                                  )}
                                  <br />
                                  {[receiver.city, receiver.state, receiver.postcode]
                                    .filter(Boolean)
                                    .join(', ')}
                                </span>
                              </div>
                            )}
                            {receiver.message && (
                              <div
                                className={[
                                  contentFormats.global,
                                  contentFormats.p,
                                  `text-sm py-4 flex flex-row`,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                              >
                                <MessageSquareTextIcon
                                  className="flex-shrink-0 w-5 h-5 mr-2"
                                  strokeWidth={1.25}
                                />
                                <span>{receiver.message}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-4">
                              <div>
                                <span
                                  className={[contentFormats.global, contentFormats.h6].join(' ')}
                                >
                                  Cost:{' '}
                                  {receiver.total?.toLocaleString('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                                <span
                                  className={[contentFormats.global, contentFormats.text].join(' ')}
                                >
                                  + Shipping:{' '}
                                  {receiver.shipping?.toLocaleString('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                              <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                                Subtotal:{' '}
                                {(receiver.total + receiver.shipping)?.toLocaleString('en-AU', {
                                  style: 'currency',
                                  currency: 'AUD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* <Receivers productType={product.productType} receivers={receivers} /> */}
                </div>
              )
            })}
      </div>
    </React.Fragment>
  )
}

export const SkeletonCartItem = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
