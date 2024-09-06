import { ShoppingCart, Star } from 'lucide-react'
import React from 'react'
import { Button } from '../../_components/ui/button'

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

const ShopProductGrid = () => {
  return (
    <div>
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
  )
}

export default ShopProductGrid
