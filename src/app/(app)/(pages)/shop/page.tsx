// This file is a server component in Next.js 14 that renders the Shop page of a web application.
// It displays a grid of available products fetched from a content management system (CMS) called Payload.
// If no products are available, it shows a message indicating an empty shop.
import React from 'react'
import { Metadata } from 'next'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { notFound } from 'next/navigation'
import { getPaddingClasses } from '../../_css/tailwindClasses'
import { Suspense } from 'react'
import LoadingShop from './loading'
import ProductGrid from '../../_blocks/ProductGrid'
import Filters from '../../_blocks/Shop/Filters'

// Define a type alias for the sort options
export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'

// Define a type alias for the filter options
export type FilterOptions = {
  categories?: string[]
  tags?: string[]
  productType?: string[]
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
    sort?: SortOption
    category?: string[]
    tags?: string[]
    productType?: string[]
  }
}) {
  console.log('Updated searchParams in page.tsx:', searchParams)
  console.log('ShopPage rendered with searchParams:', searchParams)

  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const sort = searchParams?.sort as SortOption | undefined
  const filters: FilterOptions = {
    categories: searchParams?.category,
    tags: searchParams?.tags,
    productType: searchParams?.productType,
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{`Thankly Shop`}</h1>
        <p className="mt-4 max-w-xl text-sm text-gray-700">
          {`Our thoughtfully curated thankly gifts and cards.`}
        </p>

        <main>
          <Filters />

          <Suspense fallback={<LoadingShop />}>
            <ProductGrid page={page} sort={sort} filters={filters} />
          </Suspense>
        </main>
      </Gutter>
    </BlockWrapper>
  )
}

// Generates metadata for the Shop page
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
