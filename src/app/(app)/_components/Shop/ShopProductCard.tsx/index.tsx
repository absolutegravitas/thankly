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
        <div className="relative">
          {product.media && product.media.length > 0 ? (
            <img
              src={(product.media?.[0].mediaItem as Media).url ?? undefined}
              alt={(product.media?.[0].mediaItem as Media).alt ?? undefined}
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <img
              src={'/placeholder.svg?height=200&width=200'}
              alt={'Product image not found'}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          {/* {product.tag && (
      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
        {product.tag}
      </span>
    )} */}
          {product.displayTags?.map((item, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {(item as Tag).title}
            </span>
          ))}
        </div>
        <h3 className="font-semibold mt-2">{product.title}</h3>
        <div className="flex items-center mt-1">
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
