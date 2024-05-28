'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Product } from '@payload-types'
import ProductGrid from '../_blocks/ProductGrid'

type ShopClientProps = {
  products: Product[]
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const ShopClient: React.FC<ShopClientProps> = ({
  products,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState('')

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', newPage.toString())
    if (filters) newSearchParams.set('filters', JSON.stringify(filters))
    if (sort) newSearchParams.set('sort', sort)
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
    router.push(newUrl)
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('filters', JSON.stringify(newFilters))
    if (sort) newSearchParams.set('sort', sort)
    newSearchParams.set('page', '1') // Reset to the first page
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
    router.push(newUrl)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('sort', newSort)
    if (filters) newSearchParams.set('filters', JSON.stringify(filters))
    newSearchParams.set('page', '1') // Reset to the first page
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`
    router.push(newUrl)
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('filters')) setFilters(JSON.parse(params.get('filters') || '{}'))
    if (params.has('sort')) setSort(params.get('sort') || '')
  }, [searchParams])

  return (
    <div>
      {/* <h1>Products</h1> */}
      {/* Render filters and sort options */}
      {/* <div>
        <button onClick={() => handleFilterChange({ productType: 'gift' })}>Filter by Gifts</button>
        <button onClick={() => handleSortChange('price')}>Sort by Price</button>
      </div> */}
      <ul>
        {/* {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))} */}
        <ProductGrid products={...products} />
      </ul>
      <div>
        {hasPrevPage && <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>}
        {hasNextPage && <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>}
      </div>
    </div>
  )
}

export default ShopClient
