import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Product } from '@payload-types'
import { fetchProducts } from '@app/_queries'
import ShopClient from './page.client'

type ShopProps = {
  params: { slug: string }
  searchParams: { page?: string; filters?: string; sort?: string }
}

export default async function Shop({ params: { slug }, searchParams }: ShopProps) {
  const { isEnabled: isDraftMode } = draftMode()
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const pageSize = 10
  const filters = searchParams.filters ? JSON.parse(searchParams.filters) : {}
  const sort = searchParams.sort || ''

  let products: Product[] = []
  let totalDocs: number = 0
  let totalPages: number = 0
  let hasNextPage: boolean = false
  let hasPrevPage: boolean = false

  try {
    const result = await fetchProducts(page, pageSize, filters, sort)
    if (result) {
      products = result.products
      totalDocs = result.totalDocs
      totalPages = result.totalPages
      hasNextPage = result.hasNextPage
      hasPrevPage = result.hasPrevPage
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return notFound()
  }

  if (!products || products.length === 0) {
    return (
      <div>
        <h1>Products</h1>
        <p>There are no products in the shop.</p>
      </div>
    )
  }

  return (
    <ShopClient
      products={products}
      totalPages={totalPages}
      currentPage={page}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
    />
  )
}
