'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  CheckIcon,
  FrownIcon,
  LoaderCircleIcon,
  MessageCircleWarningIcon,
  SendHorizonalIcon,
} from 'lucide-react'
import Link from 'next/link'
import { addProduct, isProductInCart, removeProduct } from './actions'
import { Button } from '@app/_components/Button'
import { useRouter } from 'next/navigation'
import { CMSLink } from '../CMSLink'
export function ProductActions({ product, hidePerks }: any) {
  const {
    id,
    title,
    productType,
    availability,
    price,
    promoPrice,
    stockOnHand,
    lowStockThreshold,
    media,
    meta,
  } = product
  // console.log('product block props -- ', product)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRouting, startRouting] = useTransition()
  const [productAdded, setProductAdded] = useState(false)

  const handleAddProduct = async () => {
    // startTransition(async () => {
    await addProduct(product)
    startRouting(async () => {
      router.push('/shop/cart')

      // window.location.reload()
    })
  }

  const handleRemoveProduct = async () => {
    // startTransition(async () => {
    await removeProduct(product.id)
    window.location.reload()
  }

  const handleProductCheck = async () => {
    startTransition(async () => {
      const result = await isProductInCart(product.id)
      setProductAdded(result)
    })
  }

  useEffect(() => {
    handleProductCheck()
  }, [])

  if (isRouting) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            ria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">
            {`Adding to cart...please wait`}
            {/* <br className="sm:block hidden" />
                <Link href="/cart">View Cart &#8594;</Link> */}
          </div>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            ria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">
            {`Checking availability...please wait`}
            {/* <br className="sm:block hidden" />
                <Link href="/cart">View Cart &#8594;</Link> */}
          </div>
        </div>
      </div>
    ) // Show a loading indicator while the transition is in progress
  } else {
    if (stockOnHand === 0) {
      return (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <FrownIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              ria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">
              {`We're Sorry! This thankly is currently out of stock. `}
              <br className="sm:block hidden" />
              <Link href="/shop">Back to Shop &#8594;</Link>
            </div>
          </div>
        </div>
      )
    }

    if (stockOnHand != 0) {
      if (productAdded) {
        return (
          <>
            <div className="sm:flex pt-2 items-center justify-center space-x-2">
              <div className="py-4 sm:py-4 flex items-center">
                <CheckIcon
                  className="h-8 w-8 flex-shrink-0 text-green"
                  strokeWidth={1.25}
                  ria-hidden="true"
                />
                <div className="ml-2 text-sm text-gray-500">
                  {`This thankly is already in your cart. Go to the Cart to add your messages and send to as many people as you'd like easily.`}
                  {/* <br className="sm:block hidden" />
                <Link href="/cart">View Cart &#8594;</Link> */}
                </div>
              </div>
            </div>
            <div className="py-4 sm:py-4 ">
              <CMSLink
                url="/shop/cart"
                appearance={'default'}
                // width={'wide'}
                // size={'medium'}
                // icon={false}
                buttonProps={{
                  appearance: 'default',
                  size: 'large',
                  hideHorizontalBorders: false,
                  hideBottomBorderExceptLast: true,
                  forceBackground: true,
                }}
              />
              <Button
                url="/shop/cart"
                label={'View in Cart'}
                appearance={'default'}
                fullWidth
                data-theme={'light'}
                icon="chevron"
                onClick={() => {
                  startRouting(async () => {
                    router.push('/shop/cart')
                  })
                }}
              />
            </div>
            <Button
              // url="/shop"
              label={'Remove from Cart'}
              // label={isInCart ? 'View in Cart' : 'Add to Cart'}
              appearance={'links'}
              fullWidth
              data-theme={'light'}
              // icon="trash"
              onClick={handleRemoveProduct}
            />
            <div className="#hidden sm:flex pt-2 items-center justify-center space-x-2">
              <div className="py-1 sm:py-2 flex items-center">
                <MessageCircleWarningIcon
                  className="h-8 w-8 flex-shrink-0 text-green"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <div className="ml-2 text-sm text-gray-500">
                  {`Removing this thankly will also remove all receivers. To change receivers and still send this thankly, go to the Cart.`}
                </div>
              </div>
            </div>
          </>
        )
      } else {
        return (
          <>
            <Button
              url="/shop/cart"
              label={'Add to Cart'}
              // label={isInCart ? 'View in Cart' : 'Add to Cart'}
              appearance={'default'}
              fullWidth
              data-theme={'light'}
              icon="cart"
              onClick={handleAddProduct}
            />
            {!hidePerks && (
              <div className="hidden sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-1 sm:py-2 flex items-center">
                  <SendHorizonalIcon
                    className="h-5 w-5 flex-shrink-0 text-green"
                    aria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">
                    FREE Delivery for orders over $100
                  </div>
                </div>
                <div className="py-1 sm:py-2 flex items-center">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                  <div className="ml-2 text-sm text-gray-500">In stock and ready to ship</div>
                </div>
              </div>
            )}
          </>
        )
      }
    }
  }
}
