import React from 'react'
import ProductThumbnail from '../ProductThumbnail'
import { CartItem } from '../cart-types'
import { Product } from '@/payload-types'

interface Props {
  cartItems: CartItem[]
  shipping?: number
}

const CartItemsTable = ({ cartItems, shipping }: Props) => {
  return (
    <div className="max-w-xl">
      <table className="w-full">
        <tbody>
          {cartItems?.map((item, index) => (
            <tr key={index} className="">
              <td className="pl-6 py-6">
                <ProductThumbnail cartItem={item} />
              </td>
              <td className="px-6 py-4 font-semibold">{(item.product as Product).title}</td>
              <td className="px-6 py-4 text-right font-medium">{item.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="">
            <td className="px-6 py-4 font-medium">Subtotal</td>
            <td className="px-6 py-4" />
            <td className="px-6 py-4 text-right font-medium">$358.98</td>
          </tr>
          {shipping && (
            <tr className="">
              <td className="px-6 py-4 font-medium">Shipping</td>
              <td className="px-6 py-4" />
              <td className="px-6 py-4 text-right font-medium">${shipping.toFixed(2)}</td>
            </tr>
          )}
        </tfoot>
      </table>
      <p className="px-6 text-right font-light">Tax calculated at checkout</p>
    </div>
  )
}

export default CartItemsTable
