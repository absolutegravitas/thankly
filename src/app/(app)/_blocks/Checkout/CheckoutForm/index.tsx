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
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'

export const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCart()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const paymentElementOptions = {
    layout: 'accordion' as const,

    spacedAccordionItems: false,
  }

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

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message ?? 'An unknown error occurred')
    } else {
      setErrorMessage('An unexpected error occured.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="#space-y-6 sm:basis-1/2">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} !my-0 pb-6`}>Payment</h2>

      <PaymentElement options={paymentElementOptions} />
      {/* <AddressElement options={{ mode: 'billing' }} /> */}

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={cn(
          'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
          // contentFormats.global,
          // contentFormats.p,
          // buttonLook.base,
          buttonLook.sizes.medium,
          buttonLook.widths.full,
          // buttonLook.variants.blocks,
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
