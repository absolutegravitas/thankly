import React from 'react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import LoadingShop from './loading'

import ShopSideFilter from '../../_blocks/Shop/ShopSideFilter'
import ShopTopFilter from '../../_blocks/Shop/ShopTopFilter'
import ShopProductGrid from '../../_blocks/Shop/ShopProductGrid'
import { Button } from '../../_components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../_components/ui/sheet'

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'star_rating'

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
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mobile Sheet */}
        <div className="md:hidden w-full mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                Shop Options
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4 h-full overflow-y-auto">
                <ShopSideFilter />
                <ShopTopFilter />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-1/4">
          <ShopSideFilter />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Sort options */}
          <div className="hidden md:block mb-4">
            <ShopTopFilter />
          </div>

          {/* Product grid */}
          <Suspense fallback={<LoadingShop />}>
            <ShopProductGrid page={page} sort={sort} filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
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
