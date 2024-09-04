'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/app/(app)/_providers/Cart'
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { DollarSign, LockIcon } from 'lucide-react'
import { createPaymentIntent } from './createPaymentIntent'

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, validCart } = useCart()

  const [validationMessage, setValidationMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [visibility, setVisibility] = useState('hidden')

  //https://docs.stripe.com/elements/express-checkout-element/accept-a-payment#payment-button-control
  // for express checkout (apple pay / google pay)
  //   After mounting, the Express Checkout Element won’t show buttons for a brief period. To animate the Element when buttons appear, listen to the ready event. Inspect the availablePaymentMethods value to determine which buttons, if any, display in the Express Checkout Element.
  const onReady = ({ availablePaymentMethods }: any) => {
    if (!availablePaymentMethods) {
      // No buttons will show
    } else {
      // Optional: Animate in the Element
      setVisibility('initial')
    }
  }

  // for express checkout (apple pay / google pay)
  // handles click button for one of apple pay / google pay
  //https://docs.stripe.com/elements/express-checkout-element/accept-a-payment#handle-click-event
  const onClick = ({ resolve }: any) => {
    const options = {
      emailRequired: true,
      phoneNumberRequired: true,
      shippingAddressRequired: false,
      allowedShippingCountries: ['AU'],
      lineItems: [{ name: 'Thankly Order', amount: cart.totals.total }],
    }
    resolve(options)
  }

  // for express checkout (apple pay / google pay)
  // handles cancel button for one of apple pay / google pay
  // dont think this will work as example code is in a different framework
  const onCancel = () => {
    if (elements) {
      elements?.update({ amount: 1099 })
    }
  }

  // handles stripe payment form submit (old school card payment form)
  // also should be OK to handle express checkout payment
  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()
    console.log('pre check')

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }
    console.log('see if this worked')
    setLoading(true)

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      handleError(submitError)
      return
    }

    // Create the PaymentIntent and obtain clientSecret
    const { client_secret: clientSecret } = await createPaymentIntent(cart)

    // Confirm the PaymentIntent using the details collected by the Payment Element
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // assumes cartNumber is transposed to orderNumber when the order is created
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?orderNumber={${cart.cartNumber}}`,
      },
    })

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error)
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  const handleError = (error: any) => {
    setLoading(false)
    setErrorMessage(error.message)
  }

  // This effect runs whenever the cart or validateCart function changes
  // cart should be invalidated when customer is modding cart OR supplying discount code etc so that the stripe form can be disabled and re-rendered with correct amount
  useEffect(() => {
    setValidationMessage(validCart() ? '' : 'Cart is invalid or incomplete.')
  }, [cart, validCart])

  return (
    <>
      {validCart() ? ( // only show Stripe if cart is valid
        <Elements
          // wrapper Elements component for apple pay / google pay buttons AND old school payment form
          stripe={stripePromise}
          options={{
            amount: cart.totals.total, // this should work if discount is applied or amounts change without using another useEffect since useCart is a provider and should update
            mode: 'payment',
            currency: 'aud',
            appearance: { ...stripeElementsAppearance },
          }}
        >
          <h2 className={'mb-6'}>Payment</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <ExpressCheckoutElement
              options={expressCheckoutOptions}
              onConfirm={handleSubmit}
              onClick={onClick}
              onCancel={onCancel}
              onReady={onReady}
            />

            <PaymentElement
              // old school payment form, adjust methods on stripe dashboard
              id="payment-element"
              options={{
                layout: {
                  type: 'accordion',
                  defaultCollapsed: false,
                  radios: true,
                  spacedAccordionItems: true,
                },
              }}
            />

            <button
              id="submit"
              disabled={!stripe || loading}
              className={
                'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm flex justify-between !font-semibold text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
              }
            >
              <DollarSign /> {'Pay Now'}
            </button>

            <div className={`text-center`}>
              <div className={'flex items-center justify-center space-x-2'}>
                <LockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-600">Secure payment powered by stripe.com</span>
              </div>
            </div>
          </form>
        </Elements>
      ) : (
        <div className="text-red-500 text-sm">{validationMessage}</div>
      )}
    </>
  )
}
const expressCheckoutOptions = {
  // Specify a type per payment method
  // Defaults to 'buy' for Google and 'plain' for Apple
  buttonType: {
    googlePay: 'checkout' as const,
    applePay: 'check-out' as const,
  },
  // Specify a theme per payment method
  // Default theme is based on appearance API settings
  buttonTheme: {
    applePay: 'white-outline' as const,
  },
  // Height in pixels. Defaults to 44. The width is always '100%'.
  buttonHeight: 55,
}

const stripeElementsAppearance = {
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
