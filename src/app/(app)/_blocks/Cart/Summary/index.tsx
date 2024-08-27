// This file contains the CartSummary component and its related utilities for displaying the cart summary in a Next.js 14 application using the App Router and server components.
// The CartSummary component is responsible for rendering the cart summary, including the total cost, shipping charges, and the checkout button.
// It also handles the checkout process by creating a Stripe checkout session and redirecting the user to the Stripe payment page.
// The component uses the useCart hook from the Cart context to access cart-related functionality.
// Performance Considerations:
// - Memoizing expensive calculations or components could improve performance.
// - Optimizing data fetching and limiting unnecessary re-renders could enhance efficiency.
// - Handling large cart data sets efficiently may require additional optimizations.

import React, { useEffect, useState, useTransition } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { MailWarningIcon, SmileIcon, ArrowLeftIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Cart } from '@/payload-types'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { cartPageText } from '@/utilities/referenceText'
import { StripeCheckoutButton } from '../Payment/StripeCheckout/StripeCheckoutButton'
import { StripeElements } from '../Payment/StripeElements/StripeElements'

// The CartSummary component is a React functional component that displays the cart summary and handles the checkout process.
// Props:
// - cart: Cart (required) - The cart object containing the cart data and totals.
export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) return null

  return (
    <div className="flex flex-col">
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

          {/* <StripeCheckoutButton /> */}
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

          <StripeElements />

          {/* {isValid && clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { ...stripeElementsAppearance } }}
            >
              <StripeElementsForm clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="text-red-500 text-sm">{validationMessage}</div>
          )} */}
        </div>
      </div>
    </div>
  )
}
