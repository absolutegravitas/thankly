'use client'
import React, { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { useCart } from '@/app/(app)/_providers/Cart'
import { Lock } from 'lucide-react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { createPaymentIntent } from '../../../_blocks/Checkout/CheckoutForm/createPaymentIntent'

export const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCart()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const paymentElementOptions = {
    layout: 'accordion' as const,
  }

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Stripe has not been initialized.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message ?? 'An unknown error occurred')
      setIsLoading(false)
      return
    }

    const { clientSecret } = await createPaymentIntent(cart.totals.total)

    if (!clientSecret) {
      setErrorMessage('Failed to create payment intent.')
      setIsLoading(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/shop/order/confirmation`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.')
    } else {
      // Payment succeeded, redirect will happen automatically
    }
    setIsLoading(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await handlePayment()
  }

  const onExpressCheckoutConfirm = async () => {
    await handlePayment()
  }

  const onExpressCheckoutClick = ({ resolve }: { resolve: (options: any) => void }) => {
    const options = {
      lineItems: cart.items?.map((item: any) => ({
        name: item.product.title,
        amount: item.totals.subTotal * 100, // Stripe expects amounts in cents
      })),
      emailRequired: true,
      phoneNumberRequired: true,
    }
    resolve(options)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} !my-0 pb-6`}>Payment</h2>

      <ExpressCheckoutElement
        onConfirm={onExpressCheckoutConfirm}
        onClick={onExpressCheckoutClick}
      />

      <PaymentElement options={paymentElementOptions} />

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={cn(
          'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
          buttonLook.sizes.medium,
          buttonLook.widths.full,
        )}
      >
        {isLoading ? 'Processing...' : `Pay ${cart.totals.total.toFixed(2)} AUD`}
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
