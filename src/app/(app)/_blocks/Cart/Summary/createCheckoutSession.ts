// // This file contains server-side logic for creating a Stripe checkout session based on the items in a user's cart.
// // It handles mapping the cart items to Stripe line items, creating the checkout session, and returning the session URL for redirection.
// // The code is designed to work with Next.js 14's App Router and server components.

// 'use server'

// // Import the 'Cart' type from a separate file
// import { Cart } from '@/payload-types'
// import { redirect } from 'next/navigation'
// // Import the Stripe library
// import Stripe from 'stripe'

// // Initialize the Stripe instance with the secret key from environment variables
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20',
// })

// // Function to create a Stripe checkout session for the given cart

// export async function createCheckoutSession(cart: Cart) {
//   if (!cart.items || cart.items.length === 0) {
//     throw new Error('Cart is empty')
//   }

//   try {
//     const line_items = cart.items.map((item) => {
//       if (typeof item.product === 'number') {
//         throw new Error('Product is not expanded')
//       }
//       if (
//         !item.product.stripe ||
//         (!item.product.stripe.basePriceId && !item.product.stripe.salePriceId)
//       ) {
//         throw new Error('Stripe price IDs are not set for the product')
//       }
//       let priceId: string
//       if (item.product.stripe.salePriceId) {
//         priceId = item.product.stripe.salePriceId
//       } else if (item.product.stripe.basePriceId) {
//         priceId = item.product.stripe.basePriceId
//       } else {
//         throw new Error('No valid Stripe price ID found for the product')
//       }
//       const qty = item.receivers?.length || 0
//       return {
//         price: priceId,
//         quantity: qty,
//       }
//     })

//     const sessionParams: Stripe.Checkout.SessionCreateParams = {
//       line_items,
//       mode: 'payment',
//       allow_promotion_codes: true,
//       automatic_tax: { enabled: true },
//       phone_number_collection: { enabled: true },
//       billing_address_collection: 'required',
//       metadata: { cartId: cart.id.toString(), cartNumber: cart.cartNumber || '' },
//       success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/cart?id=${cart.cartNumber}`,
//     }
//     //

//     // https://docs.stripe.com/api/checkout/sessions

//     // Check for Stripe customer ID or use email for guest checkout
//     //     client_reference_idnullable string

//     // A unique string to reference the Checkout Session. This can be a customer ID, a cart ID, or similar, and can be used to reconcile the Session with your internal systems.

//     // customernullable stringExpandable

//     // The ID of the customer for this Session. For Checkout Sessions in subscription mode or Checkout Sessions with customer_creation set as always in payment mode, Checkout will create a new customer object based on information provided during the payment flow unless an existing customer was provided when the Session was created.
//     // customer_emailnullable string`

//     // If provided, this value will be used when the Customer object is created. If not provided, customers will be asked to enter their email address. Use this parameter to prefill customer data if you already have an email on file. To access information about the customer once the payment flow is complete, use the customer attribute.

//     if (
//       cart.billing?.orderedBy &&
//       typeof cart.billing.orderedBy === 'object' &&
//       cart.billing.orderedBy.stripeId
//     ) {
//       sessionParams.customer = cart.billing.orderedBy.stripeId
//     } else if (cart.billing?.email) {
//       sessionParams.customer_email = cart.billing.email
//     }

//     const session = await stripe.checkout.sessions.create(sessionParams)

//     if (session.url) {
//       // create a payload order as well
//       const newOrder = await createOrder(cart, session.id)
//       // update the session on stripe with order info
//       console.log('newOrder --', newOrder)
//       return { redirectUrl: session.url }
//     } else {
//       throw new Error('No URL returned from Stripe')
//     }
//   } catch (error) {
//     console.error('Error creating checkout session:', error)
//     throw error
//   }
// }

// // Performance considerations:
// // - Mapping cart items to Stripe line items can be inefficient for large carts.
// // - Error handling could be improved to provide more specific error messages.

// // Accessibility considerations:
// // - The checkout process should be accessible and provide alternative methods for users with disabilities.

// // State management:
// // - The cart state is managed outside this file, likely in a separate state management system or context.

// // Side effects:
// // - This function has the side effect of creating a Stripe checkout session and potentially an invoice in the future.

// import { Order } from '@/payload-types'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'

// function generateOrderNumber(): string {
//   return `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
// }

// async function isOrderNumberUnique(payload: any, orderNumber: string): Promise<boolean> {
//   const existingOrder = await payload.find({
//     collection: 'orders',
//     where: {
//       orderNumber: {
//         equals: orderNumber,
//       },
//     },
//   })
//   return existingOrder.totalDocs === 0
// }

// export async function createOrder(cart: Cart, stripeSessionId: string) {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order: Order | null = null

//   const transformedCart = {
//     ...cart,
//     items: cart.items?.map((item) => ({
//       ...item,
//       product: typeof item.product === 'object' ? item.product.id : item.product,
//       receivers: item.receivers?.map((receiver) => ({
//         ...receiver,
//         errors: undefined,
//       })),
//     })),
//   }

//   let orderNumber: string
//   do {
//     orderNumber = generateOrderNumber()
//   } while (!(await isOrderNumberUnique(payload, orderNumber)))

//   const orderData = {
//     orderNumber,
//     status: 'pending' as const,
//     stripeId: stripeSessionId,
//     totals: transformedCart.totals,
//     billing: transformedCart.billing,
//     items: transformedCart.items,
//   }

//   try {
//     order = await payload.create({
//       collection: 'orders',
//       data: orderData,
//     })
//     console.log('Order created:', order)
//     return order
//   } catch (error) {
//     console.error('Error creating order:', error)
//     throw new Error('Failed to create order')
//   }
// }
