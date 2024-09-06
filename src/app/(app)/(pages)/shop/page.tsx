// This file is a server component in Next.js 14 that renders the Shop page of a web application.
// It displays a grid of available products fetched from a content management system (CMS) called Payload.
// If no products are available, it shows a message indicating an empty shop.
import React, { useState } from 'react'
import { Metadata } from 'next'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { notFound } from 'next/navigation'
import { getPaddingClasses } from '../../_css/tailwindClasses'
import { Suspense } from 'react'
import LoadingShop from './loading'
import ProductGrid from '../../_blocks/ProductGrid'
import Filters from '../../_blocks/Shop/Filters'

import * as Slider from '@radix-ui/react-slider'
import { Button } from '@app/_components/ui/button'
import { Star, ShoppingCart, Check } from 'lucide-react'
import ShopSideFilter from '../../_blocks/Shop/ShopSideFilter'
import ShopTopFilter from '../../_blocks/Shop/ShopTopFilter'
import ShopProductGrid from '../../_blocks/Shop/ShopProductGrid'

// Define a type alias for the sort options
export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'star_rating'

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
  // console.log('Updated searchParams in page.tsx:', searchParams)
  // console.log('ShopPage rendered with searchParams:', searchParams)

  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const sort = searchParams?.sort as SortOption | undefined
  const filters: FilterOptions = {
    categories: searchParams?.category,
    tags: searchParams?.tags,
    productType: searchParams?.productType,
  }

  return (
    <div className="container mx-auto p-4">
      {/* <Filters />
      <Suspense fallback={<LoadingShop />}>
        <ProductGrid page={page} sort={sort} filters={filters} />
      </Suspense> */}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <ShopSideFilter />

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Sort options */}
          <ShopTopFilter />

          {/* Product grid */}
          <ShopProductGrid />
        </div>
      </div>
    </div>
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
