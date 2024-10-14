'use client'
import React, { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@app/_components/ui/button'
import { Check } from 'lucide-react'

interface FilterOption {
  label: string
  id: string
  paramValue: string
}

const productTypeFilterOptions: FilterOption[] = [
  { label: 'Gift bundles only', id: 'gift-bundles', paramValue: 'gift' },
  { label: 'Cards only', id: 'cards', paramValue: 'card' },
]

const sortOptions: FilterOption[] = [
  { label: 'Price ascending', id: 'price-asc', paramValue: 'price_asc' },
  { label: 'Price descending', id: 'price-desc', paramValue: 'price_desc' },
  { label: 'Customer rating', id: 'rating', paramValue: 'star_rating' },
]

const ShopTopFilter: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams.toString())
      updates.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [searchParams],
  )

  const toggleFilter = useCallback(
    (paramName: string, paramValue: string) => {
      const currentValue = searchParams.get(paramName)
      const newValue = currentValue === paramValue ? null : paramValue
      const updates = [
        { name: paramName, value: newValue },
        { name: 'page', value: null }, // Always remove the 'page' parameter
      ]

      // If we're changing productType, remove the category param
      if (paramName === 'productType') {
        updates.push({ name: 'category', value: null })
      }

      const newQueryString = createQueryString(updates)
      router.push(`?${newQueryString}`)
    },
    [router, searchParams, createQueryString],
  )

  const renderFilterButton = (option: FilterOption, paramName: string) => {
    const isActive = searchParams.get(paramName) === option.paramValue
    return (
      <Button
        key={option.id}
        variant={isActive ? 'default' : 'outline'}
        className={`flex items-center space-x-2 rounded-lg w-full sm:w-auto justify-start ${
          isActive
            ? 'bg-gray-200 text-gray-800 border-2 border-gray-300 hover:bg-gray-300'
            : 'hover:bg-gray-100'
        }`}
        onClick={() => toggleFilter(paramName, option.paramValue)}
      >
        {isActive && <Check className="w-4 h-4 text-gray-800" />}
        <span>{option.label}</span>
      </Button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-6">
      {productTypeFilterOptions &&
        productTypeFilterOptions.map((option) => renderFilterButton(option, 'productType'))}
      {sortOptions && sortOptions.map((option) => renderFilterButton(option, 'sort'))}
    </div>
  )
}

export default ShopTopFilter
