import React from 'react'
import { addProduct } from '../actions'
import { CheckIcon, FrownIcon, SendHorizonalIcon } from 'lucide-react'
import { Button } from '@app/_components/Button'
import Link from 'next/link'

export const AddProduct: React.FC<any> = ({ product, hidePerks }) => {
  const handleAddProduct = async () => {
    await addProduct(product)
  }

  return (
    <>
      {product.stockOnHand != 0 ? (
        <>
          <Button
            url="/shop/cart" // send to cart page if already in cart
            label={'Add to Cart'}
            // label={isInCart ? 'View in Cart' : 'Add to Cart'}
            appearance={'default'}
            fullWidth
            data-theme={'light'}
            icon="cart"
            onClick={
              handleAddProduct
              // !isInCart
              //   ? () => {
              //       addItemToCart({ product })
              //       router.push('/shop/cart')
              //     }
              //   : undefined
            }
          />
          {!hidePerks && (
            <div className="hidden sm:flex pt-2 items-center justify-center space-x-2">
              <div className="py-1 sm:py-2 flex items-center">
                <SendHorizonalIcon
                  className="h-5 w-5 flex-shrink-0 text-green"
                  aria-hidden="true"
                />
                <div className="ml-2 text-sm text-gray-500">FREE Delivery for orders over $100</div>
              </div>
              <div className="py-1 sm:py-2 flex items-center">
                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                <div className="ml-2 text-sm text-gray-500">In stock and ready to ship</div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="sm:flex pt-2 items-center justify-center space-x-2">
            <div className="py-1 sm:py-2 flex items-center">
              <FrownIcon
                className="h-8 w-8 flex-shrink-0 text-green"
                strokeWidth={1.25}
                ria-hidden="true"
              />
              <div className="ml-2 text-sm text-gray-500">
                {`We're Sorry! This thankly is currently out of stock. `}
                <br className="sm:block hidden" />
                <Link href="/shop">Back to Shop &#8594;</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AddProduct
