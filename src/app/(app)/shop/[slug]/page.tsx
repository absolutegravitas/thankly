import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Product } from '@payload-types'
import { fetchProduct, fetchProducts } from '@app/_queries'
import { fetchProductsList } from '../../_queries/products'
import { generateMeta } from '@/utilities/generateMeta'
import { ProductTemplate } from './page.client'
import { fetchDocs } from '../../_queries/graphql/fetchDocs'

export default async function ProductPage({ params: { slug } }: any) {
  const { isEnabled: isDraftMode } = draftMode()
  let product: Product | null = null

  // console.log('product page', slug)
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

export async function generateStaticParams() {
  return await fetchProductsList()
}

export async function generateMetadata({ params: { slug } }: any): Promise<Metadata> {
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
