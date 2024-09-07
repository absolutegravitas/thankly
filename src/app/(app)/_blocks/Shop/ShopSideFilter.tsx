'use client'
import * as Slider from '@radix-ui/react-slider'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Button } from '../../_components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { Category } from '@/payload-types'

interface Props {
  categories: Category[]
}

const MIN_PRICE = parseInt(process.env.NEXT_PUBLIC_SHOP_MIN_PRICE || '0', 10)
const MAX_PRICE = parseInt(process.env.NEXT_PUBLIC_SHOP_MAX_PRICE || '500', 10)

const ShopSideFilter = ({ categories }: Props) => {
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const category = searchParams.get('category')

    setPriceRange([
      minPrice ? parseInt(minPrice) : MIN_PRICE,
      maxPrice ? parseInt(maxPrice) : MAX_PRICE,
    ])
    setSelectedCategory(category || null)
  }, [searchParams])

  const updateURL = useCallback(
    (newValues: number[], category: string | null) => {
      const params = new URLSearchParams(searchParams)

      if (newValues[0] > MIN_PRICE) {
        params.set('minPrice', newValues[0].toString())
      } else {
        params.delete('minPrice')
      }

      if (newValues[1] < MAX_PRICE) {
        params.set('maxPrice', newValues[1].toString())
      } else {
        params.delete('maxPrice')
      }

      if (category) {
        params.set('category', category)
      } else {
        params.delete('category')
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router, MIN_PRICE, MAX_PRICE],
  )

  const debouncedUpdateURL = useMemo(() => debounce(updateURL, 300), [updateURL])

  const handlePriceRangeChange = useCallback(
    (newValues: number[]) => {
      setPriceRange(newValues)
      debouncedUpdateURL(newValues, selectedCategory)
    },
    [debouncedUpdateURL, selectedCategory],
  )

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category)
      updateURL(priceRange, category)
    },
    [updateURL, priceRange],
  )

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel()
    }
  }, [debouncedUpdateURL])

  return (
    <div className="w-full md:w-1/5">
      <div className="border border-gray-300 rounded-lg p-4">
        <nav className="space-y-2">
          <Button
            key="All"
            variant="ghost"
            className={`w-full justify-start ${selectedCategory === null ? 'font-extrabold' : ''}`}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </Button>
          {categories.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${selectedCategory === item.title ? 'font-extrabold' : ''}`}
              onClick={() => handleCategoryChange(item.title)}
            >
              {item.shopConfig!.shopFilterTitle || item.title}
            </Button>
          ))}
        </nav>
        {/* Price slider code remains unchanged */}
      </div>
    </div>
  )
}

export default ShopSideFilter
