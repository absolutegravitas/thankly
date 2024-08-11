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
import { FullLogo } from '@app/_graphics/FullLogo'
import { cartPageText } from '@/utilities/referenceText'
import { Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { createPaymentIntent } from './createPaymentIntent'
import {
  StripeExpressCheckoutElementReadyEvent,
  AvailablePaymentMethods,
  StripeExpressCheckoutElementConfirmEvent,
} from '@stripe/stripe-js'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) return null

  const { validateCart, clearCart } = useCart()
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined)

  // check if cart is valid
  useEffect(() => {
    const orderValidity = validateCart()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [cart, validateCart])

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

  return (
    <div className="flex sm:flex-row flex-col">
      <div
        id="summary-heading"
        className="sticky top-4 scroll-py-28 scroll-mt-24 sm:basis-1/2 py-4 space-y-6 sm:space-y-8 pl-0 sm:px-8"
      >
        <h2 className={cn(contentFormats.global, contentFormats.h3, 'mt-0 mb-6')}>Summary</h2>

        <div className="space-y-4">
          <SummaryItem
            label="Total (inc. taxes)"
            value={cart.totals.total + (cart.totals.discount || 0)}
            isBold
          />
          <SummaryItem label="Thanklys" value={cart.totals.cost} />
          <SummaryItem label="+ Shipping" value={cart.totals.shipping || 0} />

          {(cart.totals.discount || 0) < 0 && (
            <SummaryItem
              label={
                <span className="flex items-center">
                  <SmileIcon className="mr-2" />
                  {cartPageText.shippingFreeMessage}
                </span>
              }
              value={cart.totals.discount || 0}
            />
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
        </div>
      </div>
      <div id="summary-heading" className="basis-1/2 py-4 space-y-6 sm:space-y-8 pl-0 sm:px-8">
        <h2 className={cn(contentFormats.global, contentFormats.h3, 'mt-0 mb-6')}>Pay</h2>
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm isValid={isValid} clientSecret={clientSecret} />{' '}
          </Elements>
        )}
      </div>
    </div>
  )
}

// The SummaryItem component renders an individual summary item with a label and value
interface SummaryItemProps {
  label: React.ReactNode
  value: number
  isBold?: boolean
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, isBold }) => (
  <div className="flex items-center justify-between">
    <dt className={cn(contentFormats.global, contentFormats.text, isBold && 'font-semibold')}>
      {label}
    </dt>
    <dd className={cn(contentFormats.global, contentFormats.text, isBold && 'font-semibold')}>
      {value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </dd>
  </div>
)

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const CheckoutForm: React.FC<{ isValid: boolean; clientSecret: string }> = ({
  isValid,
  clientSecret,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // STRIPE EXPRESS CHECKOUT ELEMENT
  const [expressVisibility, setExpressVisibility] = useState<'hidden' | 'visible'>('hidden')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return
    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
    })

    if (error) {
      setMessage(error.message ?? 'An unexpected error occurred.')
    } else {
      setMessage('An unexpected error occurred.')
    }
    setIsLoading(false)
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

  ///////////////
  useEffect(() => {
    if (!stripe) return
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    )
    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      }
    })
  }, [stripe])

  const paymentElementOptions = {
    layout: 'tabs' as const,
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col">
      <div
        id="express-checkout-element"
        style={{ visibility: expressVisibility, marginBottom: '20px' }}
      >
        <ExpressCheckoutElement onConfirm={onExpressCheckoutConfirm} />
      </div>
      <div>{` or `}</div>
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
      </button>
      {message && (
        <div id="payment-message" className="mt-4 text-red-500">
          {message}
        </div>
      )}
    </form>
  )
}

export default CheckoutForm
