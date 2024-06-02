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
  return <ProductGrid products={products} />
}

export default ShopClient
