import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ShopClient from './page.client'
import { fetchShopList } from '../_queries/products'
import { revalidateCache } from '@/utilities/revalidateCache'

export default async function Shop() {
  const { isEnabled: isDraftMode } = draftMode()
  let products: any | null = null

  try {
    revalidateCache({ path: '/shop' })
    products = await fetchShopList()
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

  // console.log('/shop products found ', products)

  return <ShopClient products={products} />
}
