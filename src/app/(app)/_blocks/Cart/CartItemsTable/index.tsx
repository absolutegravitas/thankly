import React from 'react'
import ProductThumbnail from '../ProductThumbnail'
import { CartItem } from '../cart-types'
import { Product } from '@/payload-types'
import { ReceiverCart } from '@/utilities/receiverCarts'
import { getPostageName, getPostageOptions } from '@/app/(app)/_providers/Cart/postageOptions'
import { capitalize } from 'lodash'
import { ReceiverAddressText } from '@/app/(app)/_providers/Cart/address'
import ProductAddOns from '@/app/(app)/_components/ProductAddOns'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  receiverCart: ReceiverCart
  showDetails?: boolean
  showDeliveryAddress?: boolean
  showSubtotal?: boolean
}

const CartItemsTable: React.FC<Props> = ({
  receiverCart,
  showDetails = false,
  showDeliveryAddress = false,
  showSubtotal = false,
  ...props
}: Props) => {
  const totalAmount = receiverCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const postageOptions = getPostageOptions(receiverCart)
  const postageName = getPostageName(receiverCart.delivery?.shippingMethod, postageOptions)

  const hasPostage =
    !!receiverCart.delivery && !!receiverCart.delivery?.shippingMethod && !!postageName

  return (
    <div className="max-w-xl font-medium px-4 pb-0 pt-4 sm:p-4" {...props}>
      {showDeliveryAddress && (
        <div className="flex flex-row py-2">
          <div className="underline">Deliver to:</div>
          <div className="flex flex-col px-4">
            <div>
              {receiverCart.firstName} {receiverCart.lastName}
            </div>
            <div className="text-slate-600">{ReceiverAddressText(receiverCart)}</div>
          </div>
        </div>
      )}
      {receiverCart.items?.map((item, index) => (
        <div key={index} className="flex items-center pb-4">
          <div className="flex-none w-16 h-16">
            <ProductThumbnail cartItem={item} />
          </div>
          <div className="flex-auto pl-4 sm:pl-6">
            <p>{(item.product as Product).title}</p>
            <ProductAddOns addOns={item.addOns} />
            {showDetails && (
              <>
                <p className="text-slate-800 font-light">Message:</p>
                <p className="text-slate-800 font-light break-words max-w-[45ch]">
                  {item.giftCard.message}
                </p>
                <p className="text-slate-800 font-light">
                  Writing style: {capitalize(item.giftCard.writingStyle)}
                </p>
              </>
            )}
          </div>
          <div className="flex-initial text-right">${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      <div className="">
        {showSubtotal && (
          <div className="flex items-center">
            <div className="flex-auto"> Subtotal</div>
            <div className="flex-auto text-right">${totalAmount.toFixed(2)}</div>
          </div>
        )}
        {hasPostage && (
          <div className="flex items-center">
            <div className="flex-auto"> {postageName}</div>
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
