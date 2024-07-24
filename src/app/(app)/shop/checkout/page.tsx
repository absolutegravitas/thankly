'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@/app/(app)/_blocks/Cart/CartEmpty'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { CheckoutSummary } from '../../_blocks/Checkout/Summary'
import { CheckoutForm } from '../../_blocks/Checkout/CheckoutForm'
import { Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '../../_blocks/Checkout/CheckoutForm/createPaymentIntent'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { cart, cartIsEmpty, hasInitializedCart } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (cart && cart.totals && cart.totals.cartTotal > 0) {
      createPaymentIntent(cart.totals.cartTotal)
        .then((result) => {
          if (result.clientSecret) {
            setClientSecret(result.clientSecret)
          }
        })
        .catch((error) => console.error('Error creating PaymentIntent:', error))
    }
  }, [cart])

  if (cart && cart.items && cart.items.length > 0) {
    return renderCartContent(cart, cartIsEmpty, clientSecret)
  }

  if (!hasInitializedCart) {
    return <CheckoutLoadingSkeleton />
  }

  return <CartEmpty />
}

function renderCartContent(cart: any, cartIsEmpty: any, clientSecret: string | null) {
  if (!clientSecret) {
    return <CheckoutLoadingSkeleton />
  }

  const appearance = {
    theme: 'flat' as const,
    variables: {
      colorPrimary: '#557755',
      colorBackground: '#f9fafb', // Matches bg-gray-50
      colorText: '#111827', // Matches text-gray-900
      colorDanger: '#dc2626', // Matches text-red-600
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      spacingUnit: '4px',
      borderRadius: '0px',
    },
    rules: {
      '.Input': {
        border: 'none',
        borderBottom: '1px solid #d1d5db', // Matches border-gray-300
        boxShadow: 'none',
        fontSize: '14px', // Matches text-sm
        padding: '8px 4px', // Adjusted to match your input padding
      },
      '.Input:focus': {
        border: 'none',
        borderBottom: '2px solid #557755', // Matches focus:border-green/75
        boxShadow: 'none',
      },
      '.Input::placeholder': {
        color: '#9ca3af', // Matches placeholder-gray-400
      },
      '.Label': {
        fontSize: '14px', // Matches text-sm
        fontWeight: '500', // Matches font-medium
        color: '#111827', // Matches text-gray-900
      },
      '.Error': {
        color: '#dc2626', // Matches text-red-600
        fontSize: '14px', // Matches text-sm
      },
    },
  }

  const options = {
    // clientSecret,
    appearance,
    mode: 'payment' as const,
    currency: 'aud',
    amount: cart.totals.cartTotal * 100, // amount in cents
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {cartIsEmpty ? (
          <CartEmpty />
        ) : (
          <React.Fragment>
            <div className="flex flex-row justify-between pb-6">
              <h1
                className={cn(
                  contentFormats.global,
                  contentFormats.h3,
                  'tracking-tighter text-3xl sm:text-2xl font-medium my-2',
                )}
              >
                {'Checkout'}
              </h1>
              <div className="hidden sm:flex w-1/6">
                <Link
                  href="/shop/cart"
                  scroll={true}
                  className={cn(
                    buttonLook.variants.base,
                    buttonLook.sizes.medium,
                    buttonLook.widths.full,
                    'flex flex-row justify-between no-underline',
                  )}
                >
                  <span> &larr; </span>
                  <span className={cn(contentFormats.global, contentFormats.p)}>
                    {`Back to Cart`}
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row md:shrink-0  gap-6 px-0 #max-w-6xl justify-center justify-items-center">
                <Suspense fallback={<StripeElementsSkeleton />}>
                  {cart && clientSecret ? (
                    <Elements stripe={stripePromise} options={options}>
                      {/* <ExpressCheckoutElement onConfirm={} /> */}
                      <CheckoutForm />
                    </Elements>
                  ) : (
                    <StripeElementsSkeleton />
                  )}
                </Suspense>
                <Suspense fallback={<CartSummarySkeleton />}>
                  {cart && <CheckoutSummary cart={cart} />}
                </Suspense>
              </div>
            </div>
          </React.Fragment>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

// ... rest of the file remains the same

const CheckoutLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-3/4">
            <CartItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <CartSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

const CartItemsSkeleton: React.FC = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

const CartSummarySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="relative flex justify-between gap-4">
        <h2 className="bg-gray-200 rounded h-6 w-32"></h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-48"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>
      </div>
    </div>
  )
}

const StripeElementsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 basis-2/3">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  )
}
