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
import { useSession } from 'next-auth/react'
import { Cart } from '@/payload-types'
import { fetchUserDetails } from '@/app/(app)/(pages)/account/userActions'
import { User } from '@/payload-types'
import { UseFormReturn } from 'react-hook-form'
import { addToNewsletterList } from '@/app/(app)/(pages)/cart/payment/newsletterActions'

export const PaymentForm = ({ guestData }: { guestData: any }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, clearCart, setCart } = useCart()
  const { data: session } = useSession()

  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [visibility, setVisibility] = useState('hidden')

  useEffect(() => {
    const getUserDetails = async () => {
      if (session?.user?.id) {
        try {
          const details = await fetchUserDetails(session.user.id)
        } catch (error) {
          console.error('Error fetching user details:', error)
        }
      }
    }

    getUserDetails()
  }, [session])

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
    event.preventDefault()

    if (!stripe || !elements) {
      console.log('stripe or elements not ready')
      return
    }

    setLoading(true)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      handleError(submitError)
      return
    }

    // Use the guestData or session data to update the cart
    const updatedCart = session?.user?.id
      ? {
          ...cart,
          billing: {
            orderedBy: session.user.id as unknown as number,
            email: session.user.email,
            address: session.user.billingAddress,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            contactNumber: session.user.phoneNumber,
          },
        }
      : {
          ...cart,
          billing: {
            email: guestData.email,
            address: guestData.billingAddress,
            firstName: guestData.firstName,
            lastName: guestData.lastName,
            contactNumber: guestData.phoneNumber,
          },
        }

    setCart(updatedCart)

    // save the server cart here and use it to generate the order later off the webhook
    await upsertPayloadCart(updatedCart)

    const orderNumber = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000,
    )}` as string
    const { client_secret: clientSecret } = await createPaymentIntent(updatedCart, orderNumber)

    const draftOrder = await createOrder(updatedCart, orderNumber)
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
      // If payment is successful and newsletter subscription is checked, subscribe the user
      if (guestData.subscribeToNewsletter) {
        try {
          await addToNewsletterList(guestData.email, guestData.phoneNumber)
        } catch (newsletterError) {
          console.error('Failed to subscribe to newsletter:', newsletterError)
        }
      }
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
        <PaymentElement
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

        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <LockIcon className="h-4 w-4" aria-hidden="true" />
          <span>Secure payment powered by</span>
          <a
            href="https://stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            stripe.com
          </a>
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
      borderRadius: '0px',
    },
    '.Input:focus': {
      border: 'none',
      borderBottom: '2px solid #557755',
      boxShadow: 'none',
      borderRadius: '0px',
    },
    '.Tab': {
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0px',
    },
    '.Tab:focus': {
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0px',
    },
    '.Tab--selected': {
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0px',
    },
    '.Label': {
      borderRadius: '0px',
    },
    '.Input--invalid': {
      borderRadius: '0px',
    },
    '.TabIcon': {
      borderRadius: '0px',
    },
  },
}
