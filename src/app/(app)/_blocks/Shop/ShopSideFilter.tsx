'use client'
import * as Slider from '@radix-ui/react-slider'
import React, { useState } from 'react'
import { Button } from '../../_components/ui/button'

const categories = [
  'All gift bundles',
  'All cards',
  'Best sellers',
  'Sale',
  'For her',
  'For him',
  'Thank you',
  'Celebratory',
  'Self-care',
  'Alcohol-free',
]

const ShopSideFilter = () => {
  const [priceRange, setPriceRange] = useState([70, 199])
  const min = 0
  const max = 500

  return (
    <div>
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <div className="border border-gray-300 rounded-lg p-4">
          <nav className="space-y-2">
            {categories.map((category, index) => (
              <Button key={index} variant="ghost" className="w-full justify-start">
                {category}
              </Button>
            ))}
          </nav>
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Price</h3>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={priceRange}
              onValueChange={setPriceRange}
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
    </div>
  )
}

export default ShopSideFilter
