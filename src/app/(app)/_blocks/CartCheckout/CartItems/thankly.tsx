'use client'

import React, { useState, useTransition, useEffect, startTransition } from 'react'
import Image from 'next/image'

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
} from '@app/_providers/Cart/actions'
import {
  CopyIcon,
  LoaderCircleIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  SendIcon,
  TrashIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'

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
      id: `temp-${Date.now()}`, // Use a unique temporary ID
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
    <div className="p-5 #border #border-solid border-zinc-200 rounded-md divide-y">
      {optimisticCartData?.items?.map((item: any, index: any) => {
        const { product, receivers, price, shipping, total } = item
        const { image: metaImage } = product.meta

        return (
          <div key={index} className="">
            {/* Product Info */}
            <div className="space-y-4">
              <div className="#grid flex sm:flex items-start sm:items-center sm:space-x-4 space-x-3">
                <div className="h-20 w-20 bg-gray-50 mb-2 sm:mb-0 sm:mr-4">
                  {metaImage && typeof metaImage !== 'string' && (
                    <div className="relative w-full h-full group">
                      <Image
                        src={metaImage.url}
                        alt={metaImage.alt || ''}
                        priority={false}
                        fill
                        className="aspect-square object-cover rounded-sm shadow-md hover:scale-105 hover:delay-75 duration-150 transition-transform"
                      />
                    </div>
                  )}
                </div>
                {/* title & description */}
                <div className="flex-1">
                  <span className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}>
                    {product.title}
                  </span>

                  <div
                    className={cn(
                      'mt-2 !text-left !leading-snug !font-normal !tracking-tighter !antialiased line-clamp-2 sm:line-clamp-1 sm:pr-10',
                      contentFormats.global,
                      contentFormats.text,
                    )}
                  >
                    {product.meta.description}
                  </div>
                </div>
              </div>

              {/* Notices */}
              <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
                {product.productType != 'card' && (
                  <React.Fragment>
                    {cartStaticText.receiverMessage + ` `}
                    <span className="font-semibold">{`Thankly Cards: `}</span>
                    <span className={[contentFormats.text, `text-sm`].join(' ')}>
                      {cartStaticText.shippingMessage}
                      <Link
                        className={[contentFormats.global, contentFormats.a, `!text-sm`].join(' ')}
                        href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                        target="_blank"
                      >
                        Learn More
                      </Link>
                    </span>
                  </React.Fragment>
                )}
              </div>
            </div>

            {/* Receiver Actions */}
            <div className="basis-1/4 flex #items-center #justify-end pb-3 gap-4">
              <CMSLink
                data={{
                  label: 'Add Receiver',
                  // type: 'custom',
                  // url: '/shop',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'narrow',
                  variant: 'blocks',
                  icon: {
                    content: <UserPlusIcon strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => handleAddReceiver(product.id),
                }}
              />
              <CMSLink
                data={{
                  label: 'Delete Thankly',
                  // type: 'custom',
                  // url: '/shop',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'narrow',
                  variant: 'blocks',
                  icon: {
                    content: <UserPlusIcon strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => handleAddReceiver(product.id),
                }}
              />
            </div>
            {/* Receivers */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {receivers?.map((receiver: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col justify-between border border-solid hover:scale-105 hover:bg-neutral-300/50 hover:delay-75 duration-150 shadow-md p-6 aspect-square"
                  >
                    <div>
                      <div className="flex flex-row justify-between items-center">
                        <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                          {`#` + (index + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="flex basis-3/4 justify-end items-center gap-x-3">
                          <CopyIcon
                            className="h-5 w-5 hover:text-green cursor-pointer hover:animate-pulse"
                            aria-hidden="true"
                            strokeWidth={1.4}
                            onClick={() => handleCopyReceiver(product.id, receiver.id)}
                          />
                          <XIcon
                            className="h-5 w-5 cursor-pointer hover:text-green hover:animate-pulse"
                            aria-hidden="true"
                            strokeWidth={1.4}
                            onClick={() => handleDeleteReceiver(product.id, receiver.id)}
                          />
                        </div>
                      </div>
                      <h5
                        className={[contentFormats.global, contentFormats.p, 'font-semibold '].join(
                          ' ',
                        )}
                      >
                        {`${receiver.firstName} ${receiver.lastName}`}
                      </h5>
                      {receiver.addressLine1 && (
                        <React.Fragment>
                          <div
                            className={[
                              contentFormats.global,
                              contentFormats.p,
                              'text-sm pb-5 flex flex-row leading-0',
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

                          <div
                            className={[
                              contentFormats.global,
                              contentFormats.p,
                              'text-sm pb-5 flex flex-row',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <SendIcon className="mr-2" strokeWidth={1.25} />
                            <span>{receiver.shippingOption}</span>
                          </div>
                        </React.Fragment>
                      )}
                      {receiver.message && (
                        <div
                          className={[
                            contentFormats.global,
                            contentFormats.p,
                            'text-sm py-4 flex flex-row leading-tight',
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
                    </div>

                    <div className="mt-auto text-right">
                      <div>
                        <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                          Cost:{' '}
                          {(receiver.total || 0).toLocaleString('en-AU', {
                            style: 'currency',
                            currency: 'AUD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div>
                        <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                          {`+ Shipping: ${receiver.shippingOption != 'free' ? '(' + receiver.shippingOption + ')' : ''}`}
                          {(receiver.shipping || 0).toLocaleString('en-AU', {
                            style: 'currency',
                            currency: 'AUD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                        {/* {'Subtotal: '} */}
                        {((receiver.total || 0) + (receiver.shipping || 0) || 0).toLocaleString(
                          'en-AU',
                          {
                            style: 'currency',
                            currency: 'AUD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
