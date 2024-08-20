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
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from './createCheckoutSession'

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

  // Check if the cart is valid by calling the validateCart function from the useCart hook
  // This effect runs whenever the cart or validateCart function changes
  useEffect(() => {
    const orderValidity = validateCart()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
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
        </div>
      </div>
    </div>
  )
}

// The SummaryItem component is a React functional component that renders an individual summary item with a label and value.
// Props:
// - label: ReactNode (required) - The label for the summary item.
// - value: number (required) - The value for the summary item.
// - isBold?: boolean (optional) - Whether the label and value should be displayed in bold.
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
