/**
 * @file page.tsx
 * @module ProductPage
 * @description This file contains the ProductPage component for displaying product details and layout.
 * @overview
 * The ProductPage component is a Next.js page component that renders a product detail page for a specific product based on the provided slug parameter. It fetches the product data from the backend using the fetchProduct query function and renders the ProductBlock component to display the product details and images. Additionally, it renders any layout blocks associated with the product using the Blocks component. The component utilizes server-side rendering (SSR) to fetch the product data on the server and notFound to handle cases where the product is not found or invalid. It also supports draft mode for previewing unpublished content.
 */

import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ProductBlock from '@app/_blocks/ProductBlock'
import type { Product } from '@payload-types'
import Blocks from '../../../_blocks'
import { fetchProduct } from '../../../_queries/products'

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

  return (
    <React.Fragment>
      <ProductBlock product={product} selectedImageIndex={selectedImageIndex} />
      <Blocks blocks={product?.layout?.root?.children} />
    </React.Fragment>
  )
}
