// This file is responsible for rendering the product details page for a specific product in the Thankly Shop application.
// It uses Next.js 14's App Router and server components to fetch and display the product information.
// The generateMetadata function generates the metadata (title, description, and OpenGraph data) for the page based on the product information.
// The generateStaticParams function fetches a list of all available product slugs from the Payload CMS, which is used for static site generation.
// The fetchProduct utility function fetches the product data from the Payload CMS based on the provided slug and caches the response using Next.js's unstable_cache.

import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ProductBlock from '@app/_blocks/ProductBlock'
import type { Product } from '@payload-types'
import Blocks from '@app/_blocks'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { fetchProduct } from '@/utilities/PayloadQueries/fetchProduct'

// Component that renders the product details page
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

// Function to generate metadata for the product details page
export async function generateMetadata({
  params: { slug },
}: {
  params: { slug?: string | string[] }
}): Promise<Metadata> {
  const slugString = Array.isArray(slug) ? slug.join('/') : slug

  // Default (generic) metadata
  const defaultTitle = 'Thankly Shop'
  const defaultDescription = 'Our full range of currently available Thankly Gifts and Cards.'
  const defaultImageURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/images/og-image.png`

  if (!slugString) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: mergeOpenGraph({
        title: defaultTitle,
        description: defaultDescription,
        url: '/',
        images: [{ url: defaultImageURL }],
      }),
    }
  }

  try {
    const product = await fetchProduct(slugString)

    const ogImage =
      typeof product.meta.image === 'object' &&
      product.meta.image !== null &&
      'url' in product.meta.image &&
      `${process.env.NEXT_PUBLIC_SERVER_URL}${product.meta.image.url}`

    return {
      title: product.meta.title || defaultTitle,
      description: product.meta.description || defaultDescription,
      openGraph: mergeOpenGraph({
        title: product.meta.title || defaultTitle,
        description: product.meta.description || defaultDescription,
        url: Array.isArray(slug) ? slug.join('/') : '/',
        images: ogImage ? [{ url: ogImage }] : [{ url: defaultImageURL }],
      }),
    }
  } catch {
    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: mergeOpenGraph({
        title: defaultTitle,
        description: defaultDescription,
        url: '/',
        images: [{ url: defaultImageURL }],
      }),
    }
  }
}
