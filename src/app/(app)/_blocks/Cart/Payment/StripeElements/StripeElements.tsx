// 'use client'

// import { useCart } from '@/app/(app)/_providers/Cart'
// import { cartPageText } from '@/utilities/referenceText'
// import {
//   AddressElement,
//   Elements,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import { useEffect, useState } from 'react'
// import { buttonLook, contentFormats } from '@/app/(app)/_css/tailwindClasses'
// import cn from '@/utilities/cn'
// import { DollarSign, LockIcon } from 'lucide-react'
// import { createPaymentIntent } from './createPaymentIntent'

// export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// export const StripeElements = () => {
//   const { cart, validCart } = useCart()
//   const [validationMessage, setValidationMessage] = useState<string>('')
//   const stripe = useStripe()
//   const elements = useElements()
//   const [errorMessage, setErrorMessage] = useState()
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (event: any) => {
//     // We don't want to let default form submission happen here,
//     // which would refresh the page.
//     event.preventDefault()
//     console.log('pre check')

//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return
//     }
//     console.log('see if this worked')
//     setLoading(true)

//     // Trigger form validation and wallet collection
//     const { error: submitError } = await elements.submit()
//     if (submitError) {
//       handleError(submitError)
//       return
//     }

//     // Create the PaymentIntent and obtain clientSecret

//     const { client_secret: clientSecret } = await createPaymentIntent(cart)

//     // dont need this if paymentIntent is already doing this at once ??
//     // Confirm the PaymentIntent using the details collected by the Payment Element
//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: 'https://example.com/order/123/complete',
//       },
//     })

//     if (error) {
//       // This point is only reached if there's an immediate error when
//       // confirming the payment. Show the error to your customer (for example, payment details incomplete)
//       handleError(error)
//     } else {
//       // Your customer is redirected to your `return_url`. For some payment
//       // methods like iDEAL, your customer is redirected to an intermediate
//       // site first to authorize the payment, then redirected to the `return_url`.
//     }
//   }

//   // Add discount code adjustment
//   //docs.stripe.com/payments/accept-a-payment-deferred?platform=web&type=payment#dynamic-updates

//   // This effect runs whenever the cart or validateCart function changes
//   useEffect(() => {
//     setValidationMessage(validCart() ? '' : cartPageText.cartIncomplete)
//   }, [cart, validCart])

//   {
//     /* FUTURE: Saved Customer Payment method */
//   }
//   {
//     /* https://docs.stripe.com/payments/accept-a-payment-deferred?platform=web&type=payment#save-payment-methods */
//   }

//   {
//     /* FUTURE: ADD THIS IF WE DONT COLLECT BILLING INFO OURSELVES */
//   }
//   {
//     /* <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-6')}>Billing Details</h2> */
//   }
//   {
//     /* <AddressElement options={{ mode: 'billing' }} /> */
//   }

//   {
//     /* {error && <div>{error}</div>} */
//   }

//   return (
//     <>
//       {validCart() ? (
//         <Elements
//           stripe={stripePromise}
//           options={{
//             amount: cart.totals.total,
//             mode: 'payment',
//             currency: 'aud',
//             appearance: { ...stripeElementsAppearance },
//           }}
//         >
//           <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-6')}>Payment</h2>
//           <form className="flex flex-col" onSubmit={handleSubmit}>
//             {/* <StripeExpressElement /> */}

//             <PaymentElement
//               options={{
//                 layout: {
//                   type: 'accordion',
//                   defaultCollapsed: false,
//                   radios: true,
//                   spacedAccordionItems: true,
//                 },
//               }}
//             />

//             <button
//               id="submit"
//               disabled={!stripe || loading}
//               className={cn(
//                 'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm flex justify-between !font-semibold text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
//                 buttonLook.base,
//                 buttonLook.sizes.medium,
//                 buttonLook.widths.full,
//               )}
//             >
//               <DollarSign /> {'Pay Now'}
//             </button>

//             <div className={cn(contentFormats.global, contentFormats.smallText, `text-center`)}>
//               <div className={cn('flex items-center justify-center space-x-2')}>
//                 <LockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
//                 <span className="text-sm text-gray-600">Secure payment powered by Stripe.com</span>
//               </div>
//             </div>
//           </form>
//         </Elements>
//       ) : (
//         <div className="text-red-500 text-sm">{validationMessage}</div>
//       )}
//     </>
//   )
// }

// const stripeElementsAppearance = {
//   theme: 'flat' as const,
//   variables: {
//     colorPrimary: '#557755',
//     colorBackground: '#f9fafb',
//     colorText: '#111827',
//     colorDanger: '#dc2626',
//     fontFamily:
//       'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
//     spacingUnit: '4px',
//     borderRadius: '0px',
//   },
//   rules: {
//     '.Input': {
//       border: 'none',
//       borderBottom: '1px solid #d1d5db',
//       boxShadow: 'none',
//       fontSize: '14px',
//       padding: '8px 4px',
//     },
//     '.Input:focus': {
//       border: 'none',
//       borderBottom: '2px solid #557755',
//       boxShadow: 'none',
//     },
//     '.Input::placeholder': {
//       color: '#9ca3af',
//     },
//     '.Label': {
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#111827',
//     },
//     '.Error': {
//       color: '#dc2626',
//       fontSize: '14px',
//     },
//   },
// }
