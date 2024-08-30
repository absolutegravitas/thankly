import { Media, Product } from '@/payload-types'
import React from 'react'
import { getImageAlt, getImageUrl } from '@/utilities/getImageDetails'
import { log } from 'console'
import { Button } from '@app/_components/ui/button'
import { IconProps } from '@app/_icons/types'
import { CartItem } from '@app/_blocks/Cart/cart-types'

interface ProductBlockContentProps {
  cartItem: CartItem
  // product: Product // The product data to be displayed
  // quantity: number // the quantity of the product in the cart
  onQuantityChange: (cartItemId: string, quantity: number) => void
}

const ProductCard: React.FC<ProductBlockContentProps> = ({ cartItem, onQuantityChange }) => {
  // Destructure product and product prices
  const { itemId, product, quantity } = cartItem
  const {
    media: images,
    prices: { salePrice, basePrice },
  } = product as Product

  // Calculate if the product is on sale
  const onSale =
    salePrice !== null && salePrice !== undefined && salePrice !== 0 && salePrice < basePrice

  const unitPrice = onSale ? salePrice : basePrice

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden w-56 h-80 bg-thankly-offwhite">
      <div className="w-full h-48 relative overflow-hidden ">
        {images && images.length > 0 && (
          <img
            src={(images[0].mediaItem! as Media).url as string}
            //src={getImageUrl(images[0]!.mediaItem)}
            //alt="Product Image"
            alt={getImageAlt(images[0]!.mediaItem)}
            // className="object-cover w-full h-full"
            className="absolute inset-0 w-full h-full object-cover"
            // style={{ aspectRatio: '500/375', objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-col space-y-0">
          <h3 className="text-xl font-bold">{(product as Product).title}</h3>
          <div className="flex flex-row">
            <div className="text-olive-600 font-bold text-lg text-thankly-green">
              Qty {quantity}
            </div>
            <Button
              variant="outline"
              type="button"
              className="rounded-full w-5 h-5 p-0 mt-1 ml-2"
              onClick={() => {
                onQuantityChange(itemId, cartItem.quantity + 1)
              }}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
            {quantity > 1 && (
              <Button
                variant="outline"
                type="button"
                className="rounded-full w-5 h-5 p-0 mt-1"
                onClick={() => {
                  onQuantityChange(itemId, cartItem.quantity - 1)
                }}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="text-muted-foreground">Price: ${unitPrice.toFixed(2)}</div>
          <div className="text-muted-foreground">Total: ${(quantity * unitPrice).toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

function MinusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="darkGrey"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

function PlusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="darkGrey"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
