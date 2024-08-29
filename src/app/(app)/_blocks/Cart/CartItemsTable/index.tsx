import React from 'react'
import ProductThumbnail from '../ProductThumbnail'
import { CartItem } from '../cart-types'
import { Product } from '@/payload-types'
import { ReceiverCart } from '@/utilities/receiverCarts'
import { getPostageName } from '@/app/(app)/_providers/Cart/postageOptions'

interface Props {
  receiverCart: ReceiverCart
}

const CartItemsTable = ({ receiverCart }: Props) => {
  const totalAmount = receiverCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const postageName = getPostageName(receiverCart.delivery?.shippingMethod)

  const hasPostage =
    receiverCart.delivery &&
    receiverCart.delivery?.shippingPrice &&
    receiverCart.delivery?.shippingMethod &&
    postageName

  return (
    <div className="max-w-xl font-medium px-4 pb-0 pt-4 sm:p-4">
      {receiverCart.items?.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="flex-none w-16 h-16">
            <ProductThumbnail cartItem={item} />
          </div>
          <div className="flex-auto pl-4 sm:pl-6">{(item.product as Product).title}</div>
          <div className="flex-initial text-right">${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      <div className="py-2 sm:py-6">
        <div className="flex items-center">
          <div className="flex-auto ">Subtotal</div>
          <div className="flex-auto text-right">${totalAmount.toFixed(2)}</div>
        </div>
        {hasPostage && (
          <div className="flex items-center">
            <div className="flex-auto ">{postageName}</div>
            <div className="flex-auto text-right">
              ${receiverCart.delivery!.shippingPrice!.toFixed(2)}
            </div>
          </div>
        )}
        {/* <p className="text-right font-light">Tax calculated at checkout</p> */}
      </div>
    </div>
  )
}

export default CartItemsTable
