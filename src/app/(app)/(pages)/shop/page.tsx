/**
 * @file page.tsx
 * @module ShopPage
 * @description Renders the Thankly shop page with a list of available products.
 * @overview
 * This file exports two main components: the `ShopPage` component and the `generateMetadata` function. The `ShopPage` component is responsible for fetching and displaying a list of available products from the PayloadCMS backend. If no products are available, it displays a message informing the user. The `generateMetadata` function is a Next.js utility function that generates metadata for the page, including the title, description, and open graph data.
 *
 * The `ShopPage` component uses the `fetchProductsList` function to fetch the list of products from the PayloadCMS backend. The `fetchProductsList` function utilizes Next.js's `unstable_cache` to cache the fetched data and improve performance. If the cached data is not available or has expired, it fetches fresh data from the backend and caches the result.
 *
 * Once the product data is fetched, the `ShopPage` component checks if there are any products available. If no products are found, it renders a message informing the user that there are no products in the shop. Otherwise, it renders the `ProductGrid` component, passing the fetched products as a prop.
 *
 * The `generateMetadata` function generates static metadata for the page, including the title, description, and open graph data. This metadata is used by search engines and social media platforms to display preview information about the page.
 */

import React from 'react'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import ProductGrid from '@app/_blocks/ProductGrid'
import { BlockWrapper } from '../../_components/BlockWrapper'
import { contentFormats, getPaddingClasses } from '../../_css/tailwindClasses'
import { Gutter } from '../../_components/Gutter'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Product } from '@/payload-types'

const fetchProductsList = (): Promise<Product[] | null> => {
  const cachedFetchProductsList = unstable_cache(
    async (): Promise<Product[] | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let products = null
      try {
        const { docs } = await payload.find({
          collection: 'products',
          depth: 1,
          pagination: false,
          context: {
            select: ['id', 'slug', 'title', 'media', 'prices', 'productType', 'stock', 'meta'],
          },
        })

        products = docs
      } catch (error) {
        console.error(`Error fetching products...`, error)
      } finally {
        return products
      }
    },
    [`fetchProductsList`],
    {
      revalidate: 10,
      tags: [`fetchProductsList`],
    },
  )

  return cachedFetchProductsList()
}

export default async function ShopPage() {
  const products: Product[] | null = await fetchProductsList()

  // console.log('fetchedProducts -- ', products)
  if (!products || products.length === 0) {
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <Gutter>
          <div className="flex flex-col md:flex-row">
            <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-3 pt-6 sm:pt-0">
              <span
                className={[
                  contentFormats.global,
                  contentFormats.p,
                  'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
                ].join(' ')}
              >
                Thankly Shop
              </span>
            </div>
          </div>
          <p className="mt-4 text-gray-500">There are no products in the shop.</p>
        </Gutter>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <h1 className={[contentFormats.global, contentFormats.h1].join(' ')}>Thankly Shop</h1>
        <p className={[contentFormats.global, contentFormats.text].join(' ')}>
          {`Our full range of currently available Thankly Gifts and Cards.`}
        </p>

        {products && products.length > 0 && <ProductGrid products={products} />}
      </Gutter>
    </BlockWrapper>
  )
}

// export basic ShopPage metadata
export async function generateMetadata(): Promise<Metadata> {
  // Static metadata values
  const defaultTitle = 'thankly shop'
  const defaultDescription = 'Our full range of currently available Thankly Gifts and Cards.'
  const defaultImageURL = `${process.env.NEXT_PUBLIC_SERVER_URL}images/og-image.png`
  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: '/',
      images: [
        {
          url: defaultImageURL,
        },
      ],
    },
  }
}
