// app/shop/checkout/OrderSummary.tsx
import { Cart } from '@payload-types'

export function OrderSummary({ cart }: { cart: Cart }) {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      {cart.items?.map((item, index) => (
        <div key={index} className="mb-2">
          <span>{'product name'}</span>
          <span className="float-right">${item.totals.itemTotal.toFixed(2)}</span>
        </div>
      ))}
      <hr className="my-2" />
      <div className="font-bold">
        <span>Total</span>
        <span className="float-right">${cart.totals.cartTotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
