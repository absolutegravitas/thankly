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
import FetchItems from '@/utilities/PayloadQueries/fetchItems'

// Define a type alias for the sort options
export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'star_rating'

// Define a type alias for the filter options
export type FilterOptions = {
  category?: string[]
  tags?: string[]
  productType?: string
  minPrice?: number
  maxPrice?: number
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
    productType?: string
    minPrice?: string
    maxPrice?: string
  }
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const sort = searchParams?.sort as SortOption | undefined
  let filters: FilterOptions = {
    category: searchParams?.category,
    tags: searchParams?.tags,
    productType: searchParams?.productType,
  }
  if (searchParams?.minPrice) {
    filters = { ...filters, minPrice: parseInt(searchParams.minPrice) }
  }
  if (searchParams?.maxPrice) {
    filters = { ...filters, maxPrice: parseInt(searchParams.maxPrice) }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <ShopSideFilter />

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Sort options */}
          <ShopTopFilter />

          {/* Product grid */}
          <Suspense fallback={<LoadingShop />}>
            <ShopProductGrid page={page} sort={sort} filters={filters} />
          </Suspense>
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
