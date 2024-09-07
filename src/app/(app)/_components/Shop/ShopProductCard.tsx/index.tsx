import { Media, Product, Tag } from '@/payload-types'
import React from 'react'
import StarRating from '@app/_components/StarRating'
import { Button } from '@app/_components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface Props {
  product: Product
}

const ShopProductCard = ({ product }: Props) => {
  return (
    <Link href={`/shop/${product.slug}`} className="block">
      <div className="border rounded-lg p-4 flex flex-col">
        <div className="relative w-full pb-[100%] mb-2">
          {product.media && product.media.length > 0 ? (
            <div className="absolute inset-0 overflow-hidden rounded-md">
              <img
                src={(product.media?.[0].mediaItem as Media).url ?? undefined}
                alt={(product.media?.[0].mediaItem as Media).alt ?? undefined}
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Image not found</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-wrap">
            {product.displayTags?.map((item, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
              >
                {(item as Tag).title}
              </span>
            ))}
          </div>
        </div>
        <h3 className="font-semibold mt-2">{product.title}</h3>
        <div className="flex items-center mt-1 min-h-5">
          <StarRating rating={product.starRating} />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">${product.prices.basePrice}</span>
          <Button size="icon">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}

export default ShopProductCard
