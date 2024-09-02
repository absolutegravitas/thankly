// 'use client'

// import { loadStripe } from '@stripe/stripe-js'
// import { useEffect, useState } from 'react'
// import { createPaymentIntent } from './createPaymentIntent'
// import { useCart } from '@/app/(app)/_providers/Cart'
// import { cartPageText } from '@/utilities/referenceText'
// import { PaymentElement } from '@stripe/react-stripe-js'

// export const StripePaymentElement = () => {
//   const stripe = useStripe()
//   const elements = useElements()
//   const [isReady, setIsReady] = useState(false)

//   useEffect(() => {
//     if (stripe && elements) {
//       setIsReady(true)
//     }
//   }, [stripe, elements])

//   useEffect(() => {
//     // Create PaymentIntent as soon as the page loads
//     const getClientSecret = async () => {
//       setStripeClientSecret((await createPaymentIntent(cart)) || undefined)
//     }
//     getClientSecret()
//   }, [cart.totals.total])

//   const handleSubmit = async (event: any) => {
//     event.preventDefault()
//     if (!stripe || !elements) return
//     setProcessing(true)

//     const { error: submitError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?id={CHECKOUT_SESSION_ID}`,
//       },
//     })

//     if (submitError) {
//       setError(submitError.message ?? 'An unknown error occurred')
//     } else {
//       setMessage('An unexpected error occurred.')
//     }
//     setProcessing(false)
//   }

//   return (
//     <>
//       <PaymentElement />
//       <button
//         disabled={!stripe || !elements}
//         id="submit"
//         className={cn(
//           'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
//           buttonLook.base,
//           buttonLook.sizes.medium,
//           buttonLook.widths.full,
//           (!stripe || !elements) && 'opacity-50 cursor-not-allowed',
//         )}
//       >
//         <span id="button-text">{'Pay now'}</span>
//       </button>
//       <p className={cn(contentFormats.global, contentFormats.smallText, `text-center`)}>
//         <div className={cn('flex items-center justify-center space-x-2')}>
//           <LockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
//           <span className="text-sm text-gray-600">
//             Secure payment powered by <StripeLogo />
//           </span>
//         </div>
//       </p>
//       {error && <div>{error}</div>}
//     </>
//   )
// }
