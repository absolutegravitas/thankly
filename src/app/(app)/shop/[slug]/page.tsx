import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ProductBlock from '@app/_blocks/ProductBlock'
import type { Product } from '@payload-types'
import Blocks from '../../_blocks'
import { fetchProduct } from '../../_queries/products'

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

  // Use the isProductInOrder function from the order provider

  return (
    <React.Fragment>
      <ProductBlock product={product} selectedImageIndex={selectedImageIndex} />
      <Blocks blocks={product?.layout?.root?.children} />
    </React.Fragment>
  )
}
