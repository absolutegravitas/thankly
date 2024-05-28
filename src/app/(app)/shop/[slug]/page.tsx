import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Product } from '@payload-types'
import { fetchProduct } from '@app/_queries'

import { generateMeta } from '@/utilities/generateMeta'
import { ProductTemplate } from './page.client'

export default async function ProductPage({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()
  let product: Product | null = null

  console.log('product page', slug)
  try {
    product = await fetchProduct(slug)
  } catch (error) {
    console.error('Failed to fetch page:', error)
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
    <Suspense fallback="Loading...">
      <ProductTemplate product={product} />
    </Suspense>
  )
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchProduct(slug)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return {}
  }

  // if (!page && slug === 'home') {
  //   page = staticHome
  // }

  return generateMeta({ doc: product })
}
