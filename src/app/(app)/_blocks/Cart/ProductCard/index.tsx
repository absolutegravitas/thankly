import { Media, Product } from '@/payload-types'
import React from 'react'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { log } from 'console'

interface ProductBlockContentProps {
  product: Product // The product data to be displayed
  quantity: number // the quantity of the product in the cart
}

const ProductCard: React.FC<ProductBlockContentProps> = ({ product, quantity }) => {
  // Destructure product prices
  const {
    media: images,
    prices: { salePrice, basePrice },
  } = product

  // Calculate if the product is on sale
  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  return (
    <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[240px] aspect-[3/5]  bg-thankly-offwhite">
      <div className="aspect-[4/4] relative overflow-hidden">
        {images && images.length > 0 && (
          <img
            // src={(images[0].mediaItem! as Media).url as string}
            src={getImageUrl(images[0]!.mediaItem)}
            // alt="Product Image"
            alt={getImageAlt(images[0]!.mediaItem)}
            // className="object-cover w-full h-full"
            className="absolute inset-0 w-full h-full object-cover"
            // style={{ aspectRatio: '500/375', objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-col space-y-0">
          <h3 className="text-xl font-bold">{product.title}</h3>
          <div className="text-olive-600 font-bold text-lg text-thankly-green">Qty {quantity}</div>
          <div className="text-muted-foreground">Price: ${onSale ? salePrice : basePrice}</div>
          <div className="text-muted-foreground">Total: ${quantity * basePrice}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
