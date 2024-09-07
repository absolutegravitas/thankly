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

const ShopSideFilter = ({ categories }: Props) => {
  const min = 0
  const max = 500
  const [priceRange, setPriceRange] = useState([min, max])
  const [selectedCategory, setSelectedCategory] = useState('All')
  // const [categories, setCategories] = useState<Category[]>([])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const fetchedCategories = await FetchItems({
  //       collection: 'categories',
  //       // where: "{'shopConfig.visible' {equals: true}}",
  //       // sort: 'shopConfig.sortOrder',
  //     })
  //     setCategories(fetchedCategories)
  //   }
  //   fetchCategories()
  // }, [])

  useEffect(() => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const category = searchParams.get('category')

    setPriceRange([minPrice ? parseInt(minPrice) : min, maxPrice ? parseInt(maxPrice) : max])
    setSelectedCategory(category || 'All')
  }, [searchParams])

  const updateURL = useCallback(
    (newValues: number[], category: string) => {
      const params = new URLSearchParams(searchParams)

      if (newValues[0] > min) {
        params.set('minPrice', newValues[0].toString())
      } else {
        params.delete('minPrice')
      }

      if (newValues[1] < max) {
        params.set('maxPrice', newValues[1].toString())
      } else {
        params.delete('maxPrice')
      }

      if (category !== 'All') {
        params.set('category', category)
      } else {
        params.delete('category')
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router, min, max],
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
    (category: string) => {
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
            className={`w-full justify-start ${selectedCategory === 'All' ? 'font-extrabold' : ''}`}
            onClick={() => handleCategoryChange('All')}
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
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Price</h3>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            min={min}
            max={max}
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
