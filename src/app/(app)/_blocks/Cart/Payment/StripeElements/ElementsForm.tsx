'use client'

import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { LockIcon } from 'lucide-react'

export const StripeElementsForm = ({ clientSecret }: any) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isReady, setIsReady] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expressVisibility, setExpressVisibility] = useState<'hidden' | 'visible'>('hidden')
  const [message, setMessage] = useState<string | null>(null)

  const onReady = ({ availablePaymentMethods }: any) => {
    if (!availablePaymentMethods) {
      // No buttons will show
    } else {
      // Optional: Animate in the Element
      setExpressVisibility('visible')
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?id={CHECKOUT_SESSION_ID}`,
      },
    })

    if (submitError) {
      setError(submitError.message ?? 'An unknown error occurred')
    } else {
      setMessage('An unexpected error occurred.')
    }
    setProcessing(false)
  }

  const onExpressCheckoutConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) return
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setMessage(submitError.message ?? 'An error occurred while submitting the form.')
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?session_id={CHECKOUT_SESSION_ID}`,
      },
    })

    if (error) {
      setMessage(error.message ?? 'An unexpected error occurred.')
    }
  }

  useEffect(() => {
    if (!stripe) return

    if (!clientSecret) {
      setMessage("Couldn't initialize payment. Please try again.")
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          // create order here?
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Please provide a payment method.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe, clientSecret])

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true)
    }
  }, [stripe, elements])

  if (!isReady) {
    return <LoadingSpinner />
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col">
      <div id="express-checkout-element" style={{ visibility: expressVisibility }}>
        <ExpressCheckoutElement onConfirm={onExpressCheckoutConfirm} onReady={onReady} />
      </div>
      <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-6')}>Pay with Card</h2>

      <PaymentElement
        id="payment-element"
        //   options={stripePaymentElementOptions}
      />
      <button
        disabled={!stripe || !elements}
        id="submit"
        className={cn(
          'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
          buttonLook.base,
          buttonLook.sizes.medium,
          buttonLook.widths.full,
          (!stripe || !elements) && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span id="button-text">{'Pay now'}</span>
      </button>
      <p className={cn(contentFormats.global, contentFormats.smallText, `text-center`)}>
        <div className={cn('flex items-center justify-center space-x-2')}>
          <LockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-sm text-gray-600">Secure payment powered by </span>
          <svg
            className="mt-1 -ml-2 m-0 p-0 h-7 w-7"
            viewBox="0 0 512 214"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M35.9822222,83.48f44444 C35.9822222,77.9377778 40.5333333,75.8044444 48.0711111,75.8044444 C58.88,75.8044444 72.5333333,79.0755556 83.3422222,84.9066667 L83.3422222,51.4844444 C71.5377778,46.7911111 59.8755556,44.9422222 48.0711111,44.9422222 C19.2,44.9422222 0,60.0177778 0,85.1911111 C0,124.444444 54.0444444,118.186667 54.0444444,135.111111 C54.0444444,141.653333 48.3555556,143.786667 40.3911111,143.786667 C28.5866667,143.786667 13.5111111,138.951111 1.56444444,132.408889 L1.56444444,166.257778 C14.7911111,171.946667 28.16,174.364444 40.3911111,174.364444 C69.9733333,174.364444 90.3111111,159.715556 90.3111111,134.257778 C90.1688889,91.8755556 35.9822222,99.4133333 35.9822222,83.4844444 Z M132.124444,16.4977778 L97.4222222,23.8933333 L97.28,137.813333 C97.28,158.862222 113.066667,174.364444 134.115556,174.364444 C145.777778,174.364444 154.311111,172.231111 159.004444,169.671111 L159.004444,140.8 C154.453333,142.648889 131.982222,149.191111 131.982222,128.142222 L131.982222,77.6533333 L159.004444,77.6533333 L159.004444,47.36 L131.982222,47.36 L132.124444,16.4977778 Z M203.235556,57.8844444 L200.96,47.36 L170.24,47.36 L170.24,171.804444 L205.795556,171.804444 L205.795556,87.4666667 C214.186667,76.5155556 228.408889,78.5066667 232.817778,80.0711111 L232.817778,47.36 C228.266667,45.6533333 211.626667,42.5244444 203.235556,57.8844444 Z M241.493333,47.36 L277.191111,47.36 L277.191111,171.804444 L241.493333,171.804444 L241.493333,47.36 Z M241.493333,36.5511111 L277.191111,28.8711111 L277.191111,0 L241.493333,7.53777778 L241.493333,36.5511111 Z M351.431111,44.9422222 C337.493333,44.9422222 328.533333,51.4844444 323.555556,56.0355556 L321.706667,47.2177778 L290.417778,47.2177778 L290.417778,213.048889 L325.973333,205.511111 L326.115556,165.262222 C331.235556,168.96 338.773333,174.222222 351.288889,174.222222 C376.746667,174.222222 399.928889,153.742222 399.928889,108.657778 C399.786667,67.4133333 376.32,44.9422222 351.431111,44.9422222 Z M342.897778,142.933333 C334.506667,142.933333 329.528889,139.946667 326.115556,136.248889 L325.973333,83.4844444 C329.671111,79.36 334.791111,76.5155556 342.897778,76.5155556 C355.84,76.5155556 364.8,91.0222222 364.8,109.653333 C364.8,128.711111 355.982222,142.933333 342.897778,142.933333 Z M512,110.08 C512,73.6711111 494.364444,44.9422222 460.657778,44.9422222 C426.808889,44.9422222 406.328889,73.6711111 406.328889,109.795556 C406.328889,152.604444 430.506667,174.222222 465.208889,174.222222 C482.133333,174.222222 494.933333,170.382222 504.604444,164.977778 L504.604444,136.533333 C494.933333,141.368889 483.84,144.355556 469.76,144.355556 C455.964444,144.355556 443.733333,139.52 442.168889,122.737778 L511.715556,122.737778 C511.715556,120.888889 512,113.493333 512,110.08 Z M441.742222,96.5688889 C441.742222,80.4977778 451.555556,73.8133333 460.515556,73.8133333 C469.191111,73.8133333 478.435556,80.4977778 478.435556,96.5688889 L441.742222,96.5688889 L441.742222,96.5688889 Z"
              fill="#6772E5"
            />
          </svg>
        </div>
      </p>
      {error && <div>{error}</div>}
    </form>
  )
}
