import React from 'react'
import { draftMode } from 'next/headers'
import { fetchProduct } from '@app/_queries/products'
import { notFound } from 'next/navigation'
import ProductBlock from '@app/_blocks/ProductBlock'
import type { Product } from '@payload-types'
import { isProductInCart } from '@app/_providers/Cart/cartItemsActions'
import Blocks from '../../_blocks'

export default async function ProductPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { isEnabled: isDraftMode } = draftMode()
  const selectedImageIndex =
    typeof searchParams.image === 'string' ? parseInt(searchParams.image, 10) : 0

  let product: Product | null = null
  try {
    product = await fetchProduct(slug)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return notFound()
  }

  if (
    !product ||
    typeof product !== 'object' ||
    (Object.keys(product).length === 0 && product.constructor === Object)
  ) {
    return notFound()
  }

  // Check if the product is in the cart
  const inCart = await isProductInCart(product.id)

  return (
    <React.Fragment>
      <ProductBlock product={product} inCart={inCart} selectedImageIndex={selectedImageIndex} />
      <Blocks blocks={product?.layout?.root?.children} />
    </React.Fragment>
  )
}

// Cancelled 1x traveller from a flight booking on 11-May (MEL>SIN>ROM / BOM>MEL).
// Under the terms of MMT and being MMT Black Platinum customer, the Airline, I was entitled to that refund INR 118290 to be credited into MMT wallet or bank account.

// Have called up multiple times and have yet to receive this refund. As of 24-May, MMT has (illegally I believe) changed the refund calculations on the site to less than half of the originally confirmed amount (see screenshots).

// I have yet to see ANY outcome or actual work on this. Multiple follow ups and escalations to MMT have yielded naught. Case history on MMT website / my booking is not updated. Follow up calls are assured but forgotten about after initial contact.
