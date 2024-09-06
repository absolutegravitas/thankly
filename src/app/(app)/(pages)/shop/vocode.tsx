import React, { useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Check } from 'lucide-react'

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

const sortOptions = [
  { label: 'Gift bundles only', active: true },
  { label: 'Cards only', active: false },
  { label: 'Price ascending', active: false },
  { label: 'Price descending', active: false },
  { label: 'Customer rating', active: false },
]

const products = [
  {
    id: 1,
    name: 'The Espresso Martini Hour',
    rating: 4,
    price: 69,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 2,
    name: 'The Happy Chappy',
    rating: 4,
    price: 89,
    image: '/placeholder.svg?height=200&width=200',
    tag: 'new',
  },
  {
    id: 3,
    name: 'The Professional Overthinker',
    rating: 4,
    price: 109,
    image: '/placeholder.svg?height=200&width=200',
    tag: 'best seller',
  },
  {
    id: 4,
    name: 'The New Dad Kit',
    rating: 4,
    price: 109,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 5,
    name: 'The Pasta Night',
    rating: 4,
    price: 99,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 6,
    name: 'The Grateful for You',
    rating: 4,
    price: 99,
    image: '/placeholder.svg?height=200&width=200',
    tag: 'best seller',
  },
]

export default function Component() {
  const [priceRange, setPriceRange] = useState([70, 199])
  const [activeSortOption, setActiveSortOption] = useState('Gift bundles only')
  const min = 0
  const max = 500

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
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

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Sort options */}
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

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  {product.tag && (
                    <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mt-2">{product.name}</h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold">${product.price}</span>
                  <Button size="icon">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Add to cart</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
