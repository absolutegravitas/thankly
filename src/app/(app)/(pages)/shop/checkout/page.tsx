'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { EmptyCart } from '@/app/(app)/_blocks/Cart/EmptyCart'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useCart } from '@/app/(app)/_providers/Cart'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { CheckoutSummary } from '../../../_blocks/Checkout/Summary'
import { CheckoutForm } from '../../../_blocks/Checkout/CheckoutForm'
import { useStripe, useElements, Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '../../../_blocks/Checkout/CheckoutForm/createPaymentIntent'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { cart, cartIsEmpty, hasInitializedCart } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (cart && cart.totals && cart.totals.total > 0) {
      createPaymentIntent(cart.totals.total)
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

  return <EmptyCart />
}

function renderCartContent(cart: any, cartIsEmpty: any, clientSecret: string | null) {
  if (!clientSecret) {
    return <CheckoutLoadingSkeleton />
  }
  const stripe = useStripe()
  const elements = useElements()
  // Optional: If you're doing custom animations, hide the Element
  const [visibility, setVisibility] = useState('hidden')
  const [errorMessage, setErrorMessage] = useState()

  const onReady = ({ availablePaymentMethods }: any) => {
    if (!availablePaymentMethods) {
      // No buttons will show
    } else {
      // Optional: Animate in the Element
      setVisibility('initial')
    }
  }

  const onClick = ({ resolve }: any) => {
    const options = {
      lineItems: [
        {
          name: 'Sample item',
          amount: 1000,
        },
        {
          name: 'Tax',
          amount: 100,
        },
        {
          name: 'Shipping cost',
          amount: 1000,
        },
      ],
    }

    resolve(options)
  }

  // const onConfirm = async (event) => {
  //   if (!stripe) {
  //     // Stripe.js hasn't loaded yet.
  //     // Make sure to disable form submission until Stripe.js has loaded.
  //     return
  //   }

  //   const { error: submitError } = await elements.submit()
  //   if (submitError) {
  //     setErrorMessage(submitError.message)
  //     return
  //   }

  //   // Create a ConfirmationToken using the details collected by the Express Checkout Element
  //   const { error, confirmationToken } = await stripe.createPaymentMethod({
  //     elements,
  //     params: {
  //       payment_method_data: {
  //         billing_details: {
  //           name: 'Jenny Rosen',
  //         },
  //       },
  //       return_url: 'https://example.com/order/123/complete',
  //     },
  //   })

  //   if (error) {
  //     // This point is only reached if there's an immediate error when
  //     // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
  //     setErrorMessage(error.message)
  //   }

  //   // Send the ConfirmationToken ID to your server for additional logic and attach the ConfirmationToken
  //   const res = await fetch('/create-intent', {
  //     method: 'POST',
  //     body: confirmationToken.id,
  //   })
  //   const { client_secret: clientSecret } = await res.json()

  //   // Confirm the PaymentIntent
  //   const { error: confirmError } = await stripe.confirmPayment({
  //     clientSecret,
  //     confirmParams: {
  //       confirmation_token: confirmationToken.id,
  //     },
  //   })

  //   if (confirmError) {
  //     // This point is only reached if there's an immediate error when
  //     // confirming the payment. Show the error to your customer (for example, payment details incomplete)
  //     setErrorMessage(confirmError.message)
  //   } else {
  //     // The payment UI automatically closes with a success animation.
  //     // Your customer is redirected to your `return_url`.
  //   }
  // }

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
      bcartRadius: '0px',
    },
    rules: {
      '.Input': {
        bcart: 'none',
        bcartBottom: '1px solid #d1d5db', // Matches bcart-gray-300
        boxShadow: 'none',
        fontSize: '14px', // Matches text-sm
        padding: '8px 4px', // Adjusted to match your input padding
      },
      '.Input:focus': {
        bcart: 'none',
        bcartBottom: '2px solid #557755', // Matches focus:bcart-green/75
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
    amount: cart.totals.total * 100, // amount in cents
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {cartIsEmpty ? (
          <EmptyCart />
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
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <Suspense fallback={<StripeElementsSkeleton />}>
                  {cart && clientSecret ? (
                    <Elements stripe={stripePromise} options={options}>
                      {/* <div id="express-checkout-element" style={{ visibility }}>
                        <ExpressCheckoutElement
                          onConfirm={onConfirm}
                          onReady={onReady}
                          onClick={onClick}
                          onCancel={onCancel}
                        />
                      </div> */}
                      <CheckoutForm />
                    </Elements>
                  ) : (
                    <StripeElementsSkeleton />
                  )}
                </Suspense>
                <div className="w-full lg:w-1/3">
                  <Suspense fallback={<CartSummarySkeleton />}>
                    {cart && <CheckoutSummary cart={cart} />}
                  </Suspense>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

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
    <div className="bcart bcart-solid bcart-gray-200/90 animate-pulse">
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
