import { Suspense } from 'react'
import { getCart } from '@app/_providers/Cart/cartActions'

import { CheckoutForm } from '@app/_blocks/CartCheckout/CheckoutForm'
import { OrderSummary } from '@app/_blocks/CartCheckout/OrderSummary'
import { createPaymentIntent } from '@app/_providers/Cart/orderActions'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CartEmpty } from '@app/_blocks/CartCheckout/CartEmpty'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

export default async function CheckoutPage({ searchParams }: { searchParams: { cartId: string } }) {
  const { cartId } = searchParams
  const cart = await getCart(cartId)

  if (!cart) {
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <CartEmpty />
      </BlockWrapper>
    )
  }

  const paymentIntent = await createPaymentIntent(cart.totals.cartTotal)

  if (!paymentIntent || !paymentIntent.client_secret) {
    return <div>Failed to initialize checkout. Please try again later.</div>
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Suspense fallback={<div>Loading checkout form...</div>}>
          <CheckoutForm clientSecret={paymentIntent.client_secret} cartId={cartId} />
        </Suspense>
        <Suspense fallback={<div>Loading order summary...</div>}>
          <OrderSummary cart={cart} />
        </Suspense>
      </div>
    </div>
  )
}
