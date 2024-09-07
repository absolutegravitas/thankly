import { ShoppingCart, Star } from 'lucide-react'
import React from 'react'
import { Button } from '../../_components/ui/button'
import { FilterOptions, SortOption } from '../../(pages)/shop/page'
import { Media, Product, Tag } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import StarRating from '../../_components/StarRating'
import { shippingPrices } from '@/utilities/referenceText'
import ShopProductCard from '../../_components/Shop/ShopProductCard.tsx'

const ITEMS_PER_PAGE = parseInt(process.env.NEXT_PUBLIC_SHOP_ITEMS_PER_PAGE || '12', 10)

interface Props {
  page?: number
  sort?: SortOption
  filters?: FilterOptions
}

const ShopProductGrid = async ({ page, sort, filters }: Props) => {
  try {
    const { products, totalPages, totalDocs } = await fetchProductsList({ page, sort, filters })
    return (
      <div>
        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(!products || products.length === 0) && (
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No products found for your filters.</p>
            </div>
          )}
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ProductGrid:', error)
    return <div>Error loading products. Please try again later.</div>
  }
}

export default ShopProductGrid

const fetchProductsList = async ({
  page = 1,
  sort = 'name_asc',
  filters = {},
}: Props): Promise<{
  products: Product[]
  totalPages: number
  totalDocs: number
}> => {
  'use server'
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })

  const query: any = {
    collection: 'products',
    depth: 1,
    limit: ITEMS_PER_PAGE,
    page,
    where: {
      and: [{ _status: { equals: 'published' } }, { productType: { not_equals: 'addOn' } }],
    },
  }

  // add product type filters if provided
  if (filters.productType && filters.productType.length > 0) {
    query.where.and.push({ productType: { in: filters.productType } })
  }

  // Add category filter if provided
  if (filters.category) {
    query.where.and.push({ 'categories.title': { equals: filters.category } })
  }

  // Add tag filters if provided
  if (filters.tags && filters.tags.length > 0) {
    query.where.and.push({ tags: { in: filters.tags } })
  }

  if (filters.minPrice) {
    query.where.and.push({
      or: [
        {
          and: [
            { 'prices.salePrice': { exists: true } },
            { 'prices.salePrice': { greater_than_equal: filters.minPrice } },
          ],
        },
        {
          and: [
            { 'prices.salePrice': { exists: false } },
            { 'prices.basePrice': { greater_than_equal: filters.minPrice } },
          ],
        },
      ],
    })
  }

  if (filters.maxPrice) {
    query.where.and.push({
      or: [
        {
          and: [
            { 'prices.salePrice': { exists: true } },
            { 'prices.salePrice': { less_than_equal: filters.maxPrice } },
          ],
        },
        {
          and: [
            { 'prices.salePrice': { exists: false } },
            { 'prices.basePrice': { less_than_equal: filters.maxPrice } },
          ],
        },
      ],
    })
  }

  console.log('FILTERS =====', JSON.stringify(filters, null, 2))
  console.log('QUERY =====', JSON.stringify(query, null, 2))

  // Set sorting option
  switch (sort) {
    case 'name_asc':
      query.sort = 'title'
      break
    case 'name_desc':
      query.sort = '-title'
      break
    case 'price_asc':
      query.sort = 'prices.basePrice'
      break
    case 'price_desc':
      query.sort = '-prices.basePrice'
      break
    case 'star_rating':
      query.sort = '-starRating'
  }

  try {
    const productsResult = await payload.find(query)

    return {
      products: productsResult.docs,
      totalPages: productsResult.totalPages,
      totalDocs: productsResult.totalDocs,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
