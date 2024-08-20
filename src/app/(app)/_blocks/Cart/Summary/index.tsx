// This file contains the CartSummary component and its related utilities for displaying the cart summary in a Next.js 14 application using the App Router and server components.
// The CartSummary component is responsible for rendering the cart summary, including the total cost, shipping charges, and the checkout button.
// It also handles the checkout process by creating a Stripe checkout session and redirecting the user to the Stripe payment page.
// The component uses the useCart hook from the Cart context to access cart-related functionality.
// Performance Considerations:
// - Memoizing expensive calculations or components could improve performance.
// - Optimizing data fetching and limiting unnecessary re-renders could enhance efficiency.
// - Handling large cart data sets efficiently may require additional optimizations.

import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, MailWarningIcon, SmileIcon, XIcon, ArrowLeftIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Cart } from '@/payload-types'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useCart } from '@app/_providers/Cart'
import { LoaderCircleIcon } from 'lucide-react'
import { cartPageText } from '@/utilities/referenceText'
import {
  loadStripe,
  StripeElementsOptions,
  StripeExpressCheckoutElementConfirmEvent,
} from '@stripe/stripe-js'
import { createCheckoutSession } from './createCheckoutSession'
import { createPaymentIntent } from './createPaymentIntent'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// The CartSummary component is a React functional component that displays the cart summary and handles the checkout process.
// Props:
// - cart: Cart (required) - The cart object containing the cart data and totals.
export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) return null
  const router = useRouter()
  const { validateCart, clearCart } = useCart()
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [isPending, setIsPending] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const appearance = {
    theme: 'flat' as const,
    variables: {
      colorPrimary: '#557755',
      colorBackground: '#f9fafb',
      colorText: '#111827',
      colorDanger: '#dc2626',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      spacingUnit: '4px',
      borderRadius: '0px',
    },
    rules: {
      '.Input': {
        border: 'none',
        borderBottom: '1px solid #d1d5db',
        boxShadow: 'none',
        fontSize: '14px',
        padding: '8px 4px',
      },
      '.Input:focus': {
        border: 'none',
        borderBottom: '2px solid #557755',
        boxShadow: 'none',
      },
      '.Input::placeholder': {
        color: '#9ca3af',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#111827',
      },
      '.Error': {
        color: '#dc2626',
        fontSize: '14px',
      },
    },
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  }

  // Check if the cart is valid by calling the validateCart function from the useCart hook
  // This effect runs whenever the cart or validateCart function changes
  useEffect(() => {
    const cartValidity = validateCart()
    setIsValid(cartValidity)
    setValidationMessage(
      cartValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [cart, validateCart])

  // Handle the checkout process by creating a Stripe checkout session
  const handleCheckout = async () => {
    if (!isValid) return
    setIsPending(true)
    try {
      const result = await createCheckoutSession(cart)
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setValidationMessage('An error occurred during checkout. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  // create payment intent if cart is valid
  useEffect(() => {
    if (isValid) {
      const fetchClientSecret = async () => {
        const { clientSecret } = await createPaymentIntent(cart.totals.total)
        setClientSecret(clientSecret || undefined)
      }
      fetchClientSecret()
    }
  }, [isValid, cart.totals.total])

  const StripeElementsForm = ({ clientSecret }: any) => {
    const stripe = useStripe()
    const elements = useElements()
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expressVisibility, setExpressVisibility] = useState<'hidden' | 'visible'>('hidden')
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (event: any) => {
      event.preventDefault()
      if (!stripe || !elements || !isValid) return
      setIsLoading(true)
      setProcessing(true)

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/shop/order`,
          // `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?session_id={CHECKOUT_SESSION_ID}`
        },
      })

      if (submitError) {
        setError(submitError.message ?? 'An unknown error occurred')
      } else {
        setMessage('An unexpected error occurred.')
      }
      setIsLoading(false)
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
          return_url: `${window.location.origin}/confirmation`,
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

    const paymentElementOptions = {
      layout: 'tabs' as const,
    }

    return (
      <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col">
        <div
          id="express-checkout-element"
          style={{ visibility: expressVisibility, marginBottom: '20px', paddingBottom: '20px' }}
        >
          <ExpressCheckoutElement onConfirm={onExpressCheckoutConfirm} />
          <div>{` or `}</div>
        </div>

        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          disabled={isLoading || !stripe || !elements || !isValid}
          id="submit"
          className={cn(
            'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
            buttonLook.base,
            buttonLook.sizes.medium,
            buttonLook.widths.full,
            (!isValid || isLoading || !stripe || !elements) && 'opacity-50 cursor-not-allowed',
          )}
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
          </span>
          {processing ? 'Processing...' : 'Pay now'}
        </button>
        {error && <div>{error}</div>}
        {/* {message && (
          <div id="payment-message" classNam  e="mt-4 text-red-500">
            {message}
          </div>
        )} */}
      </form>
    )
  }

  return (
    <div className="flex #sm:flex-row flex-col">
      <div
        id="summary-heading"
        className="sticky top-4 scroll-py-28 scroll-mt-24 sm:basis-1/2 py-4 space-y-6 sm:space-y-8 pl-0 sm:px-8"
      >
        <h2 className={cn(contentFormats.global, contentFormats.h3, 'mt-0 mb-6')}>Summary</h2>

        <div className="space-y-4">
          {/* <SummaryItem
            label="Total (inc. taxes)"
            value={cart.totals.total + (cart.totals.discount || 0)}
            isBold
          />
          <SummaryItem label="Thanklys" value={cart.totals.cost} />
          <SummaryItem label="+ Shipping" value={cart.totals.shipping || 0} /> */}

          {(cart.totals.discount || 0) < 0 && (
            <div className="flex items-center justify-between">
              <dt className={cn(contentFormats.global, contentFormats.text)}>
                <span className="flex items-center">
                  <SmileIcon className="mr-2" />
                  {cartPageText.shippingFreeMessage}
                </span>
              </dt>
              <dd className={cn(contentFormats.global, contentFormats.text)}>
                {(cart.totals.discount || 0).toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {!isValid && <div className="text-red-500 text-sm">{validationMessage}</div>}
          <div
            className={cn(contentFormats.global, contentFormats.text, 'text-sm flex items-start')}
          >
            <MailWarningIcon className="mr-2 flex-shrink-0 mt-1" />
            <span>
              <span className="font-semibold">Thankly Cards: </span>
              {cartPageText.shippingMessage}{' '}
              <Link
                className={cn(contentFormats.global, contentFormats.a, '!text-sm')}
                href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </div>
          <CMSLink
            data={{
              label: 'Proceed to Stripe Checkout',
              type: 'custom',
              url: '#',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'medium',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: isPending ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <DollarSignIcon strokeWidth={1.25} />
                ),
                iconPosition: 'left',
              },
            }}
            actions={{
              onClick: handleCheckout,
            }}
            className={`${!isValid && 'disabled bg-gray-300'}`}
            pending={isPending}
          />
          <CMSLink
            data={{
              label: 'Continue Shopping',
              type: 'custom',
              url: '/shop',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'medium',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: <ArrowLeftIcon strokeWidth={1.25} />,
                iconPosition: 'left',
              },
            }}
          />

          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <StripeElementsForm clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
