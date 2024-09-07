import { ShoppingCart, Star } from 'lucide-react'
import React from 'react'
import { Button } from '../../_components/ui/button'
import { FilterOptions, SortOption } from '../../(pages)/shop/page'
import { Media, Product, Tag } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import StarRating from '../../_components/StarRating'

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
            <div key={product.id} className="border rounded-lg p-4 flex flex-col">
              <div className="relative">
                {product.media && product.media.length > 0 ? (
                  <img
                    src={(product.media?.[0].mediaItem as Media).url ?? undefined}
                    alt={(product.media?.[0].mediaItem as Media).alt ?? undefined}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <img
                    src={'/placeholder.svg?height=200&width=200'}
                    alt={'Product image not found'}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                {/* {product.tag && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {product.tag}
                  </span>
                )} */}
                {product.displayTags?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    {(item as Tag).title}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold mt-2">{product.title}</h3>
              <div className="flex items-center mt-1">
                <StarRating rating={4} />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold">${product.prices.basePrice}</span>
                <Button size="icon">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </Button>
              </div>
            </div>
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

// Fetches product data from Payload CMS based on provided parameters
const fetchProductsList = async ({
  page = 1, // Default to page 1 if not provided
  sort = 'name_asc', // Default to sorting by name in ascending order if not provided
  filters = {}, // Default to no filters if not provided
}: Props): Promise<{
  products: Product[] // Array of fetched products
  totalPages: number // Total number of pages
  totalDocs: number // Total number of documents
}> => {
  'use server' // Ensure this function runs on the server
  const config = await configPromise // Load Payload CMS configuration
  const payload: any = await getPayloadHMR({ config }) // Initialize Payload CMS instance

  const query: any = {
    collection: 'products', // Fetch data from the 'products' collection
    depth: 1, // Include related data up to depth 1
    limit: ITEMS_PER_PAGE,
    page, // Page number
    where: {
      and: [{ _status: { equals: 'published' } }, { productType: { not_equals: 'addOn' } }], // Filter for published products
    },
  }

  // add product type filters if provided
  if (filters.productType && filters.productType.length > 0) {
    query.where.and.push({ productType: { in: filters.productType } })
  }

  // Add category filters if provided
  if (filters.categories) {
    query.where.and.push({ categories: { in: filters.categories } })
  }

  // Add tag filters if provided
  if (filters.tags && filters.tags.length > 0) {
    query.where.and.push({ tags: { in: filters.tags } })
  }

  // Set sorting option
  switch (sort) {
    case 'name_asc':
      query.sort = 'title' // Sort by product title in ascending order
      break
    case 'name_desc':
      query.sort = '-title' // Sort by product title in descending order
      break
    case 'price_asc':
      query.sort = 'prices.basePrice' // Sort by product base price in ascending order
      break
    case 'price_desc':
      query.sort = '-prices.basePrice' // Sort by product base price in descending order
      break
    case 'star_rating':
      query.sort = '-starRating'
  }

  try {
    const productsResult = await payload.find(query) // Execute the query to fetch products

    return {
      products: productsResult.docs, // Array of fetched products
      totalPages: productsResult.totalPages, // Total number of pages
      totalDocs: productsResult.totalDocs, // Total number of documents
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error // Re-throw the error for further handling
  }
}
