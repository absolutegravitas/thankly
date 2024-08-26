import { Media, Product } from '@/payload-types'
import React from 'react'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { log } from 'console'
import { IconProps } from '@app/_icons/types'
import { CartItem } from '@app/_blocks/Cart/cart-types'

interface Props {
  cartItem: CartItem
  width: number
  height: number
}

const ProductThumbnail = ({ cartItem, width = 200, height = 200 }: Props) => {
  // Destructure product and product prices
  const { product, quantity } = cartItem
  const { media: images } = product as Product

  // return (
  //   <div className="bg-background rounded-2xl shadow-lg overflow-hidden w-full max-w-[240px] aspect-[3/5]  bg-thankly-offwhite">
  //     <div className="aspect-[4/4] relative overflow-hidden">
  //       {images && images.length > 0 && (
  //         <img
  //           // src={(images[0].mediaItem! as Media).url as string}
  //           src={getImageUrl(images[0]!.mediaItem)}
  //           // alt="Product Image"
  //           alt={getImageAlt(images[0]!.mediaItem)}
  //           // className="object-cover w-full h-full"
  //           className="absolute inset-0 w-full h-full object-cover"
  //           // style={{ aspectRatio: '500/375', objectFit: 'cover' }}
  //         />
  //       )}
  //     </div>
  //     <div className="p-4 space-y-2">
  //       <div className="flex flex-col space-y-0">
  //         <h3 className="text-xl font-bold">{(product as Product).title}</h3>
  //         <div className="flex flex-row">
  //           <div className="text-olive-600 font-bold text-lg text-thankly-green">
  //             Qty {quantity}
  //           </div>
  //         </div>
  //         <div className="text-muted-foreground">Price: ${unitPrice}</div>
  //         <div className="text-muted-foreground">Total: ${(quantity * unitPrice).toFixed(2)}</div>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
    <div className="relative w-full max-w-[200px] aspect-square group">
      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium z-10">
        <span>{quantity}</span>
      </div>
      <div className="w-full h-full bg-background border border-muted rounded-lg overflow-hidden">
        {images && images.length > 0 && (
          <img
            src={getImageUrl(images[0]!.mediaItem)}
            alt={getImageAlt(images[0]!.mediaItem)}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '200/200', objectFit: 'cover' }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductThumbnail
