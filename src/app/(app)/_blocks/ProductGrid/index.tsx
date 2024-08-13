// This file is a server component for Next.js 14 with App Router that renders a grid of product cards.
// It fetches product data from a Payload CMS instance based on provided filters and sorting options.
// The component also displays pagination information and handles loading and error states.

import React from 'react'
import { ProductCard } from '@app/_components/ProductCard'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Product, Category, Tag } from '@/payload-types'

// Sorting options for the product grid
export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'

// Filter options for the product grid
export type FilterOptions = {
  categories?: string[] // Array of category IDs to filter by
  tags?: string[] // Array of tag IDs to filter by
  productType?: string[]
}

// Parameters for the fetchProductsList function
type FetchProductsListParams = {
  page?: number // Page number for pagination
  sort?: SortOption // Sorting option
  filters?: FilterOptions // Filter options
}

// Server component for rendering the product grid
export default async function ProductGrid({
  page, // Page number for pagination
  sort, // Sorting option
  filters, // Filter options
}: {
  page?: number
  sort?: SortOption
  filters?: FilterOptions
}) {
  // console.log('ProductGrid rendered wit  h:', { page, sort, filters })

  try {
    const { products, totalPages, totalDocs } = await fetchProductsList({ page, sort, filters })
    // console.log('Products fetched:', products.length)
    return (
      <React.Fragment>
        <section
          aria-labelledby="products-heading"
          className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
            {(!products || products.length === 0) && (
              <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No products found for your filters.</p>
              </div>
            )}
            {products?.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        </section>
        <div className="mt-5 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{products.length}</span> of{' '}
            <span className="font-medium">{totalDocs}</span> products
          </p>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
      </React.Fragment>
    )
  } catch (error) {
    console.error('Error in ProductGrid:', error)
    return <div>Error loading products. Please try again later.</div>
  }
}

// Fetches product data from Payload CMS based on provided parameters
const fetchProductsList = async ({
  page = 1, // Default to page 1 if not provided
  sort = 'name_asc', // Default to sorting by name in ascending order if not provided
  filters = {}, // Default to no filters if not provided
}: FetchProductsListParams): Promise<{
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
    limit: 10, // Limit to 10 products per page
    page, // Page number
    where: {
      and: [{ _status: { equals: 'published' } }], // Filter for published products
    },
  }

  // add product type filters if provided
  if (filters.productType && filters.productType.length > 0) {
    query.where.and.push({ productType: { in: filters.productType } })
  }

  // Add category filters if provided
  if (filters.categories && filters.categories.length > 0) {
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
