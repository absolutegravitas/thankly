import { Product } from '@/payload-types'
import React from 'react'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'

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
    <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[240px] aspect-[3/4]">
      <div className="aspect-[4/3] relative overflow-hidden">
        {images && images.length > 0 && (
          <img
            src={getImageUrl(images[0]?.mediaItem)}
            // alt="Product Image"
            alt={getImageAlt(images[0]?.mediaItem)}
            // className="object-cover w-full h-full"
            className="absolute inset-0 w-full h-full object-cover"
            // style={{ aspectRatio: '500/375', objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="p-4 grid gap-2">
        <h3 className="text-xl font-bold">{product.title}</h3>
        <div className="flex items-center justify-between">
          <div className="text-olive-600 font-bold">Qty {quantity}</div>
          <div>
            {onSale && (
              <>
                <div className="text-muted-foreground line-through text-xs">
                  Full Price: {basePrice}
                </div>
                <div className="text-muted-foreground">Price: {salePrice}</div>
                <div className="font-medium">Total: ${quantity * salePrice}</div>
              </>
            )}
            {!onSale && (
              <>
                <div className="text-muted-foreground">Price: {basePrice}</div>
                <div className="font-medium">Total: ${quantity * basePrice}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
