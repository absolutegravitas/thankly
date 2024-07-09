'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
// import { createOrder } from '@/app/(app)/_providers/Cart/orderActions'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm({ clientSecret, cartId }: { clientSecret: string; cartId: string }) {
  if (!clientSecret) {
    return <div>Unable to initialize checkout. Please try again later.</div>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormContent cartId={cartId} />
    </Elements>
  )
}

function CheckoutFormContent({ cartId }: { cartId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    // Create the order
    // const order = await createOrder(cartId)

    // if (!order) {
    //   setError('Failed to create order')
    //   setIsLoading(false)
    //   return
    // }

    // // Confirm the payment
    // const { error: stripeError } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     return_url: `${window.location.origin}/shop/order-confirmation/${order.id}`,
    //   },
    // })

    // if (stripeError) {
    //   setError(stripeError.message || 'An unexpected error occurred.')
    // } else {
    //   // Payment successful, redirect to order confirmation page
    //   router.push(`/shop/order-confirmation/${order.id}`)
    // }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}
