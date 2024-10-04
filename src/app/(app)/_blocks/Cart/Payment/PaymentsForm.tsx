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
import { DollarSign, LockIcon } from 'lucide-react'
import { createPaymentIntent } from './createPaymentIntent'
import { Button } from '@/app/(app)/_components/ui/button'
import { upsertPayloadCart } from '@/app/(app)/_providers/Cart/upsertPayloadCart'
import { createOrder } from '@/app/(app)/api/stripeWebhooks/createOrder'
import * as React from 'react'

export const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, clearCart } = useCart()

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
      lineItems: [{ name: 'Thankly Order', amount: cart.totals.total * 100 }],
    }
    resolve(options)
  }

  // for express checkout (apple pay / google pay)
  // handles cancel button for one of apple pay / google pay
  // dont think this will work as example code is in a different framework
  const onCancel = () => {
    if (elements) {
      elements?.update({ amount: cart.totals.total * 100 })
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
    setLoading(true)

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      handleError(submitError)
      return
    }

    // save the server cart here and use it to generate the order later off the webhook
    // TODO: there's probably a better way to do it instead of here but Alex refactored all my code and I dont know where everything is
    console.log('cart to save -- ', cart)
    await upsertPayloadCart(cart)

    // generate an order number
    const orderNumber =
      `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}` as string
    const { client_secret: clientSecret } = await createPaymentIntent(cart, orderNumber)

    // create a draft order by copying the cart
    const draftOrder = await createOrder(cart, orderNumber)
    console.log('draft order -- ', draftOrder)

    // Confirm the PaymentIntent to actually take a payment using the details collected by the Payment Element
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?orderNumber=${orderNumber}`,
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

  return (
    <>
      <ExpressCheckoutElement
        className={`py-5`}
        options={expressCheckoutOptions}
        onConfirm={handleSubmit}
        onClick={onClick}
        onCancel={onCancel}
        onReady={onReady}
      />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* https://docs.stripe.com/elements/address-element/collect-addresses?platform=web#customize-appearance */}
        <AddressElement
          className={`py-5`}
          options={{ mode: 'billing', fields: { phone: 'always' } }}
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

        <Button
          id="submit"
          size="lg"
          className="py-6 rounded-full w-full"
          type="submit"
          disabled={!stripe || loading}
        >
          <DollarSign /> {'Pay Now'}
        </Button>

        <div className={`text-center`}>
          <div className={'flex items-center justify-center space-x-2 space-y-4'}>
            <LockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600">Secure payment powered by stripe.com</span>
          </div>
        </div>
      </form>
    </>
  )
}

// styling for stripe iframe
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

export const stripeElementsAppearance = {
  theme: 'flat' as const,
  variables: {
    // colorPrimary: '#557755',
    // colorBackground: '#f9fafb',
    // colorText: '#111827',
    // colorDanger: '#dc2626',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    spacingUnit: '4px',
    borderRadius: '0px',
  },
  // rules: {
  //   '.Input': {
  //     border: 'none',
  //     borderBottom: '1px solid #d1d5db',
  //     boxShadow: 'none',
  //     fontSize: '14px',
  //     padding: '8px 4px',
  //   },
  //   '.Input:focus': {
  //     border: 'none',
  //     borderBottom: '2px solid #557755',
  //     boxShadow: 'none',
  //   },
  //   '.Input::placeholder': {
  //     color: '#9ca3af',
  //   },
  //   '.Label': {
  //     fontSize: '14px',
  //     fontWeight: '500',
  //     color: '#111827',
  //   },
  //   '.Error': {
  //     color: '#dc2626',
  //     fontSize: '14px',
  //   },
  // },
}
