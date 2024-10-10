'use client'
import * as Slider from '@radix-ui/react-slider'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Button } from '../../_components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { Category } from '@/payload-types'
import FetchItems from '@/utilities/PayloadQueries/fetchItems'

const MIN_PRICE = parseInt(process.env.NEXT_PUBLIC_SHOP_MIN_PRICE || '0', 10)
const MAX_PRICE = parseInt(process.env.NEXT_PUBLIC_SHOP_MAX_PRICE || '200', 10)

const ShopSideFilter = () => {
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const fetchCategories = useCallback(async (productType?: string | null) => {
    console.log('Fetching categories with productType:', productType)
    type WhereCondition = {
      shopConfig?: { visible: { equals: boolean } }
      productType?: { equals: string }
    }
    type WhereClause = WhereCondition | { and: WhereCondition[] }

    let categories_where_clause: WhereClause = { shopConfig: { visible: { equals: true } } }

    if (productType) {
      categories_where_clause = {
        and: [
          { shopConfig: { visible: { equals: true } } },
          { productType: { equals: productType } },
        ],
      }
    }

    try {
      const fetchedCategories = await FetchItems({
        collection: 'categories',
        where: categories_where_clause,
        sort: 'shopConfig.sortOrder',
      })
      console.log('Fetched categories:', fetchedCategories)
      setCategories(fetchedCategories)
    } catch (error) {
      console.error('Error fetching product categories:', error)
    }
  }, [])

  useEffect(() => {
    const productType = searchParams.get('productType')
    fetchCategories(productType)
  }, [searchParams, fetchCategories])

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
      params.delete('page')

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
    [searchParams, pathname, router],
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
              {item.shopConfig?.shopFilterTitle || item.title}
            </Button>
          ))}
        </nav>
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Price</h3>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={1}
          >
            <Slider.Track className="bg-gray-300 relative grow rounded-full h-1.5">
              <Slider.Range className="absolute bg-gray-700 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-3.5 h-3.5 bg-white border-2 border-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-opacity-75"
              aria-label="Minimum price"
            />
            <Slider.Thumb
              className="block w-3.5 h-3.5 bg-white border-2 border-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-opacity-75"
              aria-label="Maximum price"
            />
          </Slider.Root>
          <div className="flex justify-between mt-2 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopSideFilter
