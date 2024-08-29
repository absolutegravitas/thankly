import { Media, Product } from '@/payload-types'
import React from 'react'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { log } from 'console'
import { IconProps } from '@app/_icons/types'
import { CartItem } from '@app/_blocks/Cart/cart-types'

interface Props {
  cartItem: CartItem
}

const ProductThumbnail = ({ cartItem }: Props) => {
  // Destructure product and product prices
  const { product, quantity } = cartItem
  const { media: images } = product as Product

  return (
    <div className="relative w-full max-w-[70px] aspect-square group rounded-lg">
      <div className="absolute -top-3 -right-3 bg-thankly-green rounded-full w-5 h-5 flex items-center justify-center text-white font-medium z-10">
        <span>
          <p className="text-xs">{quantity}</p>
        </span>
      </div>
      <div className="w-full h-full bg-background border rounded-lg border-stone-400 overflow-hidden">
        {images && images.length > 0 && (
          <img
            src={getImageUrl(images[0]!.mediaItem)}
            alt={getImageAlt(images[0]!.mediaItem)}
            className="w-full h-full object-cover"
            // style={{ aspectRatio: '150/150', objectFit: 'cover' }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductThumbnail
