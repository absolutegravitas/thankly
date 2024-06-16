import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Product } from '@payload-types'
import { fetchProduct, fetchProductSlugs } from '@app/_queries/products'

import { generateMeta } from '@/utilities/generateMeta'

// export const revalidate = 7200 // 2 hours

export default async function Profile({ params: { slug } }: any) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null
  product = await fetchProduct(slug)

  // if there's no page, or page is not an object then also return not found
  if (
    !product ||
    typeof product !== 'object' ||
    (Object.keys(product).length === 0 && product.constructor === Object)
  ) {
    return notFound()
  }

  return (
    <React.Fragment>
      <Suspense fallback="fetching page"></Suspense>
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  let products: Product[] | null = null

  // try {
  //   products = await fetchProducts()
  // } catch (error) {
  //   console.error('fetchProducts error //', error)
  //   return []
  // }

  // // console.log('products found //', products)

  // // Strip all keys from pages except slug
  // if (products && products.length > 0) {
  //   return products.map(({ slug }: any) => ({ slug }))
  // }

  return []
}

export async function generateMetadata({ params: { slug } }: any): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchProduct(slug)
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static home page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  return generateMeta({ doc: product })
}
