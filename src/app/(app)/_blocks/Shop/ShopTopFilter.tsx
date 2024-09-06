'use client'
import React, { useState } from 'react'
import { Button } from '../../_components/ui/button'
import { Check } from 'lucide-react'

const sortOptions = [
  { label: 'Gift bundles only', active: true },
  { label: 'Cards only', active: false },
  { label: 'Price ascending', active: false },
  { label: 'Price descending', active: false },
  { label: 'Customer rating', active: false },
]

const ShopTopFilter = () => {
  const [activeSortOption, setActiveSortOption] = useState('Gift bundles only')

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sortOptions.map((option) => (
        <Button
          key={option.label}
          variant={option.label === activeSortOption ? 'default' : 'outline'}
          className="flex items-center space-x-2"
          onClick={() => setActiveSortOption(option.label)}
        >
          {option.label === activeSortOption && <Check className="w-4 h-4 text-white" />}
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default ShopTopFilter
