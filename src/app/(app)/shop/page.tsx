import React from 'react'
import { draftMode } from 'next/headers'
import { fetchShopList } from '@app/_queries/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '@app/_blocks/ProductGrid'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const { isEnabled: isDraftMode } = draftMode()
  let products = null

  try {
    products = await fetchShopList()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return notFound()
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="mt-4 text-gray-500">There are no products in the shop.</p>
        </div>
      </div>
    )
  }

  return <ProductGrid products={products} />
}
