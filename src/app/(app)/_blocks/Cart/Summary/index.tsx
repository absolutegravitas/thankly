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
import { createCheckoutSession } from './createCheckoutSession'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) return null
  const router = useRouter()
  const { validateCart, clearCart } = useCart()
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [isPending, setIsPending] = useState(false)
  // check if cart is valid
  useEffect(() => {
    const orderValidity = validateCart()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [cart, validateCart])

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
              label: 'Proceed to Checkout',
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

          {/* {!isValid && <div className="text-red-500 text-sm">{validationMessage}</div>} */}

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
      {/* <div id="summary-heading" className="basis-1/2 py-4 space-y-6 sm:space-y-8 pl-0 sm:px-8">
        <h2 className={cn(contentFormats.global, contentFormats.h3, 'mt-0 mb-6')}>Pay</h2>
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm isValid={isValid} clientSecret={clientSecret} />{' '}
          </Elements>
        )}
      </div> */}
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
