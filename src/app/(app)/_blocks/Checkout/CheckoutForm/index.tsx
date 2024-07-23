'use client'

import React, { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { useCart } from '@app/_providers/Cart'
import { Lock } from 'lucide-react'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'

export const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCart()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not been initialized.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/order/confirmation`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred')
    }

    setIsLoading(false)
  }

  const handleExpressCheckout = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Stripe has not been initialized.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/payment-confirmation`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred during Express Checkout.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 basis-2/3">
      <PaymentElement />

      <AddressElement options={{ mode: 'billing' }} />

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={cn(
          'w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
          contentFormats.global,
          contentFormats.p,
        )}
      >
        {isLoading ? 'Processing...' : `Pay ${cart.totals.cartTotal.toFixed(2)} AUD`}
      </button>

      <p
        className={cn(
          'mt-6 flex justify-center text-sm font-medium text-gray-500',
          contentFormats.global,
          contentFormats.p,
        )}
      >
        <Lock className="mr-1.5 h-5 w-5 text-gray-400" />
        Payment details secured by Stripe
      </p>
    </form>
  )
}
