// This file contains a React component called `StripeCheckoutButton` that handles the Stripe checkout process for a shopping cart.
// It uses several hooks and utilities from the project, including `useCart` for accessing the cart state, `createCheckoutSession` for initiating the Stripe checkout session, and `cartPageText` for displaying validation messages.
// The component renders a button that, when clicked, redirects the user to the Stripe checkout page if the cart is valid. If the cart is invalid, it displays an error message.

// Importing necessary modules and components
'use client' // This is a React Server Component directive, indicating that this component can only be used on the client-side

import { CMSLink } from '@/app/(app)/_components/CMSLink' // Importing a custom component for rendering a link
import { useCart } from '@/app/(app)/_providers/Cart' // Importing a custom hook for accessing the cart state
import { DollarSignIcon, LoaderCircleIcon } from 'lucide-react' // Importing icons from the lucide-react library
import { useEffect, useState } from 'react' // Importing React hooks for managing state and side effects
import { createCheckoutSession } from './createCheckoutSession' // Importing a function for creating a Stripe checkout session
import { cartPageText } from '@/utilities/referenceText' // Importing text content for the cart page
import { useRouter } from 'next/navigation'

// StripeCheckoutButton component
export const StripeCheckoutButton = () => {
  const router = useRouter() // Accessing the Next.js router instance

  const { cart, validCart } = useCart() // Destructuring the cart state and validCart function from the useCart hook
  const [isPending, setIsPending] = useState<boolean>(false) // State for tracking if the checkout process is pending
  const [validationMessage, setValidationMessage] = useState<string>('') // State for displaying validation messages

  // Check if the cart is valid by calling the validateCart function from the useCart hook
  // This effect runs whenever the cart or validateCart function changes
  useEffect(() => {
    setValidationMessage(validCart() ? '' : cartPageText.cartIncomplete)
  }, [cart, validCart])

  // Handle the checkout process by creating a Stripe checkout session
  const handleCheckout = async () => {
    setIsPending(true) // Set the pending state to true
    try {
      const result = await createCheckoutSession(cart) // Call the createCheckoutSession function with the cart data
      if (result.redirectUrl) {
        // If a redirect URL is returned, redirect the user to that URL
        router.push(result.redirectUrl)
      }
    } catch (error) {
      console.error('Checkout error:', error) // Log any errors that occurred during the checkout process
      setValidationMessage('An error occurred during checkout. Please try again.') // Set an error validation message
    } finally {
      setIsPending(false) // Set the pending state to false, regardless of the outcome
    }
  }

  return (
    <>
      <CMSLink
        data={{
          label: 'Proceed to Stripe Checkout', // Label for the checkout button
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
              <LoaderCircleIcon className="animate-spin" /> // Show a spinning loader icon when the checkout process is pending
            ) : (
              <DollarSignIcon strokeWidth={1.25} /> // Show a dollar sign icon when not pending
            ),
            iconPosition: 'left',
          },
        }}
        actions={{
          onClick: handleCheckout, // Call the handleCheckout function when the button is clicked
        }}
        className={`${!validCart() && 'disabled bg-gray-300'}`} // Disable and gray out the button if the cart is invalid
        pending={isPending} // Set the pending state of the button
      />
      {!validCart() && <div className="text-red-500 text-sm">{validationMessage}</div>}
    </>
  )
}
